"use server";

import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import PreviewPage from "./PreviewPage";
import ShowError from "./ShowError";

export default async function RedirectPage({
    params,
}: {
    params: Promise<{ shortId: string }>;
}) {
    const { shortId } = await params;
    const link = await prisma.link.findUnique({ where: { shortId } });
    if (!link) notFound();
    if (!link.status) {
        return <ShowError message="Short URL has been disabled by the owner" />;
    }

    if (link.expiresAt && link.expiresAt < new Date()) {
        return <ShowError message="Short URL has been expired" />;
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
