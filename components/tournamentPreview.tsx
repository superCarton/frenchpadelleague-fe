"use client";

import { Image } from "@heroui/image";
import { useRouter } from "next/navigation";
import { Calendar, MapPin } from "lucide-react";

import TournamentStatusBadge from "./tournamentStatusBadge";
import { DateRangeComponent } from "./dateRangeComponent";

import { Tournament } from "@/lib/interfaces";

export const TournamentPreviewView = (props: { tournament: Tournament }) => {
  const { tournament } = props;
  const router = useRouter();

  return (
    <div
      className="mx-auto rounded-sm shadow-lg overflow-hidden border border-gray-200 cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/tournaments/${tournament.documentId}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(`/tournaments/${tournament.documentId}`);
      }}
    >
      <div className="bg-gradient-to-r from-bronze to-bronze-light px-6 py-3">
        <h3 className="text-white font-bold text-lg uppercase tracking-wide">FPL Ligue Bronze</h3>
      </div>

      <div className="p-6 flex items-start gap-4 bg-white">
        <Image
          alt="Club logo"
          className="w-16 h-16 rounded-full border-2 border-gray-200 object-cover"
          src="/clubs/logo-acacias.png"
        />

        <div className="flex flex-col justify-center">
          <h4 className="font-semibold text-gray-900 text-lg flex gap-2 flex-col sm:flex-row">
            <div>{tournament.club.name}</div>
            <TournamentStatusBadge status={tournament.currentStatus} />
          </h4>
          <div className="mt-2 flex flex-col gap-1 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="text-gray-500" size={16} />
              <span>Toulouse, France</span>
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
