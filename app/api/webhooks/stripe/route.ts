import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const runtime = "nodejs";

const getCustomerId = (subscription: Stripe.Subscription) => {
    const customerId =
        typeof subscription.customer === "string"
            ? subscription.customer
            : subscription.customer.id;

    return customerId;
};

const findUserForSubscription = async (subscription: Stripe.Subscription) => {
    const customerId = getCustomerId(subscription);
    const metadataUserId = subscription.metadata?.userId;
    const userBySubscription = await prisma.user.findFirst({
        where: { stripeSubscriptionId: subscription.id },
    });

    if (userBySubscription) return userBySubscription;
    const userByCustomer = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
    });

    if (userByCustomer) return userByCustomer;
    if (!metadataUserId) return null;
    return prisma.user.findUnique({
        where: { clerkId: metadataUserId },
    });
};

const updateUserSubscription = async (subscription: Stripe.Subscription) => {
    const user = await findUserForSubscription(subscription);
    if (!user) return;

    const customerId = getCustomerId(subscription);
    const activeStatuses = ["active", "trialing"];
    const isPro = activeStatuses.includes(subscription.status);

    const periodEndUnix =
        (
            subscription as Stripe.Subscription & {
                current_period_end?: number;
            }
        ).current_period_end ?? null;

    await prisma.user.update({
        where: { id: user.id },
        data: {
            role: isPro ? "pro" : "free",
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price.id ?? null,
            subscriptionStatus: subscription.status,
            currentPeriodEnd: periodEndUnix
                ? new Date(periodEndUnix * 1000)
                : null,
        },
    });
};

export async function POST(req: Request) {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
        return NextResponse.json(
            { error: "Missing signature" },
            { status: 400 },
        );
    }
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!,
        );
    } catch (err: any) {
        return NextResponse.json(
            { error: `Webhook Error: ${err.message}` },
            { status: 400 },
        );
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                if (!session.subscription) break;

                const subscriptionId =
                    typeof session.subscription === "string"
                        ? session.subscription
                        : session.subscription.id;
                const subscription =
                    await stripe.subscriptions.retrieve(subscriptionId);
                await updateUserSubscription(subscription);
                break;
            }
            case "customer.subscription.created":
            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;
                await updateUserSubscription(subscription);
                break;
            }
            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                const user = await findUserForSubscription(subscription);
                if (user) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            role: "free",
                            stripeSubscriptionId: null,
                            stripePriceId: null,
                            subscriptionStatus: "canceled",
                            currentPeriodEnd: null,
                        },
                    });
                }
                break;
            }
            case "invoice.payment_failed": {
                const invoice = event.data.object as Stripe.Invoice;
                const customerId =
                    typeof invoice.customer === "string"
                        ? invoice.customer
                        : invoice.customer?.id;

                if (!customerId) break;

                const user = await prisma.user.findFirst({
                    where: { stripeCustomerId: customerId },
                });

                if (user) {
                    await prisma.user.update({
                        where: { id: user.id },
                        data: {
                            role: "free",
                            subscriptionStatus: "past_due",
                        },
                    });
                }
                break;
            }
            default:
                break;
        }
        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Internal error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
