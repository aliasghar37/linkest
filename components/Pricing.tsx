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
import { useEffect, useState } from "react";
import type { Theme } from "@mui/material/styles";
import { useAlert } from "./AlertContext";
import { SignUpButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";

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

type PlanStatus = "free" | "pro";

export default function Pricing({ embedded = false }: { embedded?: boolean }) {
    const [loading, setLoading] = useState(false);
    const [planStatus, setPlanStatus] = useState<PlanStatus>("free");
    const [planStatusLoading, setPlanStatusLoading] = useState(true);
    const { isLoaded, isSignedIn } = useAuth();
    const { showAlert } = useAlert();

    useEffect(() => {
        if (!isLoaded) return;

        if (!isSignedIn) {
            setPlanStatusLoading(false);
            return;
        }

        let mounted = true;

        const loadPlanStatus = async () => {
            setPlanStatusLoading(true);
            try {
                const response = await fetch("/api/user-role", {
                    method: "GET",
                    cache: "no-store",
                });
                const data = (await response.json()) as {
                    status?: "signed-out" | "free" | "pro";
                };
                if (!mounted) return;

                if (
                    response.ok &&
                    (data.status === "free" || data.status === "pro")
                ) {
                    setPlanStatus(data.status);
                    return;
                }

                // Signed-in users should never be forced into signed-out CTA.
                setPlanStatus("free");
            } catch {
                if (!mounted) return;
                setPlanStatus("free");
            } finally {
                if (!mounted) return;
                setPlanStatusLoading(false);
            }
        };
        loadPlanStatus();

        return () => {
            mounted = false;
        };
    }, [isLoaded, isSignedIn]);

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

    const renderProAction = () => {
        if (!isLoaded || (isSignedIn && planStatusLoading)) {
            return (
                <Button fullWidth variant="contained" color="primary" disabled>
                    Loading...
                </Button>
            );
        }

        if (!isSignedIn) {
            return (
                <SignUpButton mode="modal">
                    <span
                        style={{
                            cursor: "pointer",
                            width: "100%",
                            display: "block",
                        }}
                    >
                        <Button fullWidth variant="contained" color="primary">
                            Sign up to start
                        </Button>
                    </span>
                </SignUpButton>
            );
        }

        if (planStatus === "pro") {
            return (
                <Button fullWidth variant="contained" color="primary" disabled>
                    You are using pro plan
                </Button>
            );
        }

        return (
            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleCheckout}
                disabled={loading}
            >
                {loading ? "Loading..." : "Start now"}
            </Button>
        );
    };

    const renderFreeAction = () => {
        if (!isLoaded || (isSignedIn && planStatusLoading)) {
            return (
                <Button fullWidth variant="outlined" color="primary" disabled>
                    Loading...
                </Button>
            );
        }

        if (!isSignedIn) {
            return (
                <SignUpButton mode="modal">
                    <span
                        style={{
                            cursor: "pointer",
                            width: "100%",
                            display: "block",
                        }}
                    >
                        <Button fullWidth variant="outlined" color="primary">
                            Sign up to start
                        </Button>
                    </span>
                </SignUpButton>
            );
        }

        if (planStatus === "pro") return null;
        if (planStatus === "free") {
            return (
                <Button fullWidth variant="outlined" color="primary" disabled>
                    You are using the Free Plan
                </Button>
            );
        }
        return null;
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
            <CardActions>{renderProAction()}</CardActions>
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
                                <CardActions>{renderFreeAction()}</CardActions>
                            </Card>
                        )}
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}
