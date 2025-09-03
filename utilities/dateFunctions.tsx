const { DateTime } = require("luxon");

export function getMovieDateTime(day: string, timeStr: string) {
    const withoutDay = day.split(" ").slice(1).join(" ");
    // console.log("COMPARE TIMES", timeStr, DateTime.fromFormat(
    //   withoutDay + " " + timeStr.trim(),
    //   "MMM d h:mm a"
    // ).toISO())
    return DateTime.fromFormat(withoutDay + " " + timeStr.trim(), "MMM d h:mm a").toISO();
}

export function hasMovieStarted(day: string, movieTime: string) {
    const movieDateTime = getMovieDateTime(day, movieTime);
    // returns true if movie time is earlier than now
    return DateTime.fromISO(movieDateTime) < DateTime.now();
}

function convertISOStringToDate(time: string) {
    // console.log("CONVERT TO DATE", time)

    // returns date without time
    return new Date(time).toLocaleDateString("en-us", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    // TODO: not sure why I originally wrote the following code
    // const today = new Date()
    //   .toLocaleDateString("en-us", {
    //     day: "numeric",
    //     month: "short",
    //     year: "numeric",
    //   })
    //   .replace(",", "");
    // return Date.parse(today + " " + time);
}

export function convertISOStringToTime(time: string) {
    return new Date(time).toLocaleTimeString("en-us", {
        timeStyle: 'short',
    });
}

export function validMovieTime(time: string) {
    // const militaryTime = ConvertTwelveToMiltaryTime("00:00", time);
    // console.log("PARSE", Date.parse(time))
    const movieTime = Date.parse(time);
    // console.log("MovieTIME", movieTime);
    if (movieTime > Date.now()) {
        return true;
    } else {
        return false;
    }
}
