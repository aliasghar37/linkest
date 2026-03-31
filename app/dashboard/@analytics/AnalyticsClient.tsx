"use client";

import { useState, MouseEvent } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
// const dataset = [
//     {
//         london: 59,
//         paris: 57,
//         newYork: 86,
//         seoul: 21,
//         month: "Jan",
//     },
//     {
//         london: 50,
//         paris: 52,
//         newYork: 78,
//         seoul: 28,
//         month: "Feb",
//     },
//     {
//         london: 47,
//         paris: 53,
//         newYork: 106,
//         seoul: 41,
//         month: "Mar",
//     },
//     {
//         london: 54,
//         paris: 56,
//         newYork: 92,
//         seoul: 73,
//         month: "Apr",
//     },
//     {
//         london: 57,
//         paris: 69,
//         newYork: 92,
//         seoul: 99,
//         month: "May",
//     },
//     {
//         london: 60,
//         paris: 63,
//         newYork: 103,
//         seoul: 144,
//         month: "June",
//     },
//     {
//         london: 59,
//         paris: 60,
//         newYork: 105,
//         seoul: 319,
//         month: "July",
//     },
//     {
//         london: 65,
//         paris: 60,
//         newYork: 106,
//         seoul: 249,
//         month: "Aug",
//     },
//     {
//         london: 51,
//         paris: 51,
//         newYork: 95,
//         seoul: 131,
//         month: "Sept",
//     },
//     {
//         london: 60,
//         paris: 65,
//         newYork: 97,
//         seoul: 55,
//         month: "Oct",
//     },
//     {
//         london: 67,
//         paris: 64,
//         newYork: 76,
//         seoul: 48,
//         month: "Nov",
//     },
//     {
//         london: 61,
//         paris: 70,
//         newYork: 103,
//         seoul: 25,
//         month: "Dec",
//     },
// ];

type AnalyticsPoint = {
    label: string;
    clicks: number;
};

type TickPlacementBarsProps = {
    dailyDataset: AnalyticsPoint[];
    monthlyDataset: AnalyticsPoint[];
};

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
    const [alignment, setAlignment] = useState("daily");

    const dataset = alignment === "daily" ? dailyDataset : monthlyDataset;

    const handleChange = (
        event: MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
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
