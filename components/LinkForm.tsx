"use client";

import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import visuallyHidden from "@mui/utils/visuallyHidden";
import shortenUrl from "@/app/actions/handleLinkForm";
import { useActionState } from "react";

export default function LinkForm({ align }: { align: "center" | "start" }) {
    const [state, formAction, isPending] = useActionState(shortenUrl, null);

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
                >
                    Shorten link
                </Button>
            </Stack>
        </form>
    );
}
