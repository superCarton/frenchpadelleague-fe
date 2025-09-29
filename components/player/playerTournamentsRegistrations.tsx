"use client";

import { useEffect, useState } from "react";
import { addToast } from "@heroui/toast";

import { TournamentPreviewView } from "../tournament/tournamentPreview";
import { SectionLoader } from "../common/sectionLoader";
import { DateComponent } from "../common/dateComponent";

import { PlayerPreviewView } from "./playerPreview";

import { getTeamsByPlayerDocId } from "@/lib/api";
import { Team } from "@/lib/interfaces";

type PlayerTournamentsRegistrationsProps = {
  playerDocumentId: string;
};

export default function PlayerTournamentsRegistrations({
  playerDocumentId,
}: PlayerTournamentsRegistrationsProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data } = await getTeamsByPlayerDocId(playerDocumentId);
        setTeams(data);
      } catch (err) {
        addToast({
          title: "Une erreur est survenue lors de la récupération des tournois du joueur",
          color: "danger",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [playerDocumentId]);

  if (loading) {
    return <SectionLoader label="Chargement des tournois" />;
  }

  if (!teams.length) {
    return <div className="text-gray-500 text-sm p-6">Aucune inscription trouvée.</div>;
  }

  return (
    <div className="space-y-4">
      {teams.map((team) => {
        const tournament = team.tournament;
        const partner = team.playerA.documentId === playerDocumentId ? team.playerB : team.playerA;

        return (
          <div key={team.documentId} className="space-y-1">
            <div className="flex flex-row gap-1 items-center text-lg text-gray-600 font-semibold">
              <DateComponent date={team.tournament.startDate} />{" "}
              <span className="text-gray-500 text-sm font-normal">- avec</span>
              <PlayerPreviewView hideDescription hideElo avatarSize="tiny" player={partner} />
            </div>
            <TournamentPreviewView tournament={tournament} />
          </div>
        );
      })}
    </div>
  );
}
