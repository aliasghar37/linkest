"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import QRCode from "qrcode";

export type FormState = {
    error?: string;
    requiresAuth?: boolean;
    longUrl?: string;
} | null;

const getAndUpdateCounter = async () => {
    return await prisma.counter.update({
        where: { name: "link_counter" },
        data: { counter: { increment: 1 } },
    });
};

const generateQR = async (text: string): Promise<string> => {
    return await QRCode.toDataURL(text);
};

export default async function shortenUrl(
    prevState: FormState,
    formData: FormData,
) {
    const longUrl = formData.get("longUrl") as string;
    if (!longUrl) throw new Error("Please enter a long URL");

    try {
        new URL(longUrl);
    } catch (error) {
        return { error: "Please enter a valid URL" };
    }

    const { userId } = await auth();
    if (!userId)
        return { error: "Please sign in first", requiresAuth: true, longUrl };

    const base62Chars = process.env.BASE_62_CHARACTERS as string;
    let uniqueId = "";
    try {
        let { counter } = await getAndUpdateCounter();
        while (counter > 0) {
            const index = counter % 62;
            const char = base62Chars[index];
            uniqueId += char;
            counter = Math.floor(counter / 62);
        }
    } catch {
        return { error: "Failed to create short URL" };
    }
    const domain = process.env.NEXT_PUBLIC_APP_URL;
    const shortUrl = `${domain}/${uniqueId}`;

    try {
        const qrCode = await generateQR(shortUrl);

        await prisma.link.create({
            data: {
                shortId: uniqueId,
                shortUrl,
                longUrl,
                qrCode,
                userId,
                clicks: 0,
                status: true,
            },
        });
        // Cache in redis (ADD LATER)
    } catch (error) {
        console.error("Failed to create link:", error);
        return { error: "Failed to create short URL" };
    }
    redirect(`dashboard?new=${uniqueId}`);
}
