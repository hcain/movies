// NEXT STEPS:
  // X add in ticket link
  // X then column sorting
  // X remove column sorting for time, theatre, neighborhood
  // X add sorting indicators for movie column
  // X remove/color times that have already passed
  // X add dropdown selection for time, theatre, neighborhood

  // H ON HOLD add Metrograph 
  // X  -> set up scrape
  // X  -> parse scrape
  // _  -> move scrapings function to new file
  // X  -> add movie data to state
  // X  -> format times
  // X  -> add to table
  // X  -> check filtering functionality

  // _ set up hosted PostgreSQL DB
  // X  -> new project on Supabase
  // X  -> add prisma for schema and access 
  // X  -> add Supabase credentials
  // X  -> write schema
  // X  -> push to Supabase
  // X  -> redo how times are saved
  // X  -> set up nowPlaying last day to push
  // X  -> POSSIBLE BUG WHEN SAVING/CONVERTING TIME OF MOVIE (just converting to GMT from EST, looks correct though)
  // H  -> ON HOLD (ticket page blocked, need proxy and more research): push soldOut data to nowPlaying (IFC scrape individual time link and search for "Select Ticket Quality")
  // H  -> connection pooling?  
  // _  -> have index.js call db
  // _  -> compare times to see if movie has passed

  // _ set up cron job for 12-hourly scrape
  // X  -> move scrape functions to api point
  // _  -> connect data to hosted db
  // _  -> deploy to vercel
  // _  -> setup github actions
  // _  -> setup Encrypted Secrets 
  // X  -> write cron job

  // _ add additional dates by button outside of table (think "more" of search results)
  // _ then add column for IMDB, Rotten Tomatoes, Wiki
  // _ then more movie theatres

  // CLEAN UP TODOs:
  // _ convert table.tsx to proper typescript
  // _ convert dateFunctions.tsx to proper typescript
  // _ refactor dateFunctions function (and then validMovieTime) to remove format, and throw error if goes wrong
  // _ fix alignment of sorting indicators
  // _ add sold out indicator for times
  // _ update parsing functions to just grab href using .prop('href') instead of using the whole a tag
  // _ make am/pm format of movie times uniform across theatres
  // _ convert prisma files to typescript 
  // _ look up proper typescript for recursion (scrapeGoogle function)