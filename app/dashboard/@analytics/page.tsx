import getAnalyticsData from "@/app/actions/getAnalyticsData";
import TickPlacementBars from "./AnalyticsClient";
import { auth } from "@clerk/nextjs/server";

export default async function AnalyticsPage() {
    const { userId } = await auth();
    if (!userId) return;
    const analyticsData = await getAnalyticsData(userId);

    return (
        <TickPlacementBars
            dailyDataset={analyticsData.dailyDataset}
            monthlyDataset={analyticsData.monthlyDataset}
        />
    );
}
