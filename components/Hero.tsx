// "use client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import visuallyHidden from "@mui/utils/visuallyHidden";

export default function Hero() {
    return (
        <Box
            id="hero"
            sx={(theme) => ({
                width: "100%",
                backgroundRepeat: "no-repeat",

                ...theme.applyStyles("dark", {
                    backgroundImage:
                        "radial-gradient(ellipse 80% 100% at 50% -20%, hsl(210, 100%, 16%), transparent)",
                }),
            })}
        >
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
                        {/* <Typography
                            component="span"
                            variant="h1"
                            sx={(theme) => ({
                                fontSize: "inherit",
                                color: "primary.main",
                                ...theme.applyStyles("dark", {
                                    color: "primary.light",
                                }),
                            })}
                        >
                            products
                        </Typography> */}
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
                    <form action="">
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={1}
                            useFlexGap
                            alignItems="center"
                            sx={{ pt: 2, width: { xs: "100%", sm: "600px" } }}
                        >
                            <InputLabel htmlFor="long-link" sx={visuallyHidden}>
                                Email
                            </InputLabel>
                            <TextField
                                id="long-link"
                                hiddenLabel
                                size="small"
                                variant="outlined"
                                aria-label="Enter Long Link"
                                placeholder="Enter long link to shorten"
                                fullWidth
                                slotProps={{
                                    htmlInput: {
                                        autoComplete: "off",
                                        "aria-label":
                                            "Enter your email address",
                                    },
                                }}
                            />

                            <Button
                                variant="contained"
                                color="primary"
                                size="medium"
                                sx={{
                                    minWidth: "fit-content",
                                }}
                                type="submit"
                            >
                                Shorten link
                            </Button>
                        </Stack>
                    </form>
                    {/* <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textAlign: "center" }}
                    >
                        By clicking &quot;Start now&quot; you agree to our&nbsp;
                        <Link href="#" color="primary">
                            Terms & Conditions
                        </Link>
                        .
                    </Typography> */}
                </Stack>
            </Container>
        </Box>
    );
}
