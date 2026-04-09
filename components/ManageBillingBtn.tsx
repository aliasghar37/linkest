"use client";

import Button from "@mui/material/Button";
import type { ButtonProps } from "@mui/material/Button";
import { useState } from "react";
import { useAlert } from "./AlertContext";

type ManageBillingButtonProps = {
    fullWidth?: boolean;
    size?: ButtonProps["size"];
};

export default function ManageBillingButton({
    fullWidth = false,
    size = "medium",
}: ManageBillingButtonProps) {
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();

    const handleManageBilling = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/billing/portal", {
                method: "POST",
            });
            const data = (await response.json()) as {
                url?: string;
                error?: string;
            };

            if (!response.ok || !data.url) {
                showAlert(
                    data.error ?? "Unable to open billing portal",
                    "error",
                );
                return;
            }
            window.location.assign(data.url);
        } catch {
            showAlert("Unable to open billing portal", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            fullWidth={fullWidth}
            variant="text"
            color="primary"
            size={size}
            onClick={handleManageBilling}
            disabled={loading}
        >
            {loading ? "Opening..." : "Manage billing"}
        </Button>
    );
}
