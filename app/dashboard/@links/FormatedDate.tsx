"use client";
import { useState, useEffect } from "react";

export default function FormattedDate({ date }: { date: string | Date }) {
    const [formattedDate, setFormattedDate] = useState("");

    useEffect(() => {
        const newDate = new Date(date);
        const time = newDate.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
        const dayMonth = newDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });

        setFormattedDate(`${time} ${dayMonth}`);
    }, [date]);

    return <span>{formattedDate || "loading..."}</span>;
}
