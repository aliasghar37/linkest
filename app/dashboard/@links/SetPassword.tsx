import { useState, SubmitEvent, ChangeEvent, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import type { Link } from "./page";
import { useAlert } from "@/components/AlertContext";
import { DialogContent, DialogTitle, TextField } from "@mui/material";
import addPassword from "@/app/actions/addPassword";

export default function SetPassword({
    buttonType,
    link,
}: {
    buttonType: "addPassword" | "removePassword";
    link: Link;
}) {
    const [open, setOpen] = useState(false);
    const [password, SetPassword] = useState("");
    const [error, setError] = useState<boolean>(false);
    const { showAlert } = useAlert();
    const errorTimerRef = useRef<NodeJS.Timeout | null>(null);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAddPasswordSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const resp = await addPassword(link.shortId, password);
        if (resp.error || resp.requiresAuth) {
            showAlert("Couldn't add password to the URL", "error");
            return;
        }
        setOpen(false);
        showAlert("Password has been added to the URL", "success");
    };

    const handleRemovePasswordSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const pass: string = e.target.value;
        SetPassword(pass);

        const isInvalid = pass.length < 6 || pass.length > 12;
        setError(isInvalid);
        if (errorTimerRef.current) {
            clearTimeout(errorTimerRef.current);
            errorTimerRef.current = null;
        }
        if (isInvalid) {
            errorTimerRef.current = setTimeout(() => {
                setError(false);
                errorTimerRef.current = null;
            }, 4000);
        }
    };
    useEffect(() => {
        return () => {
            if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
        };
    }, []);

    return (
        <>
            <Button
                variant="outlined"
                onClick={handleClickOpen}
                size="small"
                sx={{ minWidth: "120px", marginRight: "30px" }}
            >
                {buttonType === "removePassword"
                    ? "Remove Password"
                    : "Add Password"}
            </Button>
            <Dialog open={open} onClose={handleClose}>
                {buttonType === "removePassword" ? (
                    <form onSubmit={handleRemovePasswordSubmit}>
                        <DialogContent>
                            This will remove "password" from link
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose}>Cancel</Button>
                            <Button type="submit">Okay</Button>
                        </DialogActions>
                    </form>
                ) : (
                    <form onSubmit={handleAddPasswordSubmit}>
                        <DialogTitle>Add Password</DialogTitle>
                        <DialogContent
                            sx={{ minWidth: { sm: "300px", xs: "250px" } }}
                        >
                            <TextField
                                id="password"
                                type="password"
                                fullWidth
                                placeholder="Enter Password (6 - 12 Characters)"
                                autoComplete="current-password"
                                variant="standard"
                                error={error}
                                helperText={
                                    error
                                        ? "Password must be 6 to 12 characters"
                                        : " "
                                }
                                onChange={handlePasswordChange}
                            />
                        </DialogContent>
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
