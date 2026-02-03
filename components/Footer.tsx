// "use client";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/X";
import SitemarkIcon from "./LinkestIcon";
import LanguageIcon from "@mui/icons-material/Language";

function Copyright() {
    return (
        <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
            {"Copyright © "}
            <Link color="text.secondary" href="https:aliasghar.dev">
                Ali Asghar
            </Link>
            &nbsp;
            {new Date().getFullYear()}
        </Typography>
    );
}

export default function Footer() {
    return (
        <Container
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: { xs: 4, sm: 8 },
                py: { xs: 8, sm: 10 },
                textAlign: { sm: "center", md: "left" },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    width: "100%",
                    justifyContent: "space-between",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        minWidth: { xs: "100%", sm: "60%" },
                    }}
                >
                    <Box sx={{ width: { xs: "100%", sm: "60%" } }}>
                        <SitemarkIcon />
                        <Typography
                            variant="body2"
                            gutterBottom
                            sx={{ fontWeight: 600, mt: 2 }}
                        >
                            Shorten Your loooong Links :)
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: "text.secondary", mb: 2 }}
                        >
                            Start with our professional plan to shorten more
                            links.
                        </Typography>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: { xs: "none", sm: "flex" },
                        flexDirection: "column",
                        gap: 1,
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                        Product
                    </Typography>
                    <Link color="text.secondary" variant="body2" href="#">
                        Features
                    </Link>
                    <Link color="text.secondary" variant="body2" href="#">
                        Testimonials
                    </Link>
                    <Link color="text.secondary" variant="body2" href="#">
                        Highlights
                    </Link>
                    <Link color="text.secondary" variant="body2" href="#">
                        Pricing
                    </Link>
                    <Link color="text.secondary" variant="body2" href="#">
                        FAQs
                    </Link>
                </Box>
                <Box
                    sx={{
                        display: { xs: "none", sm: "flex" },
                        flexDirection: "column",
                        gap: 1,
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                        Company
                    </Typography>
                    <Link color="text.secondary" variant="body2" href="#">
                        About us
                    </Link>
                    <Link color="text.secondary" variant="body2" href="#">
                        Careers
                    </Link>
                    <Link color="text.secondary" variant="body2" href="#">
                        Press
                    </Link>
                </Box>
                <Box
                    sx={{
                        display: { xs: "none", sm: "flex" },
                        flexDirection: "column",
                        gap: 1,
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                        Legal
                    </Typography>
                    <Link color="text.secondary" variant="body2" href="#">
                        Terms
                    </Link>
                    <Link color="text.secondary" variant="body2" href="#">
                        Privacy
                    </Link>
                    <Link color="text.secondary" variant="body2" href="#">
                        Contact
                    </Link>
                </Box>
            </Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    pt: { xs: 4, sm: 8 },
                    width: "100%",
                    borderTop: "1px solid",
                    borderColor: "divider",
                }}
            >
                <div>
                    <Copyright />
                </div>
                <Stack
                    direction="row"
                    spacing={1}
                    useFlexGap
                    sx={{ justifyContent: "left", color: "text.secondary" }}
                >
                    <IconButton
                        color="inherit"
                        size="small"
                        href="https://www.linkedin.com/in/aliasghar37/"
                        aria-label="LinkedIn"
                        sx={{ alignSelf: "center" }}
                    >
                        <LinkedInIcon />
                    </IconButton>
                    <IconButton
                        color="inherit"
                        size="small"
                        href="https://github.com/aliasghar37"
                        aria-label="GitHub"
                        sx={{ alignSelf: "center" }}
                    >
                        <GitHubIcon />
                    </IconButton>
                    <IconButton
                        color="inherit"
                        size="small"
                        href="https://aliasghar.dev"
                        aria-label="Portfolio"
                        sx={{ alignSelf: "center" }}
                    >
                        <LanguageIcon />
                    </IconButton>
                </Stack>
            </Box>
        </Container>
    );
}
