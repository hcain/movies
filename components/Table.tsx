import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
} from "@tanstack/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import React, { useMemo } from "react";
import styles from "../styles/Table.module.css";

interface ReactTableProps<T extends object> {
    data: T[];
    columns: ColumnDef<T>[];
}

const Table = <T extends object>({ data, columns }: ReactTableProps<T>) => {
    const table = useReactTable({
        data, // The data to be displayed in the table
        columns, // Column definitions
        getCoreRowModel: getCoreRowModel(), // Method to compute rows based on core data
        getSortedRowModel: getSortedRowModel(), //client-side sorting
    });

    return (
        <div>
            {/* Render the table */}
            <table>
                <thead>
                    {/* Render table headers */}
                    {table.getHeaderGroups() && table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers && headerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {/* {header.isPlaceholder ? null : ( */}
                                    <div
                                        className={
                                            header.column.getCanSort()
                                                ? header.column.getIsSorted() === "asc"
                                                    ? styles.asc // apply ascending icon
                                                    : header.column.getIsSorted() === "desc"
                                                    ? styles.desc // apply descending icon
                                                    : "" // no icon
                                                : "" // no sorting
                                        }
                                        onClick={header.column.getToggleSortingHandler()}
                                        title={
                                            header.column.getCanSort()
                                                ? header.column.getNextSortingOrder() === "asc"
                                                    ? "Sort ascending"
                                                    : header.column.getNextSortingOrder() === "desc"
                                                    ? "Sort descending"
                                                    : "Clear sort"
                                                : undefined
                                        }
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </div>
                                    {/* )} */}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {/* Render table rows */}
                    {table.getRowModel() && table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells() && row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {/* Render each cell's content */}
                                    {flexRender(
                                        cell.column.columnDef.cell, // Cell definition
                                        cell.getContext() // Context for the cell
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
