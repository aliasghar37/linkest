import { Button, Link, Stack, Typography } from "@mui/material";

export default function ShowError({ message }: { message: string }) {
    return (
        <Stack
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <Typography variant="h4" gutterBottom>
                {message}
            </Typography>
            <Button variant="text">
                <Link href="/">Return Home</Link>
            </Button>
        </Stack>
    );
}
