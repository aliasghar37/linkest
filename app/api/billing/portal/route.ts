import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json(
            { error: "Please sign in to continue" },
            { status: 401 },
        );
    }

    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
    });

    if (!user?.stripeCustomerId) {
        return NextResponse.json(
            { error: "No billing customer found" },
            { status: 400 },
        );
    }

    const origin =
        req.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;

    if (!origin) {
        return NextResponse.json({ error: "Missing origin" }, { status: 400 });
    }

    const session = await stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: `${origin}/dashboard`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
}
