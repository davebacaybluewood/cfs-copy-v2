export const formatDate = (
  fullDate: Date,
  type: "dashFormat" | "fullFormat"
) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const finalDate =
    type === "dashFormat"
      ? new Date(fullDate).toISOString().slice(0, 10)
      : new Date(fullDate).toLocaleDateString("en-US", options as any);

  return finalDate === "Invalid Date" ? "" : finalDate;
};

export function formatAMPM(date: Date) {
  let hours = date.getHours();
  let minutes = date.getMinutes().toString();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = parseInt(minutes) < 10 ? "0" + minutes : minutes;
  let strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

export const formatISODateToDate = (date: string) => {
  const formattedDate = new Date(date);
  let year = formattedDate.getFullYear();
  let month = (formattedDate.getMonth() + 1).toString();
  let dt = formattedDate.getDate().toString();
  let time;

  if (parseInt(dt) < 10) {
    dt = "0" + dt;
  }
  if (parseInt(month) < 10) {
    month = "0" + month;
  }

  const finalDate =
    formatDate(new Date(year + "-" + month + "-" + dt), "fullFormat") +
    " " +
    formatAMPM(formattedDate);

  return finalDate === "Invalid Date" ? "" : finalDate;
};

//DATE ONLY
export const formatISODateOnly = (date: string) => {
  const formattedDate = new Date(date);
  let year = formattedDate.getFullYear();
  let month = (formattedDate.getMonth() + 1).toString();
  let dt = formattedDate.getDate().toString();

  if (parseInt(dt) < 10) {
    dt = "0" + dt;
  }
  if (parseInt(month) < 10) {
    month = "0" + month;
  }

  const finalDate = formatDate(
    new Date(year + "-" + month + "-" + dt),
    "fullFormat"
  );

  return finalDate === "Invalid Date" ? "" : finalDate;
};
