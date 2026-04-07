"use client";

import { SubmitEvent, useState } from "react";
import Stack from "@mui/material/Stack";
import { useAlert } from "./AlertContext";

type CheckoutSessionResponse = {
    id: string;
    url?: string | null;
};
type CheckoutErrorResponse = {
    error?: string;
};

export default function CheckoutForm() {
    const [amount, setAmount] = useState<string>("10");
    const [loading, setLoading] = useState<boolean>(false);
    const { showAlert } = useAlert();

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const numericAmount = Number(amount);
        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            showAlert("Please enter a valid amount, greater than 0", "error");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("/api/checkout_sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: numericAmount }),
            });

            const data = (await response.json()) as
                | CheckoutSessionResponse
                | CheckoutErrorResponse;

            if (!response.ok || !("id" in data)) {
                const message =
                    "error" in data && data.error
                        ? data.error
                        : "Failed to create checkout session.";
                showAlert(message, "error");
                return;
            }
            if (!data.url) {
                showAlert(
                    "Checkout session URL not returned by stripe",
                    "error",
                );
                return;
            }
            window.location.assign(data.url);
        } catch {
            showAlert("Something went wrong, please try again", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Stack spacing={2} sx={{ maxWidth: 360 }}></Stack>
        </form>
    );
}
