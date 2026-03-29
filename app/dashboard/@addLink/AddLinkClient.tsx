"use client";

import LinkForm from "@/components/LinkForm";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddLinkClient() {
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

    return <LinkForm align="start" initialValue={pendingUrl} />;
}
