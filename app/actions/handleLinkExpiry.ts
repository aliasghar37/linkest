"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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
        await prisma.link.update({
            where: { shortId, userId },
            data: { expiresAt },
        });
        revalidatePath("/dashboard");
        return { success: true };
    } catch (err) {
        console.error("Failed to edit summary:", err);
        return { error: "Couldn't remove link expiry" };
    }
}
