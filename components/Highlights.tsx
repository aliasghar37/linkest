// "use client";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import ConstructionRoundedIcon from "@mui/icons-material/ConstructionRounded";
import QueryStatsRoundedIcon from "@mui/icons-material/QueryStatsRounded";
import SettingsSuggestRoundedIcon from "@mui/icons-material/SettingsSuggestRounded";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import ThumbUpAltRoundedIcon from "@mui/icons-material/ThumbUpAltRounded";

const items = [
    {
        icon: <QueryStatsRoundedIcon />,
        title: "Real-time Analytics",
        description:
            "Track your impact with precision. Monitor total clicks on daily and monthly basis on a dynamic dashboard.",
    },
    {
        icon: <SettingsSuggestRoundedIcon />,
        title: "Adaptable performance",
        description:
            "Linkest scales with you; Your links stay active and fast, regardless of how many people are clicking at once.",
    },
    {
        icon: <ConstructionRoundedIcon />,
        title: "Built to last",
        description:
            "Experience unmatched durability that goes above and beyond with lasting investment.",
    },
    {
        icon: <ThumbUpAltRoundedIcon />,
        title: "Great user experience",
        description:
            "Enjoy a seamless journey from long, messy links to clean, sharable URLs in a single click. ",
    },
    {
        icon: <AutoFixHighRoundedIcon />,
        title: "Smart AI Summaries & Preview Page",
        description:
            "Instantly understand your links. Our AI automatically scrapes and summarizes the destination web page, giving you a clear preview before you click.",
    },
    {
        icon: <SupportAgentRoundedIcon />,
        title: "Reliable support",
        description:
            "We provide consistent uptime and a stable environment so you can share your content with total confidence.",
    },
];

export default function Highlights() {
    return (
        <Box
            id="highlights"
            sx={{
                pt: { xs: 4, sm: 12 },
                pb: { xs: 8, sm: 16 },
                color: "white",
                bgcolor: "grey.900",
            }}
        >
            <Container
                sx={{
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
                    <Typography component="h2" variant="h4" gutterBottom>
                        Highlights
                    </Typography>
                    <Typography variant="body1" sx={{ color: "grey.400" }}>
                        Explore why our product stands out: adaptability,
                        durability, user-friendly design, and innovation. Enjoy
                        reliable customer support and precision in every detail.
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    {items.map((item, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                            <Stack
                                direction="column"
                                component={Card}
                                spacing={1}
                                useFlexGap
                                sx={{
                                    color: "inherit",
                                    p: 3,
                                    height: "100%",
                                    borderColor: "hsla(220, 25%, 25%, 0.3)",
                                    backgroundColor: "grey.800",
                                }}
                            >
                                <Box sx={{ opacity: "50%" }}>{item.icon}</Box>
                                <div>
                                    <Typography
                                        gutterBottom
                                        sx={{ fontWeight: "medium" }}
                                    >
                                        {item.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "grey.400" }}
                                    >
                                        {item.description}
                                    </Typography>
                                </div>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
