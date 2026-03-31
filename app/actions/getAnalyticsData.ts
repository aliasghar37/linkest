"use server";

import prisma from "@/lib/prisma";
import {
    format,
    eachDayOfInterval,
    subDays,
    startOfMonth,
    eachMonthOfInterval,
} from "date-fns";

export default async function getAnalyticsData(
    userId: string,
    range: "daily" | "monthly",
) {
    const clicks = await prisma.click.findMany({
        where: { link: { userId } },
        orderBy: { timestamp: "asc" },
    });
    const now = new Date();
    let startDate;
    let dateFormat;
    let interval;

    if (range === "daily") {
        startDate = subDays(now, 6);
        dateFormat = "MMM dd";
        interval = eachDayOfInterval({ start: startDate, end: now });
    } else {
        startDate = startOfMonth(subDays(now, 365));
        dateFormat = "MMM yyyy";
        interval = eachMonthOfInterval({ start: startDate, end: now });
    }

    const dataMap: Record<string, number> = {};
    interval.forEach((date) => {
        dataMap[format(date, dateFormat)] = 0;
    });
    clicks.forEach((click) => {
        const dateKey = format(click.timestamp, dateFormat);
        if (dataMap[dateKey] !== undefined) {
            dataMap[dateKey]++;
        }
    });

    return Object.entries(dataMap).map(([label, clicks]) => ({
        label,
        clicks,
    }));
}
