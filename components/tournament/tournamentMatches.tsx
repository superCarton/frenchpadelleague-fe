"use client";

import { useEffect, useState } from "react";

import PadelLoader from "../padelLoader";
import MatchComponent from "../matchComponent";

import { Match, Tournament } from "@/lib/interfaces";
import { getMatchesByTournamentId } from "@/lib/api";

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

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (loading) return <PadelLoader />;

  return (
    <section className="space-y-2">
      {matches.map((match) => {
        return <MatchComponent key={match.documentId} match={match} />;
      })}
    </section>
  );
}
