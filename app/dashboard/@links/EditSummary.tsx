import { useState, SubmitEvent } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import type { Link } from "./page";
import { useAlert } from "@/components/AlertContext";
import { DialogContent, IconButton, TextField } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/navigation";
import editSummary from "@/app/actions/editSummary";

export default function EditSummaryButton({ link }: { link: Link }) {
    const [open, setOpen] = useState(false);
    const { showAlert } = useAlert();
    const router = useRouter();

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleClose();
        const formData = new FormData(e.currentTarget);
        const summary = (formData.get("summary") as string).trim();
        const resp = await editSummary(summary, link.shortId);

        if (resp?.success) {
            showAlert("Link summary has been updated successfully", "success");
            handleClose();
            router.refresh();
            return;
        }
        showAlert(resp?.error ?? "Couldn't update the link summary", "error");
    };

    return (
        <>
            <IconButton
                onClick={handleClickOpen}
                size="small"
                sx={{ marginLeft: "8px" }}
            >
                <EditIcon color="inherit" fontSize="medium" />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogContent
                    sx={{
                        width: { sm: "500px", md: "500px", xs: "280px" },
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="edit-summary"
                            name="summary"
                            label="Edit Summary (max 1000 characters) "
                            placeholder="Enter new summary here"
                            maxRows={6}
                            type="text"
                            fullWidth
                            multiline
                            variant="standard"
                        />
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit">Done</Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
