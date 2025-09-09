"use client";

import { useEffect, useState } from "react";
import { CircularProgress } from "@heroui/progress";

import MatchComponent from "../matchComponent";
import ErrorComponent from "../errorComponent";

import { Match, Tournament, TournamentRound } from "@/lib/interfaces";
import { getMatchesByTournamentId } from "@/lib/api";
import { roundNames } from "@/lib/helpers";

export default function TournamentMatches({ tournament }: { tournament: Tournament }) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const fetchMatches = async () => {
      try {
        const { data } = await getMatchesByTournamentId(tournament.id);

        setMatches(data);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des matchs du tournoi");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [tournament.id]);

  if (error) return <ErrorComponent error={error} />;
  if (loading)
    return (
      <div className="w-full flex h-[200px] justify-center items-center">
        <CircularProgress label="Chargement des matchs..." />
      </div>
    );

  const stages: Record<TournamentRound, Match[]> = matches.reduce(
    (acc, m) => {
      acc[m.round] = (acc[m.round] || []).concat(m);
      return acc;
    },
    {} as Record<TournamentRound, Match[]>
  );

  return (
    <section className="space-y-4">
      {Object.entries(stages).map(([round, roundMatches]) => (
        <div key={round} className="space-y-2">
          <div className="text-small text-gray-400 uppercase">
            {roundNames[round as TournamentRound]}
          </div>
          <div className="space-y-2">
            {roundMatches.map((match) => {
              return <MatchComponent key={match.documentId} showTournamentSeeds match={match} />;
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
