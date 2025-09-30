import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/fr";

dayjs.extend(localizedFormat);
dayjs.locale("fr");

type DateProps = {
  startDate: string;
  endDate?: string;
  abbrev?: boolean;
  withTime?: boolean;
  withDay?: boolean;
  withYear?: boolean;
};

const formatDate = (
  date: dayjs.Dayjs,
  abbrev: boolean,
  withTime: boolean,
  withDay: boolean,
  withYear: boolean
) =>
  date.format(
    `${withDay ? "dddd " : ""}${abbrev ? `DD/MM${withYear ? "/YY" : ""}` : `DD MMMM${withYear ? " YYYY" : ""}`}${withTime ? " - HH[h]mm" : ""}`
  );

export const DateRangeComponent = ({
  startDate,
  endDate,
  abbrev = false,
  withTime = false,
  withDay = false,
  withYear = true,
}: DateProps) => {
  const start = dayjs(startDate);
  const end = endDate ? dayjs(endDate) : null;

  const renderEndDate = () => {
    if (!end) return null;
    if (!start.isSame(end, "day")) {
      return ` - ${formatDate(end, abbrev, withTime, withDay, withYear)}`;
    }
    if (!start.isSame(end, "hour") && withTime) {
      return `-${end.format("HH[h]mm")}`;
    }

    return null;
  };

  return (
    <span>
      {formatDate(start, abbrev, withTime, withDay, withYear)}
      {renderEndDate()}
    </span>
  );
};
