"use client";

import { useState, MouseEvent } from "react";
import dynamic from "next/dynamic";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
type TickPlacementBarsProps = {
    dailyDataset: AnalyticsPoint[];
    monthlyDataset: AnalyticsPoint[];
};

type AnalyticsPoint = {
    label: string;
    clicks: number;
};

const BarChart = dynamic(
    () => import("@mui/x-charts/BarChart").then((mod) => mod.BarChart),
    {
        ssr: false,
        loading: () => <div style={{ height: 300, width: "100%" }} />,
    },
);

const chartSetting = {
    yAxis: [
        {
            label: "Clicks",
            width: 60,
        },
    ],
    series: [{ dataKey: "clicks", label: "Clicks" }],
    height: 300,
    margin: { left: 0 },
};

export default function TickPlacementBars({
    dailyDataset,
    monthlyDataset,
}: TickPlacementBarsProps) {
    const [tickPlacement] = useState<
        "start" | "end" | "middle" | "extremities"
    >("middle");
    const [tickLabelPlacement] = useState<"middle" | "tick">("middle");
    const [alignment, setAlignment] = useState<"daily" | "monthly">("daily");

    const dataset = alignment === "daily" ? dailyDataset : monthlyDataset;

    const handleChange = (
        _event: MouseEvent<HTMLElement>,
        newAlignment: "daily" | "monthly" | null,
    ) => {
        if (!newAlignment) return;
        setAlignment(newAlignment);
    };

    return (
        <div style={{ width: "100%" }}>
            <BarChart
                dataset={dataset}
                xAxis={[
                    { dataKey: "label", tickPlacement, tickLabelPlacement },
                ]}
                {...chartSetting}
            />
            <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleChange}
                aria-label="Platform"
                style={{ display: "flex", justifyContent: "center" }}
            >
                <ToggleButton value="daily">Daily</ToggleButton>
                <ToggleButton value="monthly">Monthly</ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
}
