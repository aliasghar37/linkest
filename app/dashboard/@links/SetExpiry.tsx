import { useState, SubmitEvent, Dispatch, SetStateAction } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import ExpiryDateTimePicker from "./DateAndTimePicker";
import { setLinkExpiry } from "@/app/actions/handleLinkExpiry";
import type { Link } from "./page";
import dayjs, { Dayjs } from "dayjs";
import { useAlert } from "@/components/AlertContext";
import { DialogContent } from "@mui/material";
import { removeLinkExpiry } from "@/app/actions/handleLinkExpiry";

export default function SetExpiry({
    buttonType,
    link,
    setHasExpiry,
}: {
    buttonType: "password" | "setExpiry" | "removeExpiry";
    link: Link;
    setHasExpiry: Dispatch<SetStateAction<boolean>>;
}) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<Dayjs | null>(dayjs());
    const { showAlert } = useAlert();

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSetExpirySubmit = async (
        event: SubmitEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();
        if (!value) return;
        const resp = await setLinkExpiry({
            shortId: link.shortId,
            expiry: value.toISOString(),
        });
        handleClose();
        if (resp?.requiresAuth) {
            showAlert("Please sign in to proceed", "info");
            window.location.reload();
            return;
        }
        if (resp?.error) {
            showAlert("Could not set expiry to the URL", "error");
            return;
        }
        showAlert("Expiry has been added to the URL successfully", "success");
        setHasExpiry(true);
    };

    const handleRemoveExpirySubmit = async (
        e: SubmitEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();
        if (!value) return;
        const resp = await removeLinkExpiry({
            shortId: link.shortId,
            expiresAt: null,
        });
        handleClose();
        if (resp.requiresAuth) {
            showAlert("Please sign in to proceed", "info");
            window.location.reload();
            return;
        }
        if (resp.error) {
            showAlert("Could not remove expiry to the URL", "error");
            return;
        }
        showAlert("Expiry has been removed to the URL successfully", "success");
        setHasExpiry(false);
    };

    return (
        <>
            <Button
                variant="outlined"
                onClick={handleClickOpen}
                size="small"
                sx={{ minWidth: "120px", marginRight: "30px" }}
            >
                {buttonType === "removeExpiry"
                    ? "Remove Auto Expiry"
                    : "Add Auto Expiry"}
            </Button>
            <Dialog open={open} onClose={handleClose}>
                {buttonType === "removeExpiry" ? (
                    <form onSubmit={handleRemoveExpirySubmit}>
                        <DialogContent>
                            This will remove "Auto Expiry"
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit">Okay</Button>
                        </DialogActions>
                    </form>
                ) : (
                    <form onSubmit={handleSetExpirySubmit}>
                        <ExpiryDateTimePicker
                            value={value}
                            onChange={setValue}
                        />
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit">Done</Button>
                        </DialogActions>
                    </form>
                )}
            </Dialog>
        </>
    );
}
