"use client";

import LinkForm from "@/components/LinkForm";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function AddLinkClient() {
    const searchParams = useSearchParams();
    const pendingUrl = searchParams.get("pendingUrl") ?? "";
    const pendingAlias = searchParams.get("pendingAlias") ?? "";

    useEffect(() => {
        if (pendingUrl) {
            const newUrl = window.location.pathname;
            window.history.replaceState({}, "", newUrl);
        }
    }, [pendingUrl]);

    return (
        <LinkForm
            align="start"
            initialValue={pendingUrl}
            alias={pendingAlias}
            page="dashboard"
        />
    );
}
