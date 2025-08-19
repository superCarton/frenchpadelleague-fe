import { Calendar, ChevronRight, MapPin } from "lucide-react";
import { Divider } from "@heroui/divider";

import { DateComponent } from "./dateComponent";

import { Tournament } from "@/lib/interfaces";

export const TournamentName = ({ tournament }: { tournament: Tournament }) => {
  let date = <DateComponent date={tournament.startDate} withYear={false} />;

  if (tournament.endDate) {
    date = (
      <>
        {date}
        <ChevronRight size={16} />
        <DateComponent date={tournament.endDate} withYear={false} />
      </>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center">FPL Bronze</div>
      <Divider orientation="vertical" />
      <div className="flex items-center">
        <MapPin className="mx-2 hidden sm:flex" />
        {tournament.club.name}
      </div>
      <Divider orientation="vertical" />
      <div className="flex items-center">
        <Calendar className="mx-2 hidden sm:flex" />
        {date}
      </div>
    </div>
  );
};
