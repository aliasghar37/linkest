"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { CacheLinkType } from "./handleLinkForm";
import { redis } from "@/lib/redis";
import { Link } from "../dashboard/@links/page";

export default async function editSummary(rawSummary: string, shortId: string) {
    const { userId } = await auth();
    if (!userId) return { error: "Please sign in first", requiresAuth: true };

    if (typeof rawSummary !== "string" || typeof shortId !== "string") {
        return { error: "Invalid request payload" };
    }

    const summary = rawSummary.trim();
    if (summary.length > 1000)
        return { error: "Summary can contain max 1000 characters" };
    if (!summary) return { error: "Summary can't be empty" };
    if (!/^[\w\s\p{P}\p{L}]{1,1000}$/u.test(summary))
        return { error: "Summary contains invalid characters" };

    try {
        const linkFound = await prisma.link.findUnique({
            where: { shortId },
        });
        if (!linkFound || linkFound.userId !== userId)
            return { error: "Link not found or unauthorized" };
        const link: Link = await prisma.link.update({
            where: { id: linkFound.id },
            data: { summary },
        });
        const cacheLink: CacheLinkType = {
            id: link.id,
            shortId: link.shortId,
            shortUrl: link.shortUrl,
            longUrl: link.longUrl,
            status: link.status,
            summary: link.summary,
            title: link.title,
            previewPage: link.previewPage,
            expiresAt: link.expiresAt,
            userId: link.userId,
            password: link.password,
        };

        const redisTransc = redis.multi();
        redisTransc.del(`link-${shortId}`);
        redisTransc.set(`link-${shortId}`, JSON.stringify(cacheLink), {
            ex: 86400,
        });
        const redisRes = await redisTransc.exec();
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to edit summary:", error);
        return { error: "Couldn't update the link summary" };
    }
}
