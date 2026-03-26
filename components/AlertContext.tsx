"use client";
import { createContext, useCallback, useContext, useState } from "react";

type AlertType = "success" | "error" | "info";
type AlertState = {
    open: boolean;
    message: string;
    type: AlertType;
};
type AlertContextType = {
    showAlert: (message: string, type?: AlertType) => void;
    hideAlert: () => void;
    alert: AlertState;
};
const AlertContext = createContext<AlertContextType | null>(null);
export function AlertProvider({ children }: { children: React.ReactNode }) {
    const [alert, setAlert] = useState<AlertState>({
        open: false,
        message: "",
        type: "info",
    });

    const showAlert = useCallback(
        (message: string, type: AlertType = "info") => {
            setAlert({ open: true, message, type });
        },
        [],
    );
    const hideAlert = useCallback(() => {
        setAlert((prev) => ({ ...prev, open: false }));
    }, []);

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert, alert }}>
            {children}
        </AlertContext.Provider>
    );
}
export function useAlert() {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error("useAlert must be used in AlertProvider");
    }
    return context;
}
