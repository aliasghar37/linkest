"use client";

import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import visuallyHidden from "@mui/utils/visuallyHidden";
import shortenUrl from "@/app/actions/handleLinkForm";
import {
    ChangeEvent,
    useActionState,
    useEffect,
    useRef,
    useState,
} from "react";
import { useRouter } from "next/navigation";
import { useAlert } from "./AlertContext";
import { useClerk } from "@clerk/nextjs";

export default function LinkForm({
    align,
    initialValue = "",
    alias,
    page,
}: {
    align: "center" | "start";
    initialValue?: string;
    alias?: string;
    page?: "home" | "dashboard";
}) {
    const [state, formAction, isPending] = useActionState(shortenUrl, null);
    const [inputValue, setInputValue] = useState(initialValue || "");
    const [inputAlias, setInputAlias] = useState(alias || "");
    const { showAlert } = useAlert();
    const router = useRouter();
    const clerk = useClerk();
    const formRef = useRef<HTMLFormElement>(null);
    const hasAutoSubmitted = useRef(false);
    const [error, setError] = useState(false);
    const errorTimerRef = useRef<NodeJS.Timeout | null>(null);

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
            setInputAlias("");
            setError(false);
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

    const handleAliasChange = (
        e: ChangeEvent<HTMLTextAreaElement, Element>,
    ) => {
        const aliasValue: string = e.target.value;
        setInputAlias(aliasValue);

        const isInvalid = aliasValue.length < 3 || aliasValue.length > 6;
        setError(isInvalid);

        if (isInvalid) {
            errorTimerRef.current = setTimeout(() => {
                setError(false);
            }, 4000);
        }
    };

    useEffect(() => {
        return () => {
            if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        };
    }, []);

    return (
        <form action={formAction} ref={formRef}>
            <Stack
                direction={{ xs: "column", sm: "column" }}
                spacing={1}
                useFlexGap
                alignItems={{
                    xs:
                        align === "center" && page === "dashboard"
                            ? "start"
                            : "center",
                    sm: align === "center" ? "center" : "start",
                }}
                justifyContent="center"
                sx={{ pt: 2, width: { xs: "100%", sm: "600px" } }}
            >
                <InputLabel htmlFor="long-link" sx={visuallyHidden}>
                    Long Link
                </InputLabel>
                <Stack
                    sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        gap: "4px",
                    }}
                    direction={"row"}
                >
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
                    <TextField
                        id="add-alias"
                        name="alias"
                        hiddenLabel
                        size="small"
                        variant="outlined"
                        aria-label="Add alias here"
                        placeholder="Optional: Add alias here"
                        slotProps={{
                            htmlInput: {
                                autoComplete: "off",
                                "aria-label": "Add alias here",
                            },
                        }}
                        sx={{ alignSelf: "flex-start" }}
                        value={inputAlias}
                        error={error}
                        helperText={
                            error ? "Alias must be 3 to 6 characters" : " "
                        }
                        onChange={handleAliasChange}
                    />
                </Stack>
                <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    sx={{
                        minWidth: "fit-content",
                        maxWidth: "40px",
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
