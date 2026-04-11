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
import { auth } from "@clerk/nextjs/server";

export type Link = {
    id: string;
    shortId: string;
    shortUrl: string;
    longUrl: string;
    title: string;
    summary: string;
    qrCode: string;
    createdAtLabel?: string;
    expiresAt?: Date | null;
    clicks: number;
    status: boolean;
    userId: string;
    previewPage: boolean;
    password?: string | null;
};

export default async function CollapsibleTable({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; limit?: string }>;
}) {
    const params = await searchParams;
    const page = Number(params.page) || 0;
    const limit = Number(params.limit) || 10;
    const { userId } = await auth();
    if (!userId) return;

    const timeFormatter = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
    const dayMonthFormatter = new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
    });

    const [rawLinks, totalLinks] = await Promise.all([
        prisma.link.findMany({
            where: { userId },
            skip: page * 10,
            take: limit,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                shortId: true,
                shortUrl: true,
                longUrl: true,
                title: true,
                summary: true,
                qrCode: true,
                createdAt: true,
                expiresAt: true,
                clicks: true,
                status: true,
                userId: true,
                previewPage: true,
                password: true,
            },
        }),
        prisma.link.count({ where: { userId } }),
    ]);

    const links: Link[] = rawLinks.map((link) => ({
        ...link,
        createdAtLabel: `${timeFormatter.format(link.createdAt)} ${dayMonthFormatter.format(link.createdAt)}`,
    }));

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
