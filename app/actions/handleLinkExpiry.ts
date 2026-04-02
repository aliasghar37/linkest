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
        await prisma.link.update({
            where: { shortId: shortId, userId },
            data: { expiresAt },
        });
    } catch (err) {
        throw new Error("Could not set expiry to the URL");
    }
    revalidatePath("/dashboard");
    return { success: true };
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
    } catch (err) {
        throw new Error("Could not remove expiry from the URL");
    }
    revalidatePath("/dashboard");
    return { success: true };
}
