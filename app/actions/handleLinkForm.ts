"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import QRCode from "qrcode";
import { tavily } from "@tavily/core";
import Groq from "groq-sdk";

export type FormState = {
    error?: string;
    requiresAuth?: boolean;
    longUrl?: string;
    success?: boolean;
    shortId?: string;
} | null;

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
            max_tokens: 300,
            temperature: 0.3,
        });
        const summary = response.choices[0]?.message?.content || null;
        return { summary, title };
    } catch (error) {
        console.error("Failed to generate summary:", error);
        return { summary: null, title: null };
    }
};

export default async function shortenUrl(
    prevState: FormState,
    formData: FormData,
): Promise<FormState> {
    const longUrl = formData.get("longUrl") as string;
    if (!longUrl) return { error: "Please enter a long URL to shorten" };

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
        if (!counter) return { error: "Couldn't get counter" };
        while (counter > 0) {
            if (counter === 0) {
                uniqueId = base62Chars[0];
            } else {
                const index = counter % 62;
                const char = base62Chars[index];
                uniqueId = char + uniqueId;
                counter = Math.floor(counter / 62);
            }
        }
    } catch {
        return { error: "Failed to create short URL" };
    }
    const domain = process.env.NEXT_PUBLIC_APP_URL;
    const shortUrl = `${domain}/${uniqueId}`;

    try {
        const qrCode = await generateQR(shortUrl);
        const { summary, title } = await generateSummary(longUrl);

        await prisma.link.create({
            data: {
                shortId: uniqueId,
                shortUrl,
                longUrl,
                qrCode,
                userId,
                clicks: 0,
                status: true,
                summary: summary as string,
                title: title as string,
            },
        });
        // Cache in redis (ADD LATER)

        return { success: true, shortId: uniqueId };
    } catch (error) {
        console.error("Failed to create link:", error);
        return { error: "Failed to create short URL" };
    }
}
