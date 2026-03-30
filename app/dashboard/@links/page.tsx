import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableFooter from "@mui/material/TableFooter";
import { MyTableFooter } from "@/components/TablePagination";
import { Row } from "./Row";
import prisma from "@/lib/prisma";

export type Link = {
    id: string;
    shortId: string;
    shortUrl: string;
    longUrl: string;
    summary: string;
    title: string;
    qrCode: string;
    createdAt: Date;
    clicks: number;
    status: boolean;
    userId: string;
    previewPage: boolean;
};

export default async function CollapsibleTable({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; limit?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 0;
    const limit = Number(params.limit) || 10;

    const [links, totalLinks] = await Promise.all([
        prisma.link.findMany({
            skip: page * 10,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma.link.count(),
    ]);

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
                        <TableCell align="left">Created At</TableCell>
                        <TableCell align="left">Preview Page</TableCell>
                        <TableCell align="left">Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {links.map((link) => (
                        <Row key={link.shortId} link={link} />
                    ))}
                </TableBody>
                <TableFooter>
                    <MyTableFooter
                        count={totalLinks}
                        currentPage={page}
                        rowsPerPage={limit}
                    />
                </TableFooter>
            </Table>
        </TableContainer>
    );
}
