export function formatDate(sValue) {
  const sYear = sValue.slice(0, 4);
  const sMonth = sValue.slice(5, 7);
  const sDate = sValue.slice(8, 10);

  return sDate + "-" + sMonth + "-" + sYear;
}

export function formatTime(sValue) {
  // console.log(sValue);
  // const sHou = sValue.slice(0, 2);
  // const sMin = sValue.slice(3, 5);
  // const sSec = sValue.slice(7, 9);

  // return sHou + ":" + sMin + ":" + sSec;

  const date = new Date(sValue);

  const sHou = date.getHours();
  const sMin = date.getMinutes();
  const sSec = date.getSeconds();

  const period = sHou >= 12 ? "PM" : "AM";

  return (
    sHou.toString().padStart(2, "0") +
    ":" +
    sMin.toString().padStart(2, "0") +
    ":" +
    sSec.toString().padStart(2, "0") +
    " " +
    period
  );
}
