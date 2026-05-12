export const parseDate = (date) => {
  const dateSimple = date.split("T")[0];
  const [y, m, d] = dateSimple.split("-");

  return `${d.padStart(2, "0")}/${m.padStart(2, "0")}/${y}`;
};

export const parseDateHours = (dateStr, isBad = false) => {
  const date = new Date(dateStr);
  if (isBad) {
    date.setHours(date.getHours() + 5);
  }
  const time = date.toLocaleTimeString("es", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return time;
};

export const getFormattedDate = (date) => {
  date.setHours(date.getHours() - 5);
  return date.toISOString().split("T")[0];
};

export const getSevenDayAgo = () => {
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  return sevenDaysAgo;
};

export const getNextSevenDay = (date) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + 7);
  const toIso = nextDate.toISOString();

  return `${parseDate(toIso)} ${parseDateHours(toIso)}`;
};

export const isPassedSeveDays = (date) => {
  const givenDate = new Date(date.split("T")[0]);
  const today = new Date(new Date().toISOString().split("T")[0]);

  const differenceInMs = today.getTime() - givenDate.getTime();

  const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);
  return differenceInDays >= 7;
};
