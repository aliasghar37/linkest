import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../theme";
import AppTheme from "../theme";

const roboto = Roboto({
    weight: ["300", "400", "500", "700"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto",
});

export const metadata: Metadata = {
    title: "Linkest",
    description:
        "Shorten you long URLs and merge them in a single page to share on social media.    ",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider appearance={{ theme: dark }}>
            <html lang="en" className={roboto.variable}>
                <body className={` antialiased`}>
                    <AppRouterCacheProvider>
                        <ThemeProvider theme={theme}>
                            <AppTheme>{children}</AppTheme>
                        </ThemeProvider>
                    </AppRouterCacheProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
