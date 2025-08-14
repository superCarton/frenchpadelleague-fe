import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/fr";

dayjs.extend(localizedFormat);
dayjs.locale("fr");

type DateProps = {
  date: string;
  abbrev?: boolean;
  withTime?: boolean;
  withDay?: boolean;
};

export const DateComponent = ({
  date,
  abbrev = false,
  withTime = false,
  withDay = false,
}: DateProps) => {
  const d = dayjs(date);

  return d.format(
    `${withDay ? "dddd " : ""}${abbrev ? "DD/MM/YY" : "DD MMMM YYYY"}${withTime ? " - HH:mm" : ""}`
  );
};
