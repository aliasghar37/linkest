"use client";

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Pricing from "@/components/Pricing";
import { useAlert } from "@/components/AlertContext";

export default function UpgradeModal() {
    const [open, setOpen] = useState(false);
    const { showAlert } = useAlert();

    useEffect(() => {
        showAlert(
            "Free plan limit reached (10 links). Upgrade to Pro to continue.",
            "info",
        );
    }, [showAlert]);

    return (
        <div>
            <p className="text-sm text-center md:text-start text-red-400 pb-4">
                You reached the Free plan limit (10 links). Upgrade to Pro to
                continue creating links.
            </p>
            <Button
                variant="contained"
                color="primary"
                onClick={() => setOpen(true)}
            >
                Upgrade to Pro
            </Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                slotProps={{
                    paper: {
                        sx: {
                            p: 0,
                            backgroundColor: "transparent",
                            boxShadow: "none",
                            overflow: "visible",
                        },
                    },
                }}
            >
                <Pricing embedded />
            </Dialog>
        </div>
    );
}
