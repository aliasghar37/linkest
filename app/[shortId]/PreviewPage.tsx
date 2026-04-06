"use client";

import {
    Box,
    Button,
    Container,
    Link,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { ChangeEvent, useEffect, useRef, useState, SubmitEvent } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { checkPassword } from "../actions/handlePassword";
import { Link as LinkType } from "../dashboard/@links/page";
import { useAlert } from "@/components/AlertContext";
import LinkestLogo from "@/components/LinkestIcon";
import { type CacheLinkType } from "../actions/handleLinkForm";

export default function previewPage({
    link,
}: {
    link: LinkType | CacheLinkType;
}) {
    const [password, SetPassword] = useState("");
    const [error, setError] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);
    const [unlocked, setUnlocked] = useState(link.password ? false : true);
    const errorTimerRef = useRef<NodeJS.Timeout | null>(null);
    const { showAlert } = useAlert();

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

    const handlePassFormSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const password = String(form.get("password"));
        const resp = await checkPassword(link.shortId, password);
        if (resp?.success) {
            setUnlocked(true);
            showAlert("Link has been unlocked", "success");
            return;
        }
        if (resp?.error)
            showAlert("Password is incorrect, try again later", "error");
    };

    return (
        <>
            <Container maxWidth={unlocked ? "sm" : "xs"} sx={{ mt: 10 }}>
                <Paper
                    elevation={3}
                    sx={{ p: 4, textAlign: "center", borderRadius: 3 }}
                >
                    <Stack>
                        <Box alignSelf={"center"} marginRight={-5}>
                            <LinkestLogo />
                        </Box>
                        <Typography
                            variant="h6"
                            color="textSecondary"
                            alignSelf={"center"}
                        >
                            Preview Page
                        </Typography>
                    </Stack>

                    {unlocked ? (
                        <>
                            <Typography
                                variant="h4"
                                gutterBottom
                                sx={{ fontWeight: "bold" }}
                            >
                                {link.title || "Untitled Link"}
                            </Typography>
                            <Typography
                                variant="body1"
                                color="textSecondary"
                                sx={{ mb: 4 }}
                            >
                                {link.summary ||
                                    "No summary provided for this link."}
                            </Typography>

                            <Box
                                sx={{
                                    bgcolor: "none",
                                    p: 2,
                                    borderRadius: 2,
                                    mb: 4,
                                    overflow: "hidden",
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    display="block"
                                    gutterBottom
                                >
                                    Destination URL:
                                </Typography>
                                <Link
                                    href={link.longUrl}
                                    underline="hover"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {link.longUrl}
                                </Link>
                            </Box>

                            <Button
                                variant="contained"
                                size="large"
                                href={link.longUrl}
                                fullWidth
                                sx={{ py: 1.5 }}
                            >
                                Proceed to Link
                            </Button>
                        </>
                    ) : (
                        <form onSubmit={handlePassFormSubmit}>
                            <Typography marginTop={2} variant="h6">
                                Please enter password to unlock the Destination
                                URL
                            </Typography>
                            <Stack
                                direction={"row"}
                                gap={1}
                                justifySelf={"center"}
                                marginTop={4}
                            >
                                <TextField
                                    id="password"
                                    name="password"
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
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                            >
                                Submit
                            </Button>
                        </form>
                    )}
                    <Button href="/" variant="text" fullWidth sx={{ mt: 2 }}>
                        Back to Linkest
                    </Button>
                </Paper>
            </Container>
        </>
    );
}
