"use client";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function BasicCard({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <Card
            sx={(theme) => ({
                minWidth: 120,
                maxWidth: 280,
                backgroundRepeat: "no-repeat",
                ...theme.applyStyles("dark", {
                    backgroundImage:
                        "radial-gradient(ellipse 80% 100% at 80% -10%, hsl(210, 100%, 16%), transparent) ",
                }),
            })}
            style={{
                border: "1px",
                borderColor: "darkslateblue",
                borderStyle: "solid",
            }}
        >
            <CardContent>
                <Typography
                    gutterBottom
                    sx={{ color: "text.secondary", fontSize: 14 }}
                >
                    {label}
                </Typography>
                <Typography variant="h5" component="div">
                    {value}
                </Typography>
            </CardContent>
        </Card>
    );
}
