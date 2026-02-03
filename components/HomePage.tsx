"use client";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import AppTheme from "../theme";
import AppAppBar from "./AppAppBar";
import Hero from "./Hero";
import Highlights from "./Highlights";
import Pricing from "./Pricing";
import Features from "./Features";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import Footer from "./Footer";

export default function HomePage(props: { disableCustomTheme?: boolean }) {
    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />

            <AppAppBar />
            <Hero />
            <div>
                <Features />
                <Divider />
                <Testimonials />
                <Divider />
                <Highlights />
                <Divider />
                <Pricing />
                <Divider />
                <FAQ />
                <Divider />
                <Footer />
            </div>
        </AppTheme>
    );
}
