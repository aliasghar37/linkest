"use client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

export const theme = createTheme({
    palette: {
        mode: "dark",
    },
    typography: {
        fontFamily: "var(--font-roboto)",
    },
    // cssVariables: true,
});

export default function AppTheme({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}
