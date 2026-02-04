"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

function createData(
    shortLink: string,
    longLink: number,
    qrCode: number,
    clicks: number,
    status: number,
    createdAt: number,
) {
    return {
        shortLink,
        longLink,
        qrCode,
        clicks,
        status,
        createdAt,
    };
}

function Row(props: { row: ReturnType<typeof createData> }) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? (
                            <KeyboardArrowUpIcon />
                        ) : (
                            <KeyboardArrowDownIcon />
                        )}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.shortLink}
                </TableCell>
                <TableCell align="left">{row.longLink}</TableCell>
                <TableCell align="left">{row.qrCode}</TableCell>
                <TableCell align="left">{row.clicks}</TableCell>
                <TableCell align="left">{row.status}</TableCell>
                <TableCell align="left">{row.createdAt}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={7}
                >
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                            >
                                Summary
                            </Typography>
                            <Typography
                                variant="body2"
                                gutterBottom
                                component="div"
                            >
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit. Alias quos consequuntur labore
                                facilis repudiandae est ipsum, quis, corrupti
                                illo ducimus cumque laborum autem aliquam
                                corporis, aperiam aliquid voluptatem officia
                                totam. Mollitia similique ipsam voluptatem neque
                                facilis exercitationem minus porro eveniet,
                                dolor harum quam non voluptas. Excepturi iusto
                                quam voluptate expedita quaerat minima aut qui
                                quasi ea, cum in? Et, veritatis?
                            </Typography>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}
const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0, 3.99),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3, 4.99),
    createData("Eclair", 262, 16.0, 24, 6.0, 3.79),
    createData("Cupcake", 305, 3.7, 67, 4.3, 2.5),
];
export default function CollapsibleTable() {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell>Short Link</TableCell>
                        <TableCell align="left">Long Link</TableCell>
                        <TableCell align="left">qrCode</TableCell>
                        <TableCell align="left">Clicks</TableCell>
                        <TableCell align="left">Status</TableCell>
                        <TableCell align="left">Create At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <Row key={row.shortLink} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
