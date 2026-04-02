"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function setLinkExpiry(input: {
    shortId: string;
    expiresAt: string;
}) {
    const { userId } = await auth();
    if (!userId) return { error: "Please sign in first", requiresAuth: true };
    const expiresAt = new Date(input.expiresAt);

    try {
        await prisma.link.update({
            where: { shortId: input.shortId, userId },
            data: { expiresAt },
        });
    } catch (err) {
        throw new Error("Could not set expiry to the URL");
    }
    revalidatePath("/dashboard");
    return { success: true };
}
