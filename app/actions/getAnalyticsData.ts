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
    timezonOffset?: number,
) => {
    const now = new Date();
    const dateFormat = range === "daily" ? "MMM dd" : "MMM yyyy";

    const adjustedClicks = clicks.map((click) => {
        if (timezonOffset !== undefined) {
            const adjusted = new Date(
                click.timestamp.getTime() + timezonOffset * 60000,
            );
            return { timestamp: adjusted };
        }
        return click;
    });

    let adjustedNow = now;
    if (timezonOffset !== undefined) {
        adjustedNow = new Date(now.getTime() + timezonOffset * 60000);
    }

    const interval =
        range === "daily"
            ? eachDayOfInterval({
                  start: subDays(adjustedNow, 6),
                  end: adjustedNow,
              })
            : eachMonthOfInterval({
                  start: startOfMonth(subDays(adjustedNow, 365)),
                  end: adjustedNow,
              });

    const dataMap: Record<string, number> = {};
    interval.forEach((date) => {
        dataMap[format(date, dateFormat)] = 0;
    });

    adjustedClicks.forEach((click) => {
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

export default async function getAnalyticsData(
    userId: string,
    timezoneOffset?: number,
) {
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
        dailyDataset: toDataset(clicks, "daily", timezoneOffset),
        monthlyDataset: toDataset(clicks, "monthly", timezoneOffset),
    };

    return analyticsData;
}
