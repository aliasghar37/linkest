import getAnalyticsData from "@/app/actions/getAnalyticsData";
import TickPlacementBars from "./AnalyticsClient";
import { auth } from "@clerk/nextjs/server";

export default async function AnalyticsPage() {
    const { userId } = await auth();
    if (!userId) {
        return { error: "Please sign in first", requiresAuth: true };
    }
    const dailyDataset = await getAnalyticsData(userId, "daily");
    const monthlyDataset = await getAnalyticsData(userId, "monthly");

    return (
        <TickPlacementBars
            dailyDataset={dailyDataset}
            monthlyDataset={monthlyDataset}
        />
    );
}
