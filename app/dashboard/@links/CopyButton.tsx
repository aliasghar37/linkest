import { useState } from "react";
import { IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useAlert } from "@/components/AlertContext";

const CopyButton = ({ url }: { url: string }) => {
    const [open, setOpen] = useState(false);
    const { showAlert } = useAlert();

    const handleClick = () => {
        setOpen(true);
        navigator.clipboard.writeText(url);
        showAlert("Copied to the Clipboard", "info");
    };

    return (
        <>
            <IconButton onClick={handleClick} color="default" size="small">
                <ContentCopyIcon fontSize="small" />
            </IconButton>
        </>
    );
};

export default CopyButton;
