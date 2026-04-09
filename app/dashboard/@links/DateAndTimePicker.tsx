import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DialogContent, DialogTitle } from "@mui/material";
import dayjs from "dayjs";

export default function ExpiryDateTimePicker({
    value,
    onChange,
}: {
    value: Dayjs | null;
    onChange: (newValue: Dayjs | null) => void;
}) {
    return (
        <>
            <DialogTitle>Select the expiry</DialogTitle>
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                        value={value}
                        onChange={onChange}
                        disablePast
                        minDateTime={dayjs()}
                    />
                </LocalizationProvider>
            </DialogContent>
        </>
    );
}
