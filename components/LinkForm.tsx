"use client";

import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import visuallyHidden from "@mui/utils/visuallyHidden";
import shortenUrl from "@/app/actions/handleLinkForm";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignIn } from "@clerk/nextjs";
import { useAlert } from "./AlertContext";

export default function LinkForm({ align }: { align: "center" | "start" }) {
    const [state, formAction, isPending] = useActionState(shortenUrl, null);
    const { showAlert } = useAlert();
    const router = useRouter();

    useEffect(() => {
        if (!state) return;

        if (state?.requiresAuth) {
            showAlert("Please signin to proceed!", "info");
        } else if (state?.error) {
            showAlert(state?.error, "error");
        } else if (state.success && state.shortId) {
            showAlert("Your link has been shortened successfully", "success");
            router.push(`/dashboard?new=${state.shortId}`);
        }
    }, [state, showAlert, router]);

    if (state?.requiresAuth) {
        return <SignIn routing="hash" />;
    }

    if (state?.error) {
        return null;
    }

    return (
        <form action={formAction}>
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
