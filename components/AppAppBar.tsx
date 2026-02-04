"use client";
import { useState } from "react";
import { styled, alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LinkestLogo from "./LinkestIcon";
import Link from "next/link";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
    UserButton,
} from "@clerk/nextjs";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexShrink: 0,
    borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
    backdropFilter: "blur(24px)",
    border: "1px solid",
    borderColor: (theme.vars || theme).palette.divider,
    backgroundColor: theme.vars
        ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
        : alpha(theme.palette.background.default, 0.4),
    boxShadow: (theme.vars || theme).shadows[1],
    padding: "8px 12px",
}));

export default function AppAppBar() {
    const [open, setOpen] = useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    return (
        <AppBar
            position="fixed"
            enableColorOnDark
            sx={{
                boxShadow: 0,
                bgcolor: "transparent",
                backgroundImage: "none",
                mt: "calc(var(--template-frame-height, 0px) + 28px)",
            }}
        >
            <Container maxWidth="lg">
                <StyledToolbar variant="dense" disableGutters>
                    <Box
                        sx={{
                            flexGrow: 1,
                            display: "flex",
                            alignItems: "center",
                            px: 0,
                        }}
                    >
                        <LinkestLogo />
                        <Box
                            sx={{
                                display: {
                                    xs: "none",
                                    md: "flex",
                                    gap: "12px",
                                },
                            }}
                        >
                            <Link href="/#features">
                                <Button
                                    variant="text"
                                    color="info"
                                    size="small"
                                >
                                    Features
                                </Button>
                            </Link>
                            <Link href="/#testimonials">
                                <Button
                                    variant="text"
                                    color="info"
                                    size="small"
                                >
                                    Testimonials
                                </Button>
                            </Link>
                            <Link href="/#highlights">
                                <Button
                                    variant="text"
                                    color="info"
                                    size="small"
                                >
                                    Highlights
                                </Button>
                            </Link>
                            <Link href="/#pricing">
                                <Button
                                    variant="text"
                                    color="info"
                                    size="small"
                                >
                                    Pricing
                                </Button>
                            </Link>
                            <Link href="/#faq">
                                <Button
                                    variant="text"
                                    color="info"
                                    size="small"
                                    sx={{ minWidth: 0 }}
                                >
                                    FAQ
                                </Button>
                            </Link>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: { xs: "none", md: "flex" },
                            gap: 1,
                            alignItems: "center",
                        }}
                    >
                        <SignedOut>
                            <SignInButton mode="modal">
                                <span style={{ cursor: "pointer" }}>
                                    <Button
                                        color="primary"
                                        variant="text"
                                        size="small"
                                        component="span"
                                    >
                                        Sign in
                                    </Button>
                                </span>
                            </SignInButton>
                            <SignUpButton mode="modal">
                                <span style={{ cursor: "pointer" }}>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        size="small"
                                        component="span"
                                    >
                                        Sign up
                                    </Button>
                                </span>
                            </SignUpButton>
                        </SignedOut>

                        <SignedIn>
                            <Button
                                color="primary"
                                variant="text"
                                size="small"
                                component="span"
                            >
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                            <UserButton />
                        </SignedIn>
                    </Box>
                    <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
                        <SignedIn>
                            <Button
                                color="primary"
                                variant="text"
                                size="small"
                                component="span"
                            >
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                            <UserButton />
                        </SignedIn>

                        <IconButton
                            aria-label="Menu button"
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="top"
                            open={open}
                            onClose={toggleDrawer(false)}
                        >
                            <Box
                                sx={{
                                    p: 2,
                                    backgroundColor: "background.default",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <IconButton onClick={toggleDrawer(false)}>
                                        <CloseRoundedIcon />
                                    </IconButton>
                                </Box>

                                <MenuItem>
                                    <Link href="/#features">
                                        <Button
                                            variant="text"
                                            color="info"
                                            size="small"
                                        >
                                            Features
                                        </Button>
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link href="/#testimonials">
                                        <Button
                                            variant="text"
                                            color="info"
                                            size="small"
                                        >
                                            Testimonials
                                        </Button>
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link href="/#highlights">
                                        <Button
                                            variant="text"
                                            color="info"
                                            size="small"
                                        >
                                            Highlights
                                        </Button>
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link href="/#pricing">
                                        <Button
                                            variant="text"
                                            color="info"
                                            size="small"
                                        >
                                            Pricing
                                        </Button>
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link href="/#faq">
                                        <Button
                                            variant="text"
                                            color="info"
                                            size="small"
                                            sx={{ minWidth: 0 }}
                                        >
                                            FAQ
                                        </Button>
                                    </Link>
                                </MenuItem>
                                <SignedOut>
                                    <Divider sx={{ my: 3 }} />
                                    <MenuItem
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1,
                                            width: "100%",
                                        }}
                                    >
                                        <SignInButton mode="modal">
                                            <span className="cursor-pointer w-full  ">
                                                <Button
                                                    color="primary"
                                                    variant="outlined"
                                                    size="medium"
                                                    fullWidth
                                                >
                                                    Sign in
                                                </Button>
                                            </span>
                                        </SignInButton>
                                        <SignUpButton mode="modal">
                                            <span className="cursor-pointer w-full ">
                                                <Button
                                                    color="primary"
                                                    variant="contained"
                                                    size="medium"
                                                    fullWidth
                                                >
                                                    Sign up
                                                </Button>
                                            </span>
                                        </SignUpButton>
                                    </MenuItem>
                                </SignedOut>
                            </Box>
                        </Drawer>
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
}
