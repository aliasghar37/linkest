import { NextResponse } from "next/server";
import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId)
            return { error: "Please signin first", requiresAuth: true };
        const body = (await req.json()) as { amount?: number };
        const amount = Number(body?.amount);
        if (!Number.isFinite(amount) || amount <= 0) {
            return NextResponse.json(
                { error: "Invalid amount" },
                { status: 400 },
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
            submit_type: "pay",
            payment_method_types: ["card"],
            metadata: {
                userId: userId,
            },
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: "Linkest Pro Plan",
                            description:
                                "Unlimited links, analytics, AI generated summaries, and password protection",
                        },
                        unit_amount: 1000,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
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
