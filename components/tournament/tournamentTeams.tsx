"use client";

import { useEffect, useState } from "react";
import { Card } from "@heroui/card";

import { PlayerPreviewView } from "../player/playerPreview";
import ErrorComponent from "../errorComponent";
import { SectionLoader } from "../common/sectionLoader";

import { Team, Tournament } from "@/lib/interfaces";
import { getTeamsByTournamentId } from "@/lib/api";

export default function TournamentTeams({ tournament }: { tournament: Tournament }) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const fetchTeams = async () => {
      try {
        const { data } = await getTeamsByTournamentId(tournament.id);

        setTeams(data);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des équipes du tournoi");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [tournament.id]);

  if (error) return <ErrorComponent error={error} />;
  if (loading) return <SectionLoader label="Chargement des équipes inscrites" />;

  return (
    <section>
      <div className="grid grid-cols-[6fr_3fr_3fr] font-bold text-sm text-gray-600 border-b pb-2 mb-4">
        <div>Joueurs</div>
        <div className="text-center">TS</div>
        <div className="text-center">Elo équipe</div>
      </div>

      <div className="flex flex-col gap-2">
        {teams.length === 0 && (
          <div className="text-gray-500 text-sm">Aucunes équipes inscrites</div>
        )}
        {teams
          .sort((a, b) => {
            return (
              b.playerA.playerStat.elo +
              b.playerB.playerStat.elo -
              (a.playerA.playerStat.elo + a.playerB.playerStat.elo)
            );
          })
          .map((team, index) => (
            <Card
              key={team.playerA.documentId}
              className="grid grid-cols-[6fr_3fr_3fr] items-center px-4 py-2 shadow-sm hover:shadow-md transition"
            >
              <div className="space-y-1">
                <PlayerPreviewView avatarSize="tiny" nameFont="font-normal" player={team.playerA} />
                <PlayerPreviewView avatarSize="tiny" nameFont="font-normal" player={team.playerB} />
              </div>

              <div className="text-center text-gray-500">{index + 1}</div>
              <div className="text-center text-gray-500">
                {Math.ceil((team.playerA.playerStat.elo + team.playerB.playerStat.elo) / 2)}
              </div>
            </Card>
          ))}
      </div>
    </section>
  );
}
