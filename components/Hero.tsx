import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LinkForm from "./LinkForm";

export default function Hero() {
    return (
        <Box id="hero">
            <div className="absolute min-h-screen w-full bg-no-repeat dark:bg-[radial-gradient(ellipse_80%_100%_at_50%_-50%,hsl(210,100%,26%),transparent)]  "></div>
            <Container
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    pt: { xs: 14, sm: 20 },
                    pb: { xs: 8, sm: 12 },
                }}
            >
                <Stack
                    spacing={2}
                    useFlexGap
                    sx={{
                        alignItems: "center",
                        width: { xs: "100%", sm: "70%" },
                    }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            alignItems: "center",
                            textAlign: "center",
                            fontSize: "clamp(3rem, 10vw, 3.5rem)",
                        }}
                    >
                        Shorten Your Loooong Links! :)
                    </Typography>
                    <Typography
                        sx={{
                            textAlign: "center",
                            color: "text.secondary",
                            width: { sm: "100%", md: "80%" },
                        }}
                    >
                        Linkest is an efficient and easy-to-use URL shortening
                        service that streamlines your online experience. It also
                        helps you track your links.
                    </Typography>
                    <LinkForm align="center" />
                </Stack>
            </Container>
        </Box>
    );
}
