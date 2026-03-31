import LinkestLogo from "@/components/LinkestIcon";
import {
    Button,
    Container,
    Typography,
    Paper,
    Box,
    Stack,
    Link,
} from "@mui/material";

export default function PreviewPage({ link }: { link: any }) {
    return (
        <Container maxWidth="sm" sx={{ mt: 10 }}>
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
                    {link.summary || "No summary provided for this link."}
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
                    <Typography variant="body1" display="block" gutterBottom>
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
                    sx={{ py: 1.5, borderRadius: 2 }}
                >
                    Proceed to Link
                </Button>

                <Button href="/" variant="text" sx={{ mt: 2 }}>
                    Back to Linkest
                </Button>
            </Paper>
        </Container>
    );
}
