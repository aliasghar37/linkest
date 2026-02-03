// "use client";
import * as React from "react";
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
import ColorModeIconDropdown from "./shared-theme/ColorModeIconDropdown";
import LinkestLogo from "./LinkestIcon";
import Link from "next/link";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignOutButton,
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
    const [open, setOpen] = React.useState(false);

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
                            {/* <Link href="/user-profile">
                                <ColorModeIconDropdown />
                            </Link> */}
                            {/* <SignOutButton>
                                <span style={{ cursor: "pointer" }}>
                                    <Button
                                        color="primary"
                                        variant="text"
                                        size="small"
                                        component="span"
                                    >
                                        Sign out
                                    </Button>
                                </span>
                            </SignOutButton> */}
                            <Button
                                color="primary"
                                variant="text"
                                size="small"
                                component="span"
                            >
                                Dashboard
                            </Button>
                            <UserButton />
                        </SignedIn>
                    </Box>
                    <Box sx={{ display: { xs: "flex", md: "none" }, gap: 1 }}>
                        <ColorModeIconDropdown size="medium" />
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
                            // PaperProps={{
                            //     sx: {
                            //         top: "var(--template-frame-height, 0px)",
                            //     },
                            // }}
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

                                <MenuItem>Features</MenuItem>
                                <MenuItem>Testimonials</MenuItem>
                                <MenuItem>Highlights</MenuItem>
                                <MenuItem>Pricing</MenuItem>
                                <MenuItem href="#faq">FAQ</MenuItem>
                                <Divider sx={{ my: 3 }} />
                                <MenuItem>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        fullWidth
                                    >
                                        Sign up
                                    </Button>
                                </MenuItem>
                                <MenuItem>
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        fullWidth
                                    >
                                        Sign in
                                    </Button>
                                </MenuItem>
                            </Box>
                        </Drawer>
                    </Box>
                </StyledToolbar>
            </Container>
        </AppBar>
    );
}
