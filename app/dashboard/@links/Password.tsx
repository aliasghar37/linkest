import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { useState } from "react";

export default function ExpiryDateTimePicker() {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Select the expiry for the Short URL</DialogTitle>
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                        components={[
                            "DateTimePicker",
                            "MobileDateTimePicker",
                            "DesktopDateTimePicker",
                            "StaticDateTimePicker",
                        ]}
                    >
                        <DemoItem>
                            <DateTimePicker
                                defaultValue={dayjs("2022-04-17T15:30")}
                            />
                        </DemoItem>
                    </DemoContainer>
                </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button type="submit" form="subscription-form">
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
}
