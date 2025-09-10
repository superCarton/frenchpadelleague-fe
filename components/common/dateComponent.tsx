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
  withYear?: boolean;
};

export const DateComponent = ({
  date,
  abbrev = false,
  withTime = false,
  withDay = false,
  withYear = true,
}: DateProps) => {
  const d = dayjs(date);

  return (
    <span>
      {d.format(
        `${withDay ? "dddd " : ""}${abbrev ? `DD/MM${withYear ? "/YY" : ""}` : `DD MMMM${withYear ? " YYYY" : ""}`}${withTime ? " - HH[h]mm" : ""}`
      )}
    </span>
  );
};
