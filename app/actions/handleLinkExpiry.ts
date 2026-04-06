"use server";

import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { CacheLinkType } from "./handleLinkForm";
import { Link } from "../dashboard/@links/page";

const updateRedis = async (link: Link, shortId: string) => {
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
    console.log("REDIS RESPONSE IN LINK EXPIRY", redisRes);
};

export async function setLinkExpiry({
    shortId,
    expiry,
}: {
    shortId: string;
    expiry: string;
}) {
    const { userId } = await auth();
    if (!userId) return { error: "Please sign in first", requiresAuth: true };
    const expiresAt = new Date(expiry);
    if (Number.isNaN(expiresAt.getTime())) {
        return { error: "Invalid expiry date" };
    }

    try {
        const link = await prisma.link.findUnique({
            where: { shortId },
            select: { id: true, userId: true },
        });
        if (!link || link.userId !== userId)
            return { error: "Couldn't find link or unauthorized usre" };
        const res = await prisma.link.update({
            where: { shortId: shortId },
            data: { expiresAt },
        });
        await updateRedis(res, shortId);
        revalidatePath("/dashboard");
        if (res.id) return { success: true };
    } catch (err) {
        console.error("Failed to edit summary:", err);
        return { error: "Couldn't set expiry to the Link" };
    }
}

export async function removeLinkExpiry({
    shortId,
    expiresAt,
}: {
    shortId: string;
    expiresAt: null;
}) {
    const { userId } = await auth();
    if (!userId) return { error: "Please sign in first", requiresAuth: true };

    try {
        const link = await prisma.link.update({
            where: { shortId, userId },
            data: { expiresAt },
        });
        await updateRedis(link, shortId);
        if (link.id) {
            revalidatePath("/dashboard");
            return { success: true };
        } else return { error: true };
    } catch (err) {
        console.error("Failed to edit summary:", err);
        return { error: "Couldn't remove link expiry" };
    }
}
