"use client";

import LinkForm from "@/components/LinkForm";
import BasicCard from "@/components/BasicCard";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddLink() {
    const searchParams = useSearchParams();
    const [pendingUrl, setPendingUrl] = useState("");

    useEffect(() => {
        const url = searchParams.get("pendingUrl");
        if (url) {
            setPendingUrl(url);
            const newUrl = window.location.pathname;
            window.history.replaceState({}, "", newUrl);
        }
    }, [searchParams]);

    return (
        <div>
            <h1 className="text-5xl text-center md:text-start pb-4 ">
                Dashboard
            </h1>
            <LinkForm align="start" initialValue={pendingUrl} />
            <div className="grid grid-cols-2 gap-4 pt-12 content-center ">
                <BasicCard label="Total Links" value="45" />
                <BasicCard label="Total Clicks" value="378" />
            </div>
        </div>
    );
}
