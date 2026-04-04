import AddLinkClient from "./AddLinkClient";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import BasicCard from "@/components/BasicCard";
import { stat } from "fs";

type Stats = {
    links: number;
    clicks: number;
};

export default async function AddLink() {
    const { userId } = await auth();
    if (!userId) return { error: "Please sign in first", requiresAuth: true };

    const [user, clickAgg] = await prisma.$transaction([
        prisma.user.findUnique({
            where: { clerkId: userId },
            select: { linksCreated: true },
        }),
        prisma.link.aggregate({
            where: { userId },
            _sum: { clicks: true },
        }),
    ]);

    const stats: Stats = {
        links: user?.linksCreated ?? 0,
        clicks: clickAgg._sum.clicks ?? 0,
    };

    return (
        <div>
            <h1 className="text-5xl text-center md:text-start pb-4">
                Dashboard
            </h1>
            <div>
                <AddLinkClient />
                <div className="grid grid-cols-2 gap-4 pt-12 content-center ">
                    <BasicCard label="Links Created" value={`${stats.links}`} />
                    <BasicCard label="Total Clicks" value={`${stats.clicks}`} />
                </div>
            </div>
        </div>
    );
}
