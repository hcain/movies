
// scrape for movie ratings
// const scrapeGoogle = async (movie: string, year: string) => {
//     // "https://www.google.com/search?q=" +
//     // "https://search.brave.com/search?q=" +
//     // "https://duckduckgo.com/?q=" +
//     // Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:137.0) Gecko/20100101 Firefox/137.0
//   const html = await axios.get(
//     "https://search.brave.com/search?q=" +
//     movie.trim().replace(/\s/g, '+') + "+" +
//     year.trim() +
//       "+movie", 
//       // { headers: { 'User-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:137.0) Gecko/20100101 Firefox/137.0', 'Cookie' : 'https://search.brave.com/search?q=How+to+Get+Ahead+in+Advertising+1989+movie&source=web&summary=1&conversation=b6cdf6bb4fb8beb4fc5f39' } }
//   );
//   // console.log( "https://www.google.com/search?q=" +
//   //   movie +
//   //   "+" +
//   //   year +
//   //   "+movie")
//   console.log(  "https://search.brave.com/search?q=" +
//     movie.trim().replace(/\s/g, '+') + "+" +
//     year.trim() +
//     "+movie")
//     const $ = cheerio.load(html.data);
// // console.log($.html())

//   // ROTTEN TOMATOES
//   // const rottenTomatoesRating = $('span[title="Rotten Tomatoes"]')[0]
//   // const rottenTomatoesRating = $('span:contains("Rotten Tomatoes")')[0]?.prev?.data.trim().split(" ")[0];
//   const rottenTomatoesRating = $('span:contains("Rotten Tomatoes")')[0]?.parent?.prev?.data.trim();
//   console.log('ROTTEN TOMATOES', movie, rottenTomatoesRating)

//   // if (rottenTomatoesRating) {console.log($.html())}

//   // IMDB
//   // const IMDbRating = $('span[title="IMDb"]')[0]
//   const IMDbRating = $('span:contains("IMDb")').text()
//   // [0]?.prev
//   // ?.data.trim().split(" ")[0];
//   console.log("IMDB", IMDbRating)

//   // const currentYear = new Date().getFullYear();
//   // //if undefined and current year, try earlier year
//   // if (
//   //   rottenTomatoesRating === undefined &&
//   //   IMDbRating === undefined &&
//   //   year === currentYear.toString()
//   // ) {
//   //   // console.log(
//   //   //   "INSIDE 2024 didnt work",
//   //   //   rottenTomatoesRating,
//   //   //   IMDbRating,
//   //   //   year
//   //   // );
//   //   return scrapeGoogle(movie, (currentYear - 1).toString());
//   // }


//   return { rottenTomatoesRating, IMDbRating, year };
// };