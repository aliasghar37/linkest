"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function addPassword(shortId: string, rawPassword: string) {
    const { userId } = await auth();
    if (!userId) return { error: "Please sign in first", requiresAuth: true };
    if (typeof rawPassword !== "string")
        return { error: "password must be of type string" };
    const password: string = rawPassword.trim();
    if (!password) return { error: "Password is required" };
    if (password.length < 6 || password.length > 12)
        return { error: "Password should contain 6 to 12 characters" };
    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const link = await prisma.link.findUnique({
            where: { shortId },
            select: { id: true, userId: true },
        });
        if (!link || link.userId !== userId)
            return { error: "Couldn't find the link or unauthorized user" };

        const resp = await prisma.link.update({
            where: { id: link.id },
            data: { password: hashPassword },
        });

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to set password:", error);
        return { error: "Couldn't set password" };
    }
}

export async function removePassword(shortId: string) {
    const { userId } = await auth();
    if (!userId)
        return { error: "Please sign in to continue", requiresAuth: true };

    try {
        const link = await prisma.link.findUnique({
            where: { shortId },
        });
        if (!link || link.userId !== userId)
            return { error: "Couldn't find link or unauthorized usre" };
        const resp = await prisma.link.update({
            where: { id: link.id },
            data: { password: null },
        });
        revalidatePath("/dashboard");
        if (resp.id) return { success: true };
    } catch (err) {
        console.error("Failed to remove password:", err);
        return { error: "Couldn't remove the link password" };
    }
}

export async function checkPassword(shortId: string, rawPassword: string) {
    if (typeof rawPassword !== "string")
        return { error: "password must be of type string" };
    const password: string = rawPassword.trim();
    if (!password) return { error: "Password is required" };
    if (password.length < 6 || password.length > 12)
        return { error: "Password should contain 6 to 12 characters" };

    try {
        const link = await prisma.link.findUnique({
            where: { shortId },
            select: { id: true, password: true },
        });
        if (!link?.id) return { error: "Couldn't find link" };
        if (link.password) {
            const resp = await bcrypt.compare(password, link.password);
            if (resp) return { success: true };
            else return { error: "Incorrect password" };
        }
    } catch (err) {
        console.error("Failed to remove password:", err);
        return { error: "Couldn't remove the link password" };
    }
    return { error: "Incorrect password" };
}
