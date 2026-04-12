import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ status: "signed-out" as const });
    }
    const user = await prisma.user.findUnique({
        where: { clerkId: userId },
        select: { role: true },
    });
    if (user?.role === "pro")
        return NextResponse.json({ status: "pro" as const });

    return NextResponse.json({ status: "free" as const });
}
