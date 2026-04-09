"use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { useState } from "react";
import type { Theme } from "@mui/material/styles";
import { useAlert } from "./AlertContext";
import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";

const tiers = [
    {
        title: "Free",
        price: "0",
        description: [
            "10 links",
            "Analytics",
            "AI generated summaries",
            "Password Protection",
            "Set custom auto expiry",
        ],
        buttonText: "Sign up for free",
        buttonVariant: "outlined",
        buttonColor: "primary",
    },
    {
        title: "Professional",
        subheader: "Recommended",
        price: "10",
        description: [
            "100 links",
            "Analytics",
            "AI generated summaries",
            "Password Protection",
            "Set custom auto expiry",
            "Help center access",
            "Best deals",
        ],
        buttonText: "Start now",
        buttonVariant: "contained",
        buttonColor: "primary",
        paymentFormURL: "/payment",
    },
];

const proTier = tiers[1];

export default function Pricing({ embedded = false }: { embedded?: boolean }) {
    const [loading, setLoading] = useState(false);
    const { showAlert } = useAlert();

    const handleCheckout = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/checkout_sessions", {
                method: "POST",
            });
            const session = (await response.json()) as {
                url?: string;
                error?: string;
            };

            if (!response.ok || !session.url) {
                showAlert(
                    session.error ?? "Failed to create checkout session",
                    "error",
                );
                return;
            }
            window.location.assign(session.url);
        } catch (err) {
            console.error("Stripe error:", err);
            showAlert("Stripe error, please try again", "error");
        } finally {
            setLoading(false);
        }
    };

    const pricingCard = (
        <Card
            sx={[
                {
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    minWidth: { xs: "300px", sm: "350px" },
                },
                ((theme: Theme) => ({
                    border: "none",
                    background:
                        "radial-gradient(circle at 50% 0%, hsl(220, 20%, 35%), hsl(220, 30%, 6%))",
                    boxShadow: `0 8px 12px hsla(220, 20%, 42%, 0.2)`,
                    ...theme.applyStyles("dark", {
                        background:
                            "radial-gradient(circle at 50% 0%, hsl(220, 20%, 20%), hsl(220, 30%, 16%))",
                        boxShadow: `0 8px 12px hsla(0, 0%, 0%, 0.8)`,
                    }),
                })) as any,
            ]}
        >
            <CardContent>
                <Box
                    sx={{
                        mb: 1,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        color: "grey.100",
                    }}
                >
                    <Typography component="h3" variant="h6">
                        {proTier.title}
                    </Typography>
                    <Chip
                        icon={<AutoAwesomeIcon />}
                        label={proTier.subheader}
                    />
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "baseline",
                        color: "grey.50",
                    }}
                >
                    <Typography component="h3" variant="h2">
                        ${proTier.price}
                    </Typography>
                    <Typography component="h3" variant="h6">
                        &nbsp; per month
                    </Typography>
                </Box>
                <Divider
                    sx={{
                        my: 2,
                        opacity: 0.8,
                        borderColor: "divider",
                    }}
                />
                {proTier.description.map((line) => (
                    <Box
                        key={line}
                        sx={{
                            py: 1,
                            display: "flex",
                            gap: 1.5,
                            alignItems: "center",
                        }}
                    >
                        <CheckCircleRoundedIcon
                            sx={{
                                width: 20,
                                color: "primary.light",
                            }}
                        />
                        <Typography
                            variant="subtitle2"
                            component={"span"}
                            sx={{ color: "grey.50" }}
                        >
                            {line}
                        </Typography>
                    </Box>
                ))}
            </CardContent>
            <CardActions>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={handleCheckout}
                >
                    {loading ? "Loading..." : "Start now"}
                </Button>
            </CardActions>
        </Card>
    );

    if (embedded) {
        return pricingCard;
    }

    return (
        <Container
            id={embedded ? undefined : "pricing"}
            sx={{
                pt: embedded ? { xs: 1, sm: 2 } : { xs: 4, sm: 12 },
                pb: embedded ? { xs: 1, sm: 2 } : { xs: 8, sm: 16 },
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: { xs: 3, sm: 6 },
            }}
        >
            <Box
                sx={{
                    width: { sm: "100%", md: "60%" },
                    textAlign: { sm: "left", md: "center" },
                }}
            >
                <Typography
                    component="h2"
                    variant="h4"
                    gutterBottom
                    sx={{ color: "text.primary" }}
                >
                    Pricing
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    Purchase your PRO Subscription for Linkest to get more
                    features. <br />
                    We provide high availability, security, and reliability.
                </Typography>
            </Box>
            <Grid
                container
                spacing={3}
                sx={{
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                }}
            >
                {tiers.map((tier) => (
                    <Grid
                        size={{
                            xs: 12,
                            sm: tier.title === "Enterprise" ? 12 : 6,
                            md: 4,
                        }}
                        minWidth={{ sm: "350px", xs: "300px" }}
                        key={tier.title}
                    >
                        {tier.title === "Professional" ? (
                            pricingCard
                        ) : (
                            <Card
                                sx={[
                                    {
                                        p: 2,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 4,
                                    },
                                ]}
                            >
                                <CardContent>
                                    <Box
                                        sx={{
                                            mb: 1,
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: 2,
                                        }}
                                    >
                                        <Typography component="h3" variant="h6">
                                            {tier.title}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "baseline",
                                        }}
                                    >
                                        <Typography component="h3" variant="h2">
                                            ${tier.price}
                                        </Typography>
                                        <Typography component="h3" variant="h6">
                                            &nbsp; per month
                                        </Typography>
                                    </Box>
                                    <Divider
                                        sx={{
                                            my: 2,
                                            opacity: 0.8,
                                            borderColor: "divider",
                                        }}
                                    />
                                    {tier.description.map((line) => (
                                        <Box
                                            key={line}
                                            sx={{
                                                py: 1,
                                                display: "flex",
                                                gap: 1.5,
                                                alignItems: "center",
                                            }}
                                        >
                                            <CheckCircleRoundedIcon
                                                sx={{
                                                    width: 20,
                                                    color: "primary.main",
                                                }}
                                            />
                                            <Typography
                                                variant="subtitle2"
                                                component={"span"}
                                            >
                                                {line}
                                            </Typography>
                                        </Box>
                                    ))}
                                </CardContent>
                                <CardActions>
                                    <SignedOut>
                                        <SignUpButton mode="modal">
                                            <span
                                                style={{
                                                    cursor: "pointer",
                                                    width: "100%",
                                                    display: "block",
                                                }}
                                            >
                                                <Button
                                                    fullWidth
                                                    variant={"outlined"}
                                                    color={"primary"}
                                                >
                                                    Sign up for free
                                                </Button>
                                            </span>
                                        </SignUpButton>
                                    </SignedOut>
                                    <SignedIn>
                                        <Button
                                            fullWidth
                                            variant={"outlined"}
                                            color={"primary"}
                                            disabled={true}
                                        >
                                            You are using the Free Plan
                                        </Button>
                                    </SignedIn>
                                </CardActions>
                            </Card>
                        )}
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
