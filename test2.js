const momment = require("moment");

function validateTimeDiff(start, end) {
  const startTime = momment(start, "HH:mm");
  const endTime = momment(end, "HH:mm");

  console.log(startTime.isBefore(endTime));
}

validateTimeDiff("12:00", "9:00"); // false
validateTimeDiff("9:00", "12:00"); // true

validateTimeDiff("8:00", "10.00"); // true
validateTimeDiff("10.00", "8.00"); // false

validateTimeDiff("2.30", "2.00"); // false
validateTimeDiff("4.30", "4.45"); // true
