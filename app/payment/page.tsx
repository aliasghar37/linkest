import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CheckoutForm from "@/components/CheckoutForm";

export default function PaymentPage() {
    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Box sx={{ display: "grid", gap: 2 }}>
                <CheckoutForm />
            </Box>
        </Container>
    );
}
