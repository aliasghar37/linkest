"use server";

import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import PreviewPage from "./PreviewPage";
import ShowError from "./ShowError";
import { redis } from "@/lib/redis";
import { type CacheLinkType } from "../actions/handleLinkForm";
import { Link } from "../dashboard/@links/page";

export default async function RedirectPage({
    params,
}: {
    params: Promise<{ shortId: string }>;
}) {
    const { shortId } = await params;
    let isCacheHit = false;
    const cachedLink: string | null = await redis.get(`link-${shortId}`);
    let link: CacheLinkType | Link | null = null;
    if (cachedLink) {
        try {
            link = JSON.parse(cachedLink) as CacheLinkType;
            isCacheHit = true;
        } catch {
            await redis.del(`link-${shortId}`);
        }
    }
    if (!link) {
        link = await prisma.link.findUnique({ where: { shortId } });
    }
    if (!link) notFound();
    if (!link.status) {
        return <ShowError message="Short URL has been disabled by the owner" />;
    }
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
        return <ShowError message="Short URL has been expired" />;
    }
    if (!isCacheHit) {
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
        await redis.set(`link-${shortId}`, JSON.stringify(cacheLink), {
            ex: 86400,
        });
    }

    try {
        await prisma.$transaction([
            prisma.link.update({
                where: { shortId },
                data: { clicks: { increment: 1 } },
            }),
            prisma.click.create({
                data: { linkId: link.id, timestamp: new Date() },
            }),
        ]);
    } catch (err) {
        console.error(
            "Transaction failed, all changes rolled back. Could not update click data for link",
            err,
        );
    }
    if (link.previewPage) {
        return <PreviewPage link={link} />;
    }
    redirect(link.longUrl);
}
