import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import * as cheerio from "cheerio";
import { Markup } from "interweave";
import { Table, FilterForm } from "./Table";
import { validMovieTime } from "../utilities/dateFunctions";
import styles from "../styles/Home.module.css";
import { first } from "cheerio/lib/api/traversing";
import { scrapeGoogle } from "./api/scrapeSites";

interface movieType {
  title: string;
  times: Array<{ str: string; linkToTickets: string | null }>;
  date: string;
  theatre: string;
  neighboorhood: string;
}

const Home: NextPage = () => {
  const [moviesIFC, setIFCMovies] = useState<Array<movieType>>([]);
  const [moviesIFCByDate, setIFCByDate] = useState<Array<movieType>>([]);
  const [dateIFC, setDateIFC] = useState("");
  const [moviesMetrograph, setMetrographMovies] = useState<Array<movieType>>([])
  const [moviesMetrographByDate, setMetrographByDate] = useState<Array<movieType>>([]);
  const [dateMetrograph, setDateMetrograph] = useState("");
  const [allTheatresByDate, setAllTheatresByDate] = useState<Array<movieType>>([]);

  useEffect(() => {
    const today = new Date()
      const todayIFC = today.toLocaleDateString("en-us", {
        weekday: "short",
        month: "short",
        day: "numeric",
      })
      .replace(",", "");
    // console.log("TODAY IFC", todayIFC)
    setDateIFC(todayIFC);
    const todayMetrograph = today.toLocaleDateString("en-us", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
    .replace(",", "");
  // console.log("TODAY METROGRAPH", todayMetrograph)
  setDateMetrograph(todayMetrograph);
    const scrapeIFC = async () => {
      // using https://allorigins.win/ as  server for production (https://github.com/Rob--W/cors-anywhere/issues/301)
      // '?nocache=${Date.now()}' at end of url prevents caching
      const html = await axios.get(
        "https://api.allorigins.win/get?url=https://www.ifccenter.com/?nocache=${Date.now()}"
      );
      // WHEN RAW, just html.data
      // https://api.allorigins.win/raw?url=https://www.ifccenter.com/?nocache=${Date.now()}
      // const $ = cheerio.load(html.data);
      // console.log("axios", html.data.contents)
      const $ = cheerio.load(html.data.contents);
      // console.log("GET NOT RAW", $)
      const movieData = $(".showtimes .daily-schedule .details h3")
        .not(".show-coming-soon h3")
        .map(function (i, element): movieType {
          const movieTitle = $(element); // console.log(movieTitle.text());
          const movieTimes = movieTitle
            .parent()
            .children(".times")
            .children("li")
            .map(function (i, element) {
              // console.log("TIMES", element);
              return {
                str: $(element).text(),
                linkToTickets: $(element).html(),
              };
            })
            .get();
          // console.log('IFC', movieTimes);
          const movieDate = movieTitle
            .parent()
            .parent()
            .parent()
            .parent()
            .children("h3")
            .first()
            .text(); // console.log(movieDate);
          return {
            title: movieTitle.text(),
            times: movieTimes,
            date: movieDate,
            theatre: "IFC",
            neighboorhood: "West Village",
          };
        })
        .get();
      // const movies = $('.showtimes .daily-schedule h3, .showtimes .daily-schedule .details .times a').not('.show-coming-soon h3').text();
      // console.log(movieData)
      setIFCMovies(movieData);
      // console.log("ALL IFC", movieData);
    };
    scrapeIFC();
    const scrapeMetrograph = async () => {
      // using https://allorigins.win/ as  server for production (https://github.com/Rob--W/cors-anywhere/issues/301)
      // '?nocache=${Date.now()}' at end of url prevents caching
      const html = await axios.get(
        "https://api.allorigins.win/get?url=https://metrograph.com/calendar/?nocache=${Date.now()}"
      );
      const $ = cheerio.load(html.data);
      const movieData = $(
        ".calendar-list-day .item .calendar-list-showtimes .title"
      ).map(function (i, element): movieType {
        const movieTitle = $(element);
        // console.log("METRO TITLE", movieTitle.text());
        const movieTimes = movieTitle
          .nextAll()
          .map(function (i, element) {
            // console.log("TIMES", element);
            return {
              str: $(element).text(),
              linkToTickets: $(element).prop("outerHTML"),
            };
          })
          .get();
        console.log("Metro times", movieTimes)
        const movieDate = movieTitle
          .parent()
          .parent()
          .parent()
          .parent()
          .parent()
          .children(".date")
          .text();
        // console.log("metro date", movieDate)
        return {
          title: movieTitle.text(),
          times: movieTimes,
          date: movieDate,
          theatre: "Metrograph",
          neighboorhood: "LES",
        };
      })
      .get();
      setMetrographMovies(movieData)
      // console.log("Metrograph", $);
    };
    // scrapeMetrograph();
  }, []);

  useEffect(() => {
    const moviesByDate = moviesIFC.filter((movie) => movie.date === dateIFC);
    setIFCByDate(moviesByDate);
    // console.log("DATE IFC", moviesByDate)
  }, [dateIFC, moviesIFC]);

  useEffect(() => {
    const moviesByDate = moviesMetrograph.filter((movie) => movie.date === dateMetrograph);
    setMetrographByDate(moviesByDate);
    // console.log("DATE Metrograph", moviesByDate)
  }, [dateMetrograph, moviesMetrograph]);

  useEffect(() => {
    setAllTheatresByDate(moviesIFCByDate.concat(moviesMetrographByDate))
  }, [moviesIFCByDate, moviesMetrographByDate])

  const columns = useMemo(
    () => [
      {
        Header: "Movie",
        accessor: "title",
        // disable the filter for particular column
        disableFilters: true,
      },
      {
        Header: "Times",
        accessor: (row: {
          times: Array<{ str: string; linkToTickets: string | null }>;
        }) => {
          return row.times.map(function (time) {
            // only return link to tickets if movie hasn't started yet, and metrograph times don't include "sold_out" class
            if (validMovieTime(time.str) && time.linkToTickets && !time.linkToTickets.includes("sold_out")) {
              return (
                <Markup
                  key={time.str}
                  content={String(time.linkToTickets).replaceAll(",", "")}
                />
              );
              // else return grayed-out, non-link time
            } else {
              return (
                <span key={time.str} style={{ color: "#999999" }}>
                  {time.str}
                </span>
              );
            }
          });
        },
        disableSortBy: true,
        // disable the filter for particular column
        disableFilters: true,
      },
      {
        Header: "Theatre",
        accessor: "theatre",
        disableSortBy: true,
        Filter: FilterForm,
      },
      {
        // TODO: Misspelled
        Header: "Neighboorhood",
        accessor: "neighboorhood",
        disableSortBy: true,
        Filter: FilterForm,
      },
    ],
    []
  );
  return (
    <div className="Home">
      <Table columns={columns} data={allTheatresByDate} />
    </div>
  );
};

export default Home;
