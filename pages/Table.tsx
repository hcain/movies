import React, { JSX, useMemo } from "react";
import { useTable, useSortBy, useFilters } from "react-table";
import styles from "../styles/Table.module.css";

// interface nowPlayingType {
//   id: number,
//   time: string,
//   captioning: boolean,
//   soldOut: boolean,
//   tickets: string,
//   movieTitle: string,
//   movieYear: string,
//   movieId: number,
//   theatreId: number,
//   createdAt: string,
//   updatedAt: string,
//   movie: {
//     id: number,
//     title: string,
//     year: string,
//     imdb: string | null,
//     rottenTomatoes:string | null,
//     duration: string,
//     trailer: string | null,
//     createdAt: string,
//     updatedAt: string
//   },
//   theatre: {
//     id: number,
//     name: string,
//     neighborhood: string,
//     address: string,
//     website: string
//   }
// }

// interface columnType {
//   Header: string,
//   accessor: string | ((row: nowPlayingType) => JSX.Element),
//   disableFilters: boolean,
//   disableSortBy?: boolean,
//   Filter?: undefined

// }

export const FilterForm = ({ column }:any) => {
    const { filterValue, setFilter, preFilteredRows, id } = column;

    // Use preFilteredRows to calculate the options
    const options = useMemo(() => {
        const options = new Set();
        preFilteredRows.forEach((row:any) => {
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

export function Table({ columns, data }:any) {
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
                {headerGroups.map((headerGroup, i) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                        {headerGroup.headers.map((column, j) => (
                            <th
                                {...column.getHeaderProps(column.getSortByToggleProps())}
                                key={j}
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
                {rows.map((row, k) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()} key={k}>
                            {row.cells.map((cell, l) => {
                                return (
                                    <td {...cell.getCellProps()} key={l}>
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
