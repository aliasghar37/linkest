"use client";

import { useState, Fragment } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { type Link as LinkType } from "./page";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CopyButton from "./CopyButton";
import FormattedDate from "./FormatedDate";
import { Link, Stack, Switch } from "@mui/material";
import updateLink from "@/app/actions/handleLinkChange";
import { useAlert } from "@/components/AlertContext";
import SetExpiry from "./SetExpiry";
import DeleteButton from "./DeleteButton";
import EditSummaryButton from "./EditSummary";
import SetPassword from "./SetPassword";

const handleDownloadQr = (link: LinkType) => {
    const linkElement = document.createElement("a");
    linkElement.href = link.qrCode;
    linkElement.download = `${link.shortId}.png`;
    document.body.appendChild(linkElement);
    linkElement.click();
    linkElement.remove();
};

export function Row({ link }: { link: LinkType }) {
    const [status, setStatus] = useState(`${link.status}`);
    const [open, setOpen] = useState(false);
    const [checked, setChecked] = useState(link.previewPage);
    const [hasExpiry, setHasExpiry] = useState<boolean>(
        Boolean(link.expiresAt),
    );
    const { showAlert } = useAlert();

    const handleStatusChange = async (event: SelectChangeEvent) => {
        setStatus(event.target.value as string);
        const boolStatus: boolean = event.target.value === "true";

        const res = await updateLink({
            userId: link.userId,
            shortId: link.shortId,
            status: boolStatus,
        });
        if (res) showAlert("URL Status has been changed", "success");
        else showAlert("Couldn't update the URL status", "error");
    };

    const handleChecked = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setChecked(event.target.checked);

        const res = await updateLink({
            userId: link.userId,
            shortId: link.shortId,
            previewPage: event.target.checked,
        });
        if (res) showAlert("URL Preview Page has been changed", "success");
        else showAlert("Couldn't update the URL preview page", "error");
    };

    return (
        <Fragment>
            <TableRow>
                <TableCell sx={{ maxWidth: 66, direction: "column" }}>
                    <Stack
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <DeleteButton link={link} />
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            // sx={{ width: "fit-content" }}
                            onClick={() => setOpen(!open)}
                        >
                            {open ? (
                                <KeyboardArrowUpIcon />
                            ) : (
                                <KeyboardArrowDownIcon />
                            )}
                        </IconButton>
                    </Stack>
                </TableCell>
                <TableCell
                    component="th"
                    scope="row"
                    sx={{
                        maxWidth: "150px",
                        overflow: "hidden",
                        "& .short-url-copy-button": {
                            md: {
                                opacity: 0,
                                pointerEvents: "none",
                                transition: "opacity 0.2s ease",
                            },
                        },
                        "&:hover .short-url-copy-button": {
                            md: { opacity: 1, pointerEvents: "auto" },
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            minWidth: 0,
                            gap: 0.5,
                        }}
                    >
                        <Box
                            component="span"
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <Link
                                href={link.shortUrl}
                                underline="hover"
                                target="_blank"
                                rel="noopener noreferrer"
                                color="inherit"
                            >
                                {link.shortUrl}
                            </Link>
                        </Box>
                        <Box component="span" className="short-url-copy-button">
                            <CopyButton url={link.shortUrl}></CopyButton>
                        </Box>
                    </Box>
                </TableCell>
                <TableCell
                    align="left"
                    sx={{
                        maxWidth: "150px",
                        overflow: "hidden",
                        "& .short-url-copy-button": {
                            md: {
                                opacity: 0,
                                pointerEvents: "none",
                                transition: "opacity 0.2s ease",
                            },
                        },
                        "&:hover .short-url-copy-button": {
                            md: { opacity: 1, pointerEvents: "auto" },
                        },
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            minWidth: 0,
                            gap: 0.5,
                        }}
                    >
                        <Box
                            component="span"
                            sx={{
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <Link
                                href={link.longUrl}
                                underline="hover"
                                target="_blank"
                                rel="noopener noreferrer"
                                color="inherit"
                            >
                                {link.longUrl}
                            </Link>
                        </Box>
                        <Box component="span" className="short-url-copy-button">
                            <CopyButton url={link.longUrl}></CopyButton>
                        </Box>
                    </Box>
                </TableCell>
                <TableCell align="left">
                    <Box
                        component="img"
                        src={link.qrCode}
                        alt={`QR code of ${link.shortUrl}`}
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: 1,
                            display: "block",
                            cursor: "pointer",
                        }}
                        onClick={() => handleDownloadQr(link)}
                    ></Box>
                </TableCell>
                <TableCell
                    align="left"
                    sx={{
                        maxWidth: "150px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {link.clicks}
                </TableCell>
                <TableCell
                    align="left"
                    sx={{
                        maxWidth: "150px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    <FormattedDate date={link.createdAt} />
                    {/* {`${link.createdAt}`} */}
                </TableCell>
                <TableCell
                    align="left"
                    sx={{
                        maxWidth: "150px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    <Switch
                        size="small"
                        checked={checked}
                        onChange={handleChecked}
                        slotProps={{ input: { "aria-label": "controlled" } }}
                    />
                </TableCell>
                <TableCell
                    align="left"
                    sx={{
                        maxWidth: "150px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    <Select
                        value={status}
                        onChange={handleStatusChange}
                        size="small"
                        sx={{ fontSize: 14 }}
                    >
                        <MenuItem value="true" sx={{ fontSize: 14 }}>
                            Active
                        </MenuItem>
                        <MenuItem value="false" sx={{ fontSize: 14 }}>
                            Disable
                        </MenuItem>
                    </Select>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={8}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Stack direction={"row"}>
                            <Stack gap={2} alignSelf={"center"}>
                                {hasExpiry ? (
                                    <SetExpiry
                                        buttonType="removeExpiry"
                                        link={link}
                                        setHasExpiry={setHasExpiry}
                                    ></SetExpiry>
                                ) : (
                                    <SetExpiry
                                        buttonType="setExpiry"
                                        link={link}
                                        setHasExpiry={setHasExpiry}
                                    ></SetExpiry>
                                )}

                                <SetPassword
                                    buttonType="addPassword"
                                    link={link}
                                />
                            </Stack>
                            <Box sx={{ margin: 1 }}>
                                <Typography
                                    variant="h6"
                                    gutterBottom
                                    component="div"
                                >
                                    Summary
                                    <EditSummaryButton link={link} />
                                </Typography>
                                <Typography
                                    variant="body2"
                                    gutterBottom
                                    component="div"
                                >
                                    {link.summary}
                                </Typography>
                            </Box>
                        </Stack>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
}
