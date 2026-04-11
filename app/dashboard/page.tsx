import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PRO_SUBSCRIPTION_STATUSES: Stripe.Subscription.Status[] = [
    "active",
    "trialing",
];

type DashboardPageProps = {
    searchParams?: Promise<{
        session_id?: string;
    }>;
};

export default async function DashboardPage({
    searchParams,
}: DashboardPageProps) {
    const params = (await searchParams) ?? {};
    const sessionId = params.session_id;

    if (!sessionId) return null;

    const { userId } = await auth();
    if (!userId) {
        redirect("/dashboard");
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["subscription"],
    });

    const sessionUserId =
        session.client_reference_id ?? session.metadata?.userId ?? null;
    if (sessionUserId !== userId) {
        redirect("/dashboard");
    }

    if (session.mode !== "subscription") {
        redirect("/dashboard");
    }

    let subscription: Stripe.Subscription | null = null;
    if (session.subscription) {
        if (typeof session.subscription === "string") {
            subscription = await stripe.subscriptions.retrieve(
                session.subscription,
            );
        } else {
            subscription = session.subscription;
        }
    }

    if (!subscription) {
        redirect("/dashboard");
    }

    const customerId =
        typeof session.customer === "string"
            ? session.customer
            : (session.customer?.id ?? null);
    const periodEndUnix =
        (
            subscription as Stripe.Subscription & {
                current_period_end?: number;
            }
        ).current_period_end ?? null;

    await prisma.user.update({
        where: { clerkId: userId },
        data: {
            role: PRO_SUBSCRIPTION_STATUSES.includes(subscription.status)
                ? "pro"
                : "free",
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0]?.price.id ?? null,
            subscriptionStatus: subscription.status,
            currentPeriodEnd: periodEndUnix
                ? new Date(periodEndUnix * 1000)
                : null,
        },
    });

    redirect("/dashboard");
}
