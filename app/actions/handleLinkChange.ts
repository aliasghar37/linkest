"use server";

import prisma from "@/lib/prisma";

type LinkData = {
    userId: string;
    shortId: string;
    previewPage?: boolean;
    status?: boolean;
};

export default async function updateLink({
    userId,
    shortId,
    previewPage,
    status,
}: LinkData) {
    const response = await prisma.link.updateMany({
        where: { userId, shortId },
        data: { previewPage, status },
    });
    return response;
}
