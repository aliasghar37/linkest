"use server";

import prisma from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import QRCode from "qrcode";
import { tavily } from "@tavily/core";
import Groq from "groq-sdk";
import { redis } from "@/lib/redis";

export type FormState = {
    error?: string;
    requiresAuth?: boolean;
    longUrl?: string;
    alias?: string;
    success?: boolean;
    shortId?: string;
} | null;

export type CacheLinkType = {
    id: string;
    shortId: string;
    shortUrl: string;
    longUrl: string;
    status: boolean;
    summary: string;
    title: string;
    previewPage: boolean;
    expiresAt: Date | string | null | undefined;
    userId: string;
    password: string | null | undefined;
};

const getAndUpdateCounter = async () => {
    return await prisma.counter.update({
        where: { name: "counter" },
        data: { counter: { increment: 1 } },
    });
};

const generateQR = async (text: string): Promise<string> => {
    return await QRCode.toDataURL(text);
};

const generateSummary = async (longUrl: string) => {
    try {
        const tvly = tavily({ apiKey: process.env.TAVILY_API });
        const responseTavily = await tvly.extract([longUrl]);
        const { title, rawContent } = responseTavily.results[0];
        const groq = new Groq({ apiKey: process.env.GROQ_API });

        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: `You are a professional content summarizer. Create a concise summary of this webpage in 4-5 sentences.

                    Guidelines:
                    - Use clear, professional language
                    - Focus on the main purpose/content of the page
                    - Avoid promotional language
                    - Be objective and factual
                    - Start directly with the content, no preambles like "This page..." or "This website..."
                    - If it's an article, mention the key topic
                    - If it's a product, mention what it does
                    - If it's a service, mention what it offers
                    - If it's about coding or math, don't throw them, instead explain them`,
                },
                {
                    role: "user",
                    content: `Summarize this webpage:\n\n${rawContent}`,
                },
            ],
            max_tokens: 180,
            temperature: 0.3,
        });
        const summary = response.choices[0]?.message?.content || null;
        return { summary, title };
    } catch (error) {
        console.error("Failed to generate summary:", error);
        return { summary: null, title: null };
    }
};

const checkIfUserExists = async (userId: string) => {
    const existingUser = await prisma.user.findUnique({
        where: { clerkId: userId },
    });
    if (existingUser) return;

    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    const primaryEmail =
        clerkUser.emailAddresses.find(
            (email) => email.id === clerkUser.primaryEmailAddressId,
        )?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

    if (!primaryEmail) {
        throw new Error("No email found for signed-in user");
    }
    await prisma.user.upsert({
        where: { clerkId: userId },
        update: {},
        create: {
            clerkId: userId,
            email: primaryEmail,
            firstName: clerkUser.firstName ?? "Unknown",
            lastName: clerkUser.lastName ?? "User",
            imageUrl: clerkUser.imageUrl ?? "",
            role: "free",
        },
    });
};

const canCreateMoreLinks = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { role: true, linksCreated: true },
    });
    if (!user) {
        return {
            allowed: false,
            error: "Failed to load user profile. Please try again.",
        };
    }
    const freePlanLimit = 10;
    const isFreeLimitReached =
        user.role === "free" && user.linksCreated >= freePlanLimit;

    if (isFreeLimitReached) {
        return {
            allowed: false,
            error: "Free plan limit reached (10 links). Upgrade to Pro to create more links.",
        };
    }

    return { allowed: true };
};

export default async function shortenUrl(
    prevState: FormState,
    formData: FormData,
): Promise<FormState> {
    const longUrl = formData.get("longUrl") as string;
    if (!longUrl) return { error: "Please enter a long URL to shorten" };
    const inputAlias = formData.get("alias") as string;
    const alias =
        typeof inputAlias === "string" ? inputAlias.trim().toLowerCase() : "";

    try {
        const parsedURL = new URL(longUrl);
        const allowedProtocols = ["http:", "https:"];
        if (!allowedProtocols.includes(parsedURL.protocol)) {
            return {
                error: "Only http and https protocols are allowed for security reasons.",
            };
        }
    } catch (error) {
        return { error: "Please enter a valid URL (including http/https)" };
    }

    const { userId } = await auth();
    if (!userId)
        return {
            error: "Please sign in first",
            requiresAuth: true,
            longUrl,
            alias,
        };

    try {
        await checkIfUserExists(userId);
    } catch (error) {
        console.error("Failed to sync user:", error);
        return { error: "Failed to sync user profile. Please try again." };
    }

    const limitCheck = await canCreateMoreLinks(userId);
    if (!limitCheck.allowed) {
        return { error: limitCheck.error };
    }

    if (alias) {
        if (alias.length < 3 || alias.length > 6)
            return { error: "Alias must be 3 to 6 characters" };
        if (/\s/.test(alias)) return { error: "Alias cannot contain spaces" };
        if (!/^[a-z0-9_-]+$/.test(alias))
            return {
                error: "Alias can only contain lowercase letters, numbers, _ and -",
            };

        const hasShortId = await prisma.link.findUnique({
            where: { shortId: alias },
            select: { id: true },
        });
        if (hasShortId) {
            return { error: "This alias already exists, try again" };
        }
    }

    let uniqueId = alias;
    if (!uniqueId) {
        const base62Chars = process.env.BASE_62_CHARACTERS as string;
        try {
            let { counter } = await getAndUpdateCounter();
            if (!counter) return { error: "Couldn't get counter" };
            while (counter > 0) {
                const index = counter % 62;
                const char = base62Chars[index];
                uniqueId = char + uniqueId;
                counter = Math.floor(counter / 62);
            }
        } catch {
            return { error: "Failed to create short URL" };
        }
    } else {
        uniqueId = alias;
    }

    try {
        const domain = process.env.NEXT_PUBLIC_APP_URL;
        const shortUrl = `${domain}/${uniqueId}`;
        const qrCode = await generateQR(shortUrl);
        const { summary, title } = await generateSummary(longUrl);

        const [link] = await prisma.$transaction([
            prisma.link.create({
                data: {
                    shortId: uniqueId,
                    shortUrl,
                    longUrl,
                    qrCode,
                    user: {
                        connect: {
                            clerkId: userId,
                        },
                    },
                    clicks: 0,
                    status: true,
                    summary: summary ?? "No summary available",
                    title: title ?? "No title available",
                    previewPage: true,
                },
            }),
            prisma.user.update({
                where: { clerkId: userId },
                data: { linksCreated: { increment: 1 } },
            }),
        ]);
        const cacheLink: CacheLinkType = {
            id: link.id,
            shortId: link.shortId,
            shortUrl: link.shortUrl,
            longUrl: link.longUrl,
            status: link.status,
            summary: link.summary,
            title: link.title,
            previewPage: link.previewPage,
            expiresAt: link.expiresAt,
            userId: link.userId,
            password: link.password,
        };
        await redis.set(`link-${uniqueId}`, JSON.stringify(cacheLink), {
            ex: 86400,
        });

        return { success: true, shortId: uniqueId };
    } catch (error) {
        console.error("Failed to create link:", error);
        return { error: "Failed to create short URL" };
    }
}
