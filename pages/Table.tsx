import React, { useMemo } from "react";
import { useTable, useSortBy, useFilters } from "react-table";
import styles from "../styles/Table.module.css";

export const FilterForm = ({ column }) => {
    const { filterValue, setFilter, preFilteredRows, id } = column;

    // Use preFilteredRows to calculate the options
    const options = useMemo(() => {
        const options = new Set();
        preFilteredRows.forEach((row) => {
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

export function Table({ columns, data }) {
    // Use the useTable Hook to send the columns and data to build the table
    const {
        getTableProps, // table props from react-table
        getTableBodyProps, // table body props from react-table
        headerGroups, // headerGroups, if your table has groupings
        rows, // rows for the table based on the data passed
        prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
    } = useTable(
        {
            columns,
            data,
        },
        useFilters, // useFilters!
        useSortBy
    );

    /* 
    Render the UI for your table
    - react-table doesn't have UI, it's headless. We just need to put the react-table props from the Hooks, and it will do its magic automatically
  */
    return (
        <table {...getTableProps()}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                        {headerGroup.headers.map((column) => (
                            <th
                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                key={column.id}
                                className={
                                    column.isSorted
                                        ? column.isSortedDesc
                                            ? styles.desc
                                            : styles.asc
                                        : ""
                                }
                            >
                                {column.render("Header")}
                                <div>{column.canFilter ? column.render("Filter") : null}</div>
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()} key={row.id}>
                            {row.cells.map((cell) => {
                                return (
                                    <td {...cell.getCellProps()} key={cell.value}>
                                        {cell.render("Cell")}
                                    </td>
                                );
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
