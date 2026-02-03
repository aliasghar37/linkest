import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
// import { Navigation } from "@/components/Navigation";
import { dark } from "@clerk/themes";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../theme";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

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
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <AppRouterCacheProvider>
                        <ThemeProvider theme={theme}>
                            {/* <Navigation /> */}
                            {children}
                        </ThemeProvider>
                    </AppRouterCacheProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
