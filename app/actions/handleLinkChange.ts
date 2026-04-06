"use server";

import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { auth } from "@clerk/nextjs/server";
import { CacheLinkType } from "./handleLinkForm";

type LinkData = {
    userId: string;
    shortId: string;
    previewPage?: boolean;
    status?: boolean;
};

export default async function updateLink({
    shortId,
    previewPage,
    status,
}: LinkData) {
    const { userId } = await auth();
    if (!userId) return { error: "Please sign in first", requiresAuth: true };

    const link = await prisma.link.update({
        where: { userId, shortId },
        data: { previewPage, status },
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
    const redisResp = await redisTransc.exec();
    console.log("REDIS RESP IN LINK CHANGE", redisResp);
    if (link.id) return { success: true };
    else return { error: true };
}
