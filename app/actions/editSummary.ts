"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function editSummary(rawSummary: string, shortId: string) {
    const { userId } = await auth();
    if (!userId) return { error: "Please sign in first", requiresAuth: true };

    if (typeof rawSummary !== "string" || typeof shortId !== "string") {
        return { error: "Invalid request payload" };
    }

    const summary = rawSummary.trim();
    if (summary.length > 1000)
        return { error: "Summary can contain max 1000 characters" };
    if (!summary) return { error: "Summary can't be empty" };
    if (!/^[\w\s\p{P}\p{L}]{1,1000}$/u.test(summary))
        return { error: "Summary contains invalid characters" };

    try {
        const link = await prisma.link.findUnique({
            where: { shortId },
            select: { id: true, userId: true },
        });
        if (!link || link.userId !== userId)
            return { error: "Link not found or unauthorized" };
        await prisma.link.update({
            where: { id: link.id },
            data: { summary },
        });
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to edit summary:", error);
        return { error: "Couldn't update the link summary" };
    }
}
