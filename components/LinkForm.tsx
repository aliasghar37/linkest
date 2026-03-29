"use client";

import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import visuallyHidden from "@mui/utils/visuallyHidden";
import shortenUrl from "@/app/actions/handleLinkForm";
import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAlert } from "./AlertContext";
import { useClerk } from "@clerk/nextjs";

export default function LinkForm({
    align,
    initialValue = "",
}: {
    align: "center" | "start";
    initialValue?: string;
}) {
    const [state, formAction, isPending] = useActionState(shortenUrl, null);
    const [inputValue, setInputValue] = useState(initialValue || "");
    const { showAlert } = useAlert();
    const router = useRouter();
    const clerk = useClerk();
    const formRef = useRef<HTMLFormElement>(null);
    const hasAutoSubmitted = useRef(false);

    useEffect(() => {
        if (!state) return;

        if (state?.requiresAuth) {
            showAlert("Please signin to proceed!", "info");
            clerk.openSignIn({
                forceRedirectUrl: `/dashboard?pendingUrl=${encodeURIComponent(state.longUrl as string)}`,
            });
        } else if (state?.error) {
            showAlert(state?.error, "error");
        } else if (state.success && state.shortId) {
            setInputValue("");
            showAlert("Your link has been shortened successfully", "success");
            router.push(`/dashboard`);
        }
    }, [state, showAlert, router, clerk]);

    useEffect(() => {
        if (initialValue) setInputValue(initialValue);
    }, [initialValue]);

    useEffect(() => {
        if (
            initialValue &&
            formRef.current &&
            !isPending &&
            !hasAutoSubmitted.current
        ) {
            hasAutoSubmitted.current = true;
            const timer = setTimeout(() => {
                formRef.current?.requestSubmit();
            }, 200);

            return () => clearTimeout(timer);
        }
    }, [initialValue, isPending]);

    return (
        <form action={formAction} ref={formRef}>
            <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                useFlexGap
                alignItems="center"
                justifyContent={align}
                sx={{ pt: 2, width: { xs: "100%", sm: "600px" } }}
            >
                <InputLabel htmlFor="long-link" sx={visuallyHidden}>
                    Long Link
                </InputLabel>
                <TextField
                    id="long-link"
                    name="longUrl"
                    hiddenLabel
                    size="small"
                    variant="outlined"
                    aria-label="Enter Long Link"
                    placeholder="Enter long link to shorten"
                    slotProps={{
                        htmlInput: {
                            autoComplete: "off",
                            "aria-label": "Enter long link to shorten",
                        },
                    }}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />

                <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    sx={{
                        minWidth: "fit-content",
                    }}
                    type="submit"
                    disabled={isPending}
                >
                    {isPending ? "Shortening..." : "Shorten link"}
                </Button>
            </Stack>
        </form>
    );
}
