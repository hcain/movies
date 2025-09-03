import type { NextPage, InferGetStaticPropsType, GetStaticProps } from "next";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Markup } from "interweave";
import { ColumnDef, flexRender, SortingFn } from "@tanstack/react-table";
import Table from "../components/Table";
import styles from "../styles/Home.module.css";
import prisma from "../lib/prisma";
import { validMovieTime, convertISOStringToTime } from "../utilities/dateFunctions";
import { stringify } from "querystring";
const { DateTime } = require("luxon");

// THIS INTERFACE NEEDS UPDATING
// interface movieType {
//     title: string;
//     times: {str: string; linkToTickets: string | null };
//     date: string;
//     theatre: string;
//     neighboorhood: string;
// }

interface nowPlayingType {
    id: number;
    time: string;
    captioning: boolean;
    soldOut: boolean;
    tickets: string;
    movieTitle: string;
    movieYear: string;
    movieId: number;
    theatreId: number;
    createdAt: string;
    updatedAt: string;
    movie: {
        id: number;
        title: string;
        year: string;
        imdb: string | null;
        rottenTomatoes: string | null;
        duration: string;
        trailer: string | null;
        createdAt: string;
        updatedAt: string;
    };
    theatre: {
        id: number;
        name: string;
        neighborhood: string;
        address: string;
        website: string;
    };
}

// type todaysMovies = Array<movieType>

export async function getStaticProps() {
    //  today = current day and time
    const today = DateTime.now();

    // endOfToday = tomorrow at 1 AM
    const endOfToday = DateTime.now().plus({ days: 1 }).startOf("day").plus({ hours: 1 });
    const todaysMovies = await prisma.nowPlaying.findMany({
        where: {
            time: {
                lte: endOfToday.toISO(),
                gte: today.toISO(),
            },
        },
        include: {
            movie: true,
            theatre: true,
        },
    });
    const todaysMoviesJSON = JSON.stringify(todaysMovies);
    // console.log("fetched list", todaysMoviesJSON);
    return { props: { todaysMoviesJSON } };
}

export default function Home({ todaysMoviesJSON }: InferGetStaticPropsType<typeof getStaticProps>) {
    // const [allTheatresByDate, setAllTheatresByDate] = useState<Array<movieType>>([]);
    // console.log(todaysMoviesJSON);

    // useEffect(() => {
    //     // set to allTheatresByDate
    //     setAllTheatresByDate(JSON.parse(todaysMoviesJSON));
    // }, []);
    const allTheatresByDate = JSON.parse(todaysMoviesJSON);
    // console.log("PARSE", JSON.parse(todaysMoviesJSON));

    // TABLE CODE:
    const columns = useMemo<ColumnDef<nowPlayingType>[]>(
        () => [
            {
                header: "Movie",
                accessorKey: "movieTitle",
                sortingFn: "alphanumeric", // use built-in sorting function by name
                // disable the filter for particular column
                disableFilters: true,
            },
            {
                header: "Time",
                accessorKey: "time",
                cell: ({ cell, row }) => {
                    // console.log("ROW", row);
                    // only return link to tickets if movie hasn't started yet, and metrograph times don't include "sold_out" class in url
                    if (
                        validMovieTime(row.original.time) &&
                        row.original.tickets &&
                        !row.original.tickets.includes("sold_out")
                    ) {
                        return (
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                suppressHydrationWarning
                                key={row.original.time}
                                href={String(row.original.tickets).replaceAll(",", "")}
                            >
                                {convertISOStringToTime(row.original.time)}
                            </a>

                            // TODO: remove interweave?
                            // <Markup
                            //     key={row.original.time}
                            //     content={String(row.original.tickets).replaceAll(",", "")}
                            //     // attributes={suppressHydrationWarning: true}
                            // />
                        );
                        // else return grayed-out, non-link time
                    } else {
                        return (
                            <span
                                suppressHydrationWarning
                                key={row.original.time}
                                style={{ color: "#999999" }}
                            >
                                {convertISOStringToTime(row.original.time)}
                            </span>
                        );
                    }
                },
                sortingFn: "datetime", // recommended for date columns
                disableSortBy: true,
                // disable the filter for particular column
                disableFilters: true,
            },
            {
                header: "Theatre",
                accessorKey: "theatre.name",
                enableSorting: false, // disable sorting for this column
                disableSortBy: true,
                // Filter: FilterForm,
            },
            {
                header: "Neighborhood",
                accessorKey: "theatre.neighborhood",
                enableSorting: false, // disable sorting for this column
                disableSortBy: true,
                // Filter: FilterForm,
            },
        ],
        []
    );

    // console.log(allTheatresByDate);
    return (
        <div className="Home">
            {todaysMoviesJSON && <Table columns={columns} data={allTheatresByDate} />}
        </div>
    );
}
