import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/fr";

dayjs.extend(localizedFormat);
dayjs.locale("fr");

type DateProps = {
  date: string;
  className?: string;
};

export const MatchDateComponent = ({ date, className }: DateProps) => {
  const d = dayjs(date);
  const isToday = dayjs().isSame(d, "day");

  return (
    <div className={`flex flex-col justify-center items-center ${className}`}>
      {!isToday && <div>{d.format("ddd DD/MM")}</div>}
      <div>{d.format("HH[h]mm")}</div>
    </div>
  );
};
