import dayjs, { Dayjs } from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { DialogContent, DialogTitle } from "@mui/material";

export default function ExpiryDateTimePicker({
    value,
    onChange,
}: {
    value: Dayjs | null;
    onChange: (newValue: Dayjs | null) => void;
}) {
    return (
        <>
            <DialogTitle>Select the expiry for the Short URL</DialogTitle>
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker value={value} onChange={onChange} />
                </LocalizationProvider>
            </DialogContent>
        </>
    );
}
