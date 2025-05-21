import axios from "axios";
import * as cheerio from "cheerio";
import prisma from "../../lib/prisma";
import {
  getMovieDateTime,
} from "../../utilities/dateFunctions";

interface movieFromTheatreType {
  title: string;
  captioning: boolean;
  year?: string;
  page?: string | undefined;
  times: Array<{ str: string; linkToTickets: string | undefined }>;
  date: string;
  theatre: string;
  duration?: string;
}

interface nowPlayingTableType {
  time: string;
  captioning: boolean;
  soldOut: boolean;
  tickets: string;
  movieTitle: string;
  movieYear: string;
  movieId: number;
  theatreId: number;
}

interface movieTableType {
  title: string;
  year: string;
  imdb?: string;
  rottenTomatoes?: string;
  duration: string;
  trailer?: string;
}

const getLastDayOfTheWeek = (theatre: string) => {
  const today = new Date();
  const lastDay = new Date(today.setDate(today.getDate() + 6));

  const lastDayIFC = lastDay
    .toLocaleDateString("en-us", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
    .replace(",", "");

  switch (theatre) {
    case "IFC":
      return lastDayIFC;
    case "Metrograph":
      return "TODO";
  }
  return lastDayIFC;
};


const upsertMovies = async (movies: movieTableType[]) => {
  // console.log("INSIDE UPSERT");
  const updatedMovies = await prisma.$transaction(
    movies.map((movie) =>
      prisma.movie.upsert({
        where: {
          title_year: {
            title: movie.title,
            year: movie.year,
          },
        },
        update: {
          imdb: movie.imdb,
          rottenTomatoes: movie.rottenTomatoes,
        },
        create: {
          title: movie.title,
          year: movie.year,
          imdb: movie.imdb,
          rottenTomatoes: movie.rottenTomatoes,
          duration: movie.duration,
        },
      })
    )
  );
  // console.log("INSIDE UPSERT", updatedMovies);
  return updatedMovies;
};

const scrapeIFC = async () => {
  // scrape IFC main page for movies playing this week (7 days)
  const htmlNowPlaying = await axios.get("https://www.ifccenter.com/");
  const $moviesIFC = cheerio.load(htmlNowPlaying.data);

  const lastDayIFC = getLastDayOfTheWeek("IFC");
  const lastDayNowPlaying: movieFromTheatreType[] = [];
  const moviesToAdd: movieTableType[] = [];

  const firstSixNowPlaying = $moviesIFC(
    ".showtimes .daily-schedule .details h3"
  )
    .not(".show-coming-soon h3")
    .map(function (i, element): movieFromTheatreType {
      const movieTitle = $moviesIFC(element); // console.log(movieTitle.text());
      const moviePage = movieTitle.children("a").prop("href");
      const movieTimes = movieTitle
        .parent()
        .children(".times")
        .children("li")
        .map(function (i, element) {
          // console.log("TIMES", element);
          return {
            str: $moviesIFC(element).text(),
            linkToTickets: $moviesIFC(element).children("a").prop("href"),
          };
        })
        .get();
      // console.log("IFC movieTimes", movieTimes);
      const movieDate = movieTitle
        .parent()
        .parent()
        .parent()
        .parent()
        .children("h3")
        .first()
        .text(); // console.log(movieDate);

      const captioning = movieTitle.text().includes("(Open Captioning)")
        ? true
        : false;

      // save new movies in seperate array
      if (movieDate === lastDayIFC) {
        lastDayNowPlaying.push({
          title: movieTitle.text().replace(" (Open Captioning)", ""),
          captioning: captioning,
          page: moviePage,
          times: movieTimes,
          date: movieDate,
          theatre: "IFC",
        });
      }

      return {
        title: movieTitle.text().replace(" (Open Captioning)", ""),
        captioning: captioning,
        page: moviePage,
        times: movieTimes,
        date: movieDate,
        theatre: "IFC",
      };
    })
    .get();

  // console.log("lastDayNowPlaying", lastDayNowPlaying);
  // console.log("last day of week", lastDayIFC);

  // scrape IFC specific movie pages for movies on the lastDayOfTheWeek
  // console.log("length", lastDayNowPlaying.length);
  for (let i = 0; i < lastDayNowPlaying.length; i++) {
    // console.log("i", i);
    // TODO: filter out closed caption movies
    if (lastDayNowPlaying[i].page) {
      const htmlMovie = await axios.get(lastDayNowPlaying[i].page);
      const $movieIFC = cheerio.load(htmlMovie?.data);

      const movieRunTime = $movieIFC('strong:contains("Running Time")')[0]?.next
        ?.data;
      // console.log(movieRunTime);
      lastDayNowPlaying[i].duration = movieRunTime;

      let movieYear = $movieIFC('strong:contains("Year")')[0]?.next?.data;
      // console.log("movieYear before", movieYear);
      if (movieYear == undefined) {
        movieYear = new Date().toLocaleDateString("en-us", {
          year: "numeric",
        });
      }
      // console.log("movieYear after", movieYear);
      lastDayNowPlaying[i].year = movieYear;

      // scrape google with title and year
      // const googleInfo = await scrapeGoogle(
      //   lastDayNowPlaying[i].title,
      //   movieYear
      // );
      
      // add to list of movies to be added/updated to Movie table
      moviesToAdd.push({
        title: lastDayNowPlaying[i].title,
        year: movieYear,
        // year: googleInfo.year,
        // imdb: googleInfo.IMDbRating,
        // rottenTomatoes: googleInfo.rottenTomatoesRating,
        duration: movieRunTime,
      });
    }
  }
  // console.log("MOVIES TO ADD", moviesToAdd);
  // PUSH movies to add to db and save id
  const moviesWithID = await upsertMovies(moviesToAdd);

  // PUSH lastDayNowPlaying to db with movie ids from above
  const nowPlayingList: nowPlayingTableType[] = [];
  for (let i = 0; i < lastDayNowPlaying.length; i++) {
    for (let j = 0; j < lastDayNowPlaying[i].times.length; j++) {
      const nowPlaying = {
        time: getMovieDateTime(lastDayIFC, lastDayNowPlaying[i].times[j].str),
        captioning: lastDayNowPlaying[i].captioning,
        // TODO: soldOut functionality for IFC (see below)
        soldOut: false,
        tickets: lastDayNowPlaying[i].times[j].linkToTickets || "",
        movieTitle: lastDayNowPlaying[i].title,
        movieYear: moviesWithID[i].year,
        movieId: moviesWithID[i].id,
        // TODO: ADD FUNCTION THAT RETURNS THEATRE ID
        theatreId: 1,
      };
      nowPlayingList.push(nowPlaying);
    }
  }
  // console.log("NOW PLAYING LIST:", nowPlayingList);
  const createManyNowPlaying = await prisma.nowPlaying.createMany({
    data: nowPlayingList,
    skipDuplicates: true,
  });
  // console.log("CREATE MANY NOW PLAYING", createManyNowPlaying)

  // TODO: Sold out functionality on hold, but to go here 
};

import type { NextApiRequest, NextApiResponse } from "next";

type Data = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // res.status(200).send("hello");
  res.status(200).send(await scrapeIFC());
}

