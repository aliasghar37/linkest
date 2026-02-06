"use client";

import { useAlert } from "./AlertContext";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

export default function BasicAlerts() {
    const { alert, hideAlert } = useAlert();

    return (
        <Snackbar open={alert.open} autoHideDuration={6000} onClose={hideAlert}>
            <Alert onClose={hideAlert} severity={alert.severity}>
                {alert.message}
            </Alert>
        </Snackbar>
    );
}
