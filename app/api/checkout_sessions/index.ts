import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const currency = "usd";

const formatAmountForStripe = (amount: number): number => {
    return Math.round(amount * 100);
};

export async function POST(req: Request) {
    try {
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
            submit_type: "donate",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: currency,
                        product_data: { name: "Linkest Pro Account" },
                        unit_amount: formatAmountForStripe(amount),
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${origin}/result?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/result?session_id={CHECKOUT_SESSION_ID}`,
        };

        const checkoutSession = await stripe.checkout.sessions.create(params);
        return NextResponse.json(checkoutSession, { status: 200 });
    } catch (error) {
        const msg =
            error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
