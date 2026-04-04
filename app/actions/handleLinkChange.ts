"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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

    const response = await prisma.link.updateMany({
        where: { userId, shortId },
        data: { previewPage, status },
    });
    if (response.count) return { success: true };
}
