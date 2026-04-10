"use server";

import prisma from "@/lib/prisma";
import {
    eachDayOfInterval,
    eachMonthOfInterval,
    format,
    startOfMonth,
    subDays,
} from "date-fns";

type AnalyticsPoint = {
    label: string;
    clicks: number;
};

type AnalyticsData = {
    dailyDataset: AnalyticsPoint[];
    monthlyDataset: AnalyticsPoint[];
};

const toDataset = (
    clicks: Array<{ timestamp: Date }>,
    range: "daily" | "monthly",
) => {
    const now = new Date();
    const dateFormat = range === "daily" ? "MMM dd" : "MMM yyyy";
    const interval =
        range === "daily"
            ? eachDayOfInterval({ start: subDays(now, 6), end: now })
            : eachMonthOfInterval({
                  start: startOfMonth(subDays(now, 365)),
                  end: now,
              });

    const dataMap: Record<string, number> = {};
    interval.forEach((date) => {
        dataMap[format(date, dateFormat)] = 0;
    });

    clicks.forEach((click) => {
        const dateKey = format(click.timestamp, dateFormat);
        if (dataMap[dateKey] !== undefined) {
            dataMap[dateKey] += 1;
        }
    });

    return Object.entries(dataMap).map(([label, clicks]) => ({
        label,
        clicks,
    }));
};

export default async function getAnalyticsData(userId: string) {
    const oneYearAgo = startOfMonth(subDays(new Date(), 365));

    const clicks = await prisma.click.findMany({
        where: {
            link: { userId },
            timestamp: { gte: oneYearAgo },
        },
        select: { timestamp: true },
        orderBy: { timestamp: "asc" },
    });

    const analyticsData: AnalyticsData = {
        dailyDataset: toDataset(clicks, "daily"),
        monthlyDataset: toDataset(clicks, "monthly"),
    };

    return analyticsData;
}
