"use server";

import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import PreviewPage from "./PreviewPage";

export default async function RedirectPage({
    params,
}: {
    params: Promise<{ shortId: string }>;
}) {
    const { shortId } = await params;
    const link = await prisma.link.findUnique({ where: { shortId } });
    if (!link) notFound();
    if (!link.status) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold">
                    This link has been disabled by the owner.
                </h1>
            </div>
        );
    }

    prisma.link
        .update({
            where: { shortId },
            data: { clicks: { increment: 1 } },
        })
        .catch((err) => console.error("Click tracking failed", err));

    if (link.previewPage) {
        return <PreviewPage link={link} />;
    }
    redirect(link.longUrl);
}
