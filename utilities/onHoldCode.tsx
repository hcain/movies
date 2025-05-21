// Code bits that are on hold that might be useful later down the line

//------------------------------------------------------- 

// Scraping sold out IFC data:

  // PUSH soldOut data of firstSixDaysNowPlaying to db
  // TODO: soldOut functionality for IFC
  //  --> scrape individual time link and look for "Select Ticket Quality"
  // console.log("FIRST SIX NOW PLAYING", firstSixNowPlaying);
//   const allSoldOuts = [];
//   for (let i = 0; i < firstSixNowPlaying.length; i++) {
//     for (let j = 0; j < firstSixNowPlaying[i].times.length; j++) {
//       // check if movie time has already passed
//       if (
//         firstSixNowPlaying[i].times[j].str &&
//         !hasMovieStarted(
//           firstSixNowPlaying[i].date,
//           firstSixNowPlaying[i].times[j].str
//         )
//       ) {
//         const htmlMovie = await axios.get(
//           firstSixNowPlaying[i].times[j].linkToTickets
//         );
//         const $movieIFC = cheerio.load(htmlMovie?.data);
//         // console.log("page data", $movieIFC.html())
//         let soldOut = $movieIFC(
//           '.BigBoldText:contains("Select Ticket Quantity")'
//         )[0]
//         // [0]?.children[0]?.data;
//         // console.log(soldOut);
//         allSoldOuts.push(soldOut);
//       }
//     }
//   }
  // console.log("SOLDOUT", allSoldOuts)
  // return allSoldOuts

//------------------------------------------------------- 

// Scraping Google for movie info:

  // NOT CONSISTENT IF GOOGLE FLAGS MOVIE AS HAVING 'Now Showing' times
  // YEAR - GENRE - DURATION
  // const movieInfo = $('div:contains("Drama/Narrative")')[4]?.children[0].data
  // const movieInfo = $('span:contains("' + movie + '")')[0]?.next?.children[0]?.children[0]?.data.trim().split(" ")
  // const rating = movieInfo[0]
  // const year = movieInfo[2]
  // const genre = movieInfo[4]
  // const duration = movieInfo[6] + " " + movieInfo[7]
  // console.log("MOVIE INFO", movieInfo)
  // console.log("RATING / YEAR / GENRE / DURATION", rating, year, genre, duration)

  // return "success";

//-------------------------------------------------------

// Metrograph scraping code:

// METROGRAPH CODE:
// const scrapeMetrograph = async () => {
//   // using https://allorigins.win/ as  server for production (https://github.com/Rob--W/cors-anywhere/issues/301)
//   // '?nocache=${Date.now()}' at end of url prevents caching
//   const html = await axios.get(
//     "https://api.allorigins.win/get?url=https://metrograph.com/calendar/?nocache=${Date.now()}"
//   );
//   const $ = cheerio.load(html.data);
//   const movieData = $(
//     ".calendar-list-day .item .calendar-list-showtimes .title"
//   ).map(function (i, element): movieType {
//     const movieTitle = $(element);
//     // console.log("METRO TITLE", movieTitle.text());
//     const movieTimes = movieTitle
//       .nextAll()
//       .map(function (i, element) {
//         // console.log("TIMES", element);
//         return {
//           str: $(element).text(),
//           linkToTickets: $(element).prop("outerHTML"),
//         };
//       })
//       .get();
//     console.log("Metro times", movieTimes)
//     const movieDate = movieTitle
//       .parent()
//       .parent()
//       .parent()
//       .parent()
//       .parent()
//       .children(".date")
//       .text();
//     // console.log("metro date", movieDate)
//     return {
//       title: movieTitle.text(),
//       times: movieTimes,
//       date: movieDate,
//       theatre: "Metrograph",
//       neighboorhood: "LES",
//     };
//   })
//   .get();
//   setMetrographMovies(movieData)
//   // console.log("Metrograph", $);
// };
// // scrapeMetrograph();
