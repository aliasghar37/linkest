import { useState, SubmitEvent } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import type { Link } from "./page";
import { useAlert } from "@/components/AlertContext";
import { DialogContent, IconButton } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import deleteLink from "@/app/actions/deleteLink";
import { useRouter } from "next/navigation";

export default function DeleteButton({ link }: { link: Link }) {
    const [open, setOpen] = useState(false);
    const { showAlert } = useAlert();
    const router = useRouter();

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleDeleteLink = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const resp = await deleteLink({
            shortId: link.shortId,
        });
        handleClose();
        if (resp?.success) {
            showAlert("Your link has been deleted successfully", "success");
            router.refresh();
        }
        if (resp?.error || resp?.requiresAuth)
            showAlert("Couldn't delete the URL", "error");
    };

    return (
        <>
            <IconButton onClick={handleClickOpen} size="small">
                <DeleteForeverIcon color="error" fontSize="small" />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <form onSubmit={handleDeleteLink}>
                    <DialogContent>
                        Do you really want to delete this link?
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">Delete</Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
}
