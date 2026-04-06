"use server";

import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function deleteLink({ shortId }: { shortId: string }) {
    const { userId } = await auth();
    if (!userId) return { error: "Please sign in first", requiresAuth: true };

    const link = await prisma.link.findUnique({
        where: { shortId },
        select: { id: true, userId: true },
    });
    if (!link || link.userId !== userId) {
        return { error: "Link not found or unauthorized" };
    }

    await prisma.$transaction([
        prisma.click.deleteMany({ where: { linkId: link.id } }),
        prisma.link.delete({ where: { shortId } }),
    ]);
    await redis.del(`link-${shortId}`);
    revalidatePath("/dashboard");
    return { success: true };
}
