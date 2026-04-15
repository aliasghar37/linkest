"use client";

import { useEffect, useState } from "react";
import getAnalyticsData from "@/app/actions/getAnalyticsData";
import TickPlacementBars from "./AnalyticsClient";
import { useAuth } from "@clerk/nextjs";

type AnalyticsPoint = {
    label: string;
    clicks: number;
};

type AnalyticsData = {
    dailyDataset: AnalyticsPoint[];
    monthlyDataset: AnalyticsPoint[];
};

export default function AnalyticsPage() {
    const { userId } = useAuth();
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const fetchAnalytics = async () => {
            const timezoneOffset = new Date().getTimezoneOffset() * -1;
            
            const data = await getAnalyticsData(userId, timezoneOffset);
            setAnalyticsData(data);
            setLoading(false);
        };

        fetchAnalytics();
    }, [userId]);

    if (loading) {
        return <div style={{ height: 300, width: "100%" }} />;
    }

    if (!analyticsData) {
        return <div>No data available</div>;
    }

    return (
        <TickPlacementBars
            dailyDataset={analyticsData.dailyDataset}
            monthlyDataset={analyticsData.monthlyDataset}
        />
    );
}
