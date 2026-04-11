import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId)
            return NextResponse.json(
                { error: "Please sign in to continue" },
                { status: 401 },
            );

        const priceId = process.env.STRIPE_PRICE_ID;
        if (!priceId) {
            return NextResponse.json(
                { error: "Missing Stripe price configuration" },
                { status: 500 },
            );
        }

        const origin =
            req.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL;
        if (!origin) {
            return NextResponse.json(
                { error: "Missing origin" },
                { status: 400 },
            );
        }
        const params: Parameters<typeof stripe.checkout.sessions.create>[0] = {
            submit_type: "subscribe",
            payment_method_types: ["card"],
            client_reference_id: userId,
            metadata: {
                userId,
            },
            subscription_data: {
                metadata: {
                    userId,
                },
            },
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/dashboard`,
        };

        const checkoutSession = await stripe.checkout.sessions.create(params);
        return NextResponse.json(checkoutSession, { status: 200 });
    } catch (error) {
        const msg =
            error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
