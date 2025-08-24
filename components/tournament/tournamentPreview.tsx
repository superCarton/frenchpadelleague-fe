"use client";

import { Image } from "@heroui/image";
import { useRouter } from "next/navigation";
import { Calendar, MapPin } from "lucide-react";

import { DateRangeComponent } from "../dateRangeComponent";

import TournamentStatusBadge from "./tournamentStatusBadge";

import { Tournament } from "@/lib/interfaces";

const leagueGradients: Record<string, string> = {
  bronze: "from-bronze to-bronze-light",
  silver: "from-silver to-silver-light",
  gold: "from-gold to-gold-light",
  premium: "from-premium to-premium-light",
  legend: "from-legend to-legend-light",
};

export const TournamentPreviewView = (props: { tournament: Tournament }) => {
  const { tournament } = props;
  const router = useRouter();

  return (
    <div
      className="mx-auto rounded-sm shadow-sm hover:shadow-md transition overflow-hidden border border-gray-200 cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/tournaments/${tournament.documentId}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(`/tournaments/${tournament.documentId}`);
      }}
    >
      <div
        className={`bg-gradient-to-r px-2 py-2 sm:px-6 sm:py-3 ${leagueGradients[tournament.league.badge]}`}
      >
        <h3 className="text-white font-bold text-lg uppercase tracking-wide">
          FPL {tournament.league.title}
        </h3>
      </div>

      <div className="p-3 sm:p-6 flex items-start gap-4 bg-white">
        <Image
          alt="Club logo"
          className="w-16 h-16 rounded-full border-2 border-gray-200 object-cover"
          src={tournament.club.logo.url}
        />

        <div className="flex flex-col justify-center">
          <h4 className="font-semibold text-gray-900 text-lg flex gap-2 flex-col sm:flex-row">
            <div>{tournament.club.name}</div>
            <TournamentStatusBadge status={tournament.currentStatus} />
          </h4>
          <div className="mt-2 flex flex-col gap-1 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="text-gray-500" size={16} />
              <span>{tournament.club.address.city}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="text-gray-500" size={16} />
              <DateRangeComponent endDate={tournament.endDate} startDate={tournament.startDate} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
