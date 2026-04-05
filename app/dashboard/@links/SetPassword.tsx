import {
    useState,
    SubmitEvent,
    ChangeEvent,
    useEffect,
    useRef,
    Dispatch,
    SetStateAction,
} from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { useAlert } from "@/components/AlertContext";
import { DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { addPassword, removePassword } from "@/app/actions/handlePassword";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function SetPassword({
    buttonType,
    shortId,
    setHasPassword,
}: {
    buttonType: "addPassword" | "removePassword";
    shortId: string;
    setHasPassword: Dispatch<SetStateAction<boolean>>;
}) {
    const [open, setOpen] = useState(false);
    const [password, SetPassword] = useState("");
    const [error, setError] = useState<boolean>(false);
    const { showAlert } = useAlert();
    const errorTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAddPasswordSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const resp = await addPassword(shortId, password);
        if (resp.requiresAuth) {
            showAlert("Please sign in to proceed", "info");
            window.location.reload();
            return;
        }
        if (resp.error) {
            showAlert("Couldn't add password to the URL", "error");
            return;
        }
        handleClose();
        setHasPassword(true);
        showAlert("Password has been added to the URL", "success");
    };

    const handleRemovePasswordSubmit = async (
        e: SubmitEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();
        const resp = await removePassword(shortId);
        handleClose();
        if (resp?.requiresAuth) {
            showAlert("Please sign in to proceed", "error");
            window.location.reload();
            return;
        }
        if (resp?.error) {
            showAlert("Could not remove expiry to the URL", "error");
            return;
        }
        showAlert("Expiry has been removed to the URL successfully", "success");
        setHasPassword(false);
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

    const handleShowPasswordChange = () => {
        setShowPassword((prev) => !prev);
    };
    useEffect(() => {
        if (!showPassword) return;
        const timer = setTimeout(() => {
            setShowPassword(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [showPassword]);

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
                            <Stack direction={"row"} gap={1}>
                                <TextField
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter Password (6 - 12 Characters)"
                                    autoComplete="current-password"
                                    variant="standard"
                                    value={password}
                                    error={error}
                                    helperText={
                                        error
                                            ? "Password must be 6 to 12 characters"
                                            : " "
                                    }
                                    onChange={handlePasswordChange}
                                    sx={{
                                        minWidth: { sm: "300px", xs: "200px" },
                                    }}
                                />
                                {showPassword ? (
                                    <VisibilityIcon
                                        onClick={handleShowPasswordChange}
                                    />
                                ) : (
                                    <VisibilityOffIcon
                                        onClick={handleShowPasswordChange}
                                    />
                                )}
                            </Stack>
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
