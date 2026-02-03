// "use client";
import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function FAQ() {
    const [expanded, setExpanded] = React.useState<string[]>([]);

    const handleChange =
        (panel: string) =>
        (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(
                isExpanded
                    ? [...expanded, panel]
                    : expanded.filter((item) => item !== panel),
            );
        };

    return (
        <Container
            id="faq"
            sx={{
                pt: { xs: 4, sm: 12 },
                pb: { xs: 8, sm: 16 },
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: { xs: 3, sm: 6 },
            }}
        >
            <Typography
                component="h2"
                variant="h4"
                sx={{
                    color: "text.primary",
                    width: { sm: "100%", md: "60%" },
                    textAlign: { sm: "left", md: "center" },
                }}
            >
                Frequently asked questions
            </Typography>
            <Box sx={{ width: "100%" }}>
                <Accordion
                    expanded={expanded.includes("panel1")}
                    onChange={handleChange("panel1")}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1d-content"
                        id="panel1d-header"
                    >
                        <Typography component="span" variant="subtitle2">
                            What makes Linkest different from other URL
                            shorteners?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography
                            variant="body2"
                            gutterBottom
                            sx={{ maxWidth: { sm: "100%", md: "70%" } }}
                        >
                            Unlike standard shorteners, Linkest uses AI to
                            automatically generate summaries of the destination
                            page. This gives your audience a transparent preview
                            of where the link leads, increasing trust and
                            click-through rates.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion
                    expanded={expanded.includes("panel2")}
                    onChange={handleChange("panel2")}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2d-content"
                        id="panel2d-header"
                    >
                        <Typography component="span" variant="subtitle2">
                            Can I customize the back-half of my shortened links?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography
                            variant="body2"
                            gutterBottom
                            sx={{ maxWidth: { sm: "100%", md: "70%" } }}
                        >
                            Yes! You can replace random characters with custom
                            aliases (e.g., linkest.vercel.app/my-portfolio) to
                            make your links more memorable and professional for
                            your brand.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion
                    expanded={expanded.includes("panel3")}
                    onChange={handleChange("panel3")}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel3d-content"
                        id="panel3d-header"
                    >
                        <Typography component="span" variant="subtitle2">
                            What is the "AI Summary" feature?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography
                            variant="body2"
                            gutterBottom
                            sx={{ maxWidth: { sm: "100%", md: "70%" } }}
                        >
                            When you input a long URL, our system briefly visits
                            the page to understand its content. It then provides
                            a concise text summary that appears whenever you
                            manage the link in your dashboard.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                <Accordion
                    expanded={expanded.includes("panel4")}
                    onChange={handleChange("panel4")}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel4d-content"
                        id="panel4d-header"
                    >
                        <Typography component="span" variant="subtitle2">
                            Can I deactivate a link without deleting it?
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography
                            variant="body2"
                            gutterBottom
                            sx={{ maxWidth: { sm: "100%", md: "70%" } }}
                        >
                            Yes, your dashboard allows you to toggle the status
                            of any link between "Active" and "Inactive." This
                            gives you full control over your traffic without
                            losing your historical click data.
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Container>
    );
}
