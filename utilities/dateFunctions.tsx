import { last } from "cheerio/lib/api/traversing";

const { DateTime } = require("luxon");

// original from https://stackoverflow.com/a/28327336
// TOD0: get rid of format argument
// function ConvertTwelveToMiltaryTime(format, str) {
//   // console.log("CONVERT TO MILITARY TIME", str)
//   var hours = Number(str.match(/^(\d+)/)[1]);
//   var minutes = Number(str.match(/:(\d+)/)[1]);
//   var AMPM = str.match(/([AaPp])\w+/)[1];
//   // console.log("AMPM STRING", AMPM)
//   var pm = ["P", "p", "PM", "pM", "pm", "Pm"];
//   var am = ["A", "a", "AM", "aM", "am", "Am"];
//   if (pm.indexOf(AMPM) >= 0 && hours < 12) hours = hours + 12;
//   if (am.indexOf(AMPM) >= 0 && hours == 12) hours = hours - 12;
//   var sHours = hours.toString();
//   var sMinutes = minutes.toString();
//   if (hours < 10) sHours = "0" + sHours;
//   if (minutes < 10) sMinutes = "0" + sMinutes;
//   if (format == "0000") {
//     return sHours + sMinutes;
//   } else if (format == "00:00") {
//     return sHours + ":" + sMinutes + ":00";
//   } else {
//     // TODO: throw error instead
//     return false;
//   }
// }
// function ConvertTimeStringToDate(time: string | false) {
//   // console.log("CONVERT TO DATE", time)
//   if (time === false) {
//     return false;
//   }
//   const today = new Date()
//     .toLocaleDateString("en-us", {
//       day: "numeric",
//       month: "short",
//       year: "numeric",
//     })
//     .replace(",", "");
//   return Date.parse(today + " " + time);
// }

export function getMovieDateTime(day: string, timeStr: string) {
const withoutDay = day.split(" ").slice(1).join(" ")
return DateTime.fromFormat(withoutDay + " " + timeStr.trim(), "MMM d h:mm a").toISO()

}

export function validMovieTime(time: string) {
  const militaryTime = ConvertTwelveToMiltaryTime("00:00", time);
  const dateTime = ConvertTimeStringToDate(militaryTime);
  if (dateTime === false) {
    console.log("ERROR!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  } else if (dateTime > Date.now()) {
    return true;
  } else {
    return false;
  }
}
