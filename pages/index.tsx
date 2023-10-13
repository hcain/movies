import type { NextPage } from "next";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Markup } from "interweave";
import { Table, FilterForm } from "./Table";
import styles from "../styles/Home.module.css";


// THIS INTERFACE NEEDS UPDATING
// interface movieType {
//   title: string;
//   times: Array<{ str: string; linkToTickets: string | null }>;
//   date: string;
//   theatre: string;
//   neighboorhood: string;
// }

const Home: NextPage = () => {
  // const [allTheatresByDate, setAllTheatresByDate] = useState<Array<movieType>>([]);

  useEffect(() => {
    const today = new Date()
    // TO DO:
    // CALL DB CODE HERE
    // AND set to allTheatresByDate
  }, []);



  // TABLE CODE:
  // const columns = useMemo(
  //   () => [
  //     {
  //       Header: "Movie",
  //       accessor: "title",
  //       // disable the filter for particular column
  //       disableFilters: true,
  //     },
  //     {
  //       Header: "Times",
  //       accessor: (row: {
  //         times: Array<{ str: string; linkToTickets: string | null }>;
  //       }) => {
  //         return row.times.map(function (time) {
  //           // only return link to tickets if movie hasn't started yet, and metrograph times don't include "sold_out" class
  //           if (validMovieTime(time.str) && time.linkToTickets && !time.linkToTickets.includes("sold_out")) {
  //             return (
  //               <Markup
  //                 key={time.str}
  //                 content={String(time.linkToTickets).replaceAll(",", "")}
  //               />
  //             );
  //             // else return grayed-out, non-link time
  //           } else {
  //             return (
  //               <span key={time.str} style={{ color: "#999999" }}>
  //                 {time.str}
  //               </span>
  //             );
  //           }
  //         });
  //       },
  //       disableSortBy: true,
  //       // disable the filter for particular column
  //       disableFilters: true,
  //     },
  //     {
  //       Header: "Theatre",
  //       accessor: "theatre",
  //       disableSortBy: true,
  //       Filter: FilterForm,
  //     },
  //     {
  //       Header: "Neighborhood",
  //       accessor: "neighboorhood",
  //       disableSortBy: true,
  //       Filter: FilterForm,
  //     },
  //   ],
  //   []
  // );
  return (
    <div className="Home">
      {/* <Table columns={columns} data={allTheatresByDate} /> */}
    </div>
  );
};

export default Home;
