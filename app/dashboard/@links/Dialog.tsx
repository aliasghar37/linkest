import { useState, SubmitEvent } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import ExpiryDateTimePicker from "./DateAndTimePicker";
import { setLinkExpiry } from "@/app/actions/setLinkExpiry";
import type { Link } from "./page";
import dayjs, { Dayjs } from "dayjs";
import { useAlert } from "@/components/AlertContext";

export default function FormDialog({
    buttonType,
    link,
}: {
    buttonType: "password" | "expiry";
    link: Link;
}) {
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState<Dayjs | null>(dayjs());
    const { showAlert } = useAlert();

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!value) return;
        const resp = await setLinkExpiry({
            shortId: link.shortId,
            expiresAt: value.toISOString(),
        });

        if (resp.error) showAlert("Could not set expiry to the URL", "error");
        if (resp.success) {
            showAlert(
                "Expiry has been added to the URL successfully",
                "success",
            );
        }
        handleClose();
    };
    return (
        <>
            <Button
                variant="outlined"
                onClick={handleClickOpen}
                size="small"
                sx={{ minWidth: "100px", marginRight: "30px" }}
            >
                {buttonType === "password" ? "Add Password" : "Add Auto Expiry"}
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={handleSubmit}>
                    <ExpiryDateTimePicker value={value} onChange={setValue} />
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Done</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}
