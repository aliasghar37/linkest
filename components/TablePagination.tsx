"use client";

import { useState, MouseEvent } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface TablePaginationActionsProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (
        event: MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;

    const handleBackButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1);
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === "rtl" ? (
                    <KeyboardArrowRight />
                ) : (
                    <KeyboardArrowLeft />
                )}
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                aria-label="next page"
            >
                {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft />
                ) : (
                    <KeyboardArrowRight />
                )}
            </IconButton>
        </Box>
    );
}

export function MyTableFooter({
    count,
    currentPage,
    rowsPerPage,
}: {
    count: number;
    currentPage: number;
    rowsPerPage: number;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleChangePage = (newPage: number, newLimit: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        params.set("limit", newLimit.toString());

        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <TableRow>
            <TablePagination
                rowsPerPageOptions={[10, 15]}
                colSpan={8}
                count={count}
                rowsPerPage={rowsPerPage}
                page={currentPage}
                slotProps={{
                    select: {
                        inputProps: {
                            "aria-label": "rows per page",
                        },
                        native: true,
                    },
                }}
                onPageChange={(_, newPage) =>
                    handleChangePage(newPage, rowsPerPage)
                }
                ActionsComponent={TablePaginationActions}
                onRowsPerPageChange={(e) =>
                    handleChangePage(0, Number(e.target.value))
                }
            />
        </TableRow>
    );
}
