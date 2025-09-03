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

export const FilterForm = ({ column }: any) => {
    const { filterValue, setFilter, preFilteredRows, id } = column;

    // Use preFilteredRows to calculate the options
    const options = useMemo(() => {
        const options = new Set();
        preFilteredRows.forEach((row: any) => {
            options.add(row.values[id]);
        });
        return [...options.values()];
    }, [id, preFilteredRows]);

    return (
        <select value={filterValue || ""} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All</option>
            {options.map((option, i) => (
                <option key={i} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};

export const Table = <T extends object>({ data, columns }: ReactTableProps<T>) => {
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
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th key={header.id}>
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
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {/* Render table rows */}
                    {table.getRowModel().rows.map((row) => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
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
