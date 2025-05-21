import type { NextPage, InferGetStaticPropsType, GetStaticProps } from "next";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Markup } from "interweave";
import { Table, FilterForm } from "./Table";
import styles from "../styles/Home.module.css";
import prisma from "../lib/prisma";
import { validMovieTime } from "../utilities/dateFunctions";
import { stringify } from "querystring";
import { NowPlaying } from "@prisma/client";

// THIS INTERFACE NEEDS UPDATING
// interface movieType {
//     title: string;
//     times: {str: string; linkToTickets: string | null };
//     date: string;
//     theatre: string;
//     neighboorhood: string;
// }

interface nowPlayingType {
  id: number,
  time: string,
  captioning: boolean,
  soldOut: boolean,
  tickets: string,
  movieTitle: string,
  movieYear: string,
  movieId: number,
  theatreId: number,
  createdAt: string,
  updatedAt: string,
  movie: {
    id: number,
    title: string,
    year: string,
    imdb: string | null,
    rottenTomatoes:string | null,
    duration: string,
    trailer: string | null,
    createdAt: string,
    updatedAt: string
  },
  theatre: {
    id: number,
    name: string,
    neighborhood: string,
    address: string,
    website: string
  }
}

// type todaysMovies = Array<movieType>

export async function getStaticProps() {
    //  today = current day and time
    const today = new Date();
    // endOfToday = tomorrow at 1 AM
    const endOfToday = new Date(new Date(today.setDate(today.getDate() + 1)).setHours(1, 0, 0, 0));
    const todaysMovies = await prisma.nowPlaying.findMany({
        where: {
            time: {
                // lte: endOfToday,
                gte: today,
            },
        },
        include: {
          movie: true,
          theatre: true,
        },
    });
    const todaysMoviesJSON = JSON.stringify(todaysMovies);
    return { props: { todaysMoviesJSON } };
}

// const Home: NextPage = () => {
function Home({ todaysMoviesJSON }: InferGetStaticPropsType<typeof getStaticProps>) {
    // const [allTheatresByDate, setAllTheatresByDate] = useState<Array<movieType>>([]);
    // console.log(todaysMoviesJSON);

    // useEffect(() => {
    //     // set to allTheatresByDate
    //     setAllTheatresByDate(JSON.parse(todaysMoviesJSON));
    // }, []);
const allTheatresByDate = JSON.parse(todaysMoviesJSON)
    // console.log("PARSE", JSON.parse(todaysMoviesJSON))


    // TABLE CODE:
    const columns = useMemo(
      () => [
        {
          Header: "Movie",
          accessor: "movieTitle",
          // disable the filter for particular column
          disableFilters: true,
        },
        {
          Header: "Time",
          accessor: (row: nowPlayingType) => {
            console.log("ROW", row)
              // only return link to tickets if movie hasn't started yet, and metrograph times don't include "sold_out" class
              if (validMovieTime(row.time) && row.tickets && !row.tickets.includes("sold_out")) {
                return (
                  <Markup
                    key={row.time}
                    content={String(row.tickets).replaceAll(",", "")}
                  />
                );
                // else return grayed-out, non-link time
              } else {
                return (
                  <span key={row.time} style={{ color: "#999999" }}>
                    {row.time}
                  </span>
                );
              }
          },
          disableSortBy: true,
          // disable the filter for particular column
          disableFilters: true,
        },
        {
          Header: "Theatre",
          accessor: "theatre.name",
          disableSortBy: true,
          Filter: FilterForm,
        },
        {
          Header: "Neighborhood",
          accessor: "theatre.neighborhood",
          disableSortBy: true,
          Filter: FilterForm,
        },
      ],
      []
    );

    console.log(allTheatresByDate)
    return (
        <div className="Home">
            <p>HELLO</p>
            <Table columns={columns} data={allTheatresByDate} />
        </div>
    );
}

export default Home;
