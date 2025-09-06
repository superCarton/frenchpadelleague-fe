"use client";

import { useEffect, useState } from "react";
import { Tab, Tabs } from "@heroui/tabs";
import { CircularProgress } from "@heroui/progress";

import TournamentGroups from "./tournamentGroups";
import TournamentBracket from "./tournamentBrackets";

import { Match, Tournament } from "@/lib/interfaces";
import { getMatchesByTournamentId } from "@/lib/api";

export default function TournamentPhases({ tournament }: { tournament: Tournament }) {
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
  if (loading)
    return (
      <div className="w-full flex h-[200px] justify-center items-center">
        <CircularProgress label="Chargement des tableaux..." />
      </div>
    );

  return (
    <section className="space-y-2">
      <Tabs aria-label="Tabs variants" variant="bordered">
        <Tab key="groups" title="Poules">
          <TournamentGroups tournamentId={tournament.id} />
        </Tab>
        <Tab key="main" title="Tableau principal">
          <TournamentBracket
            defaultRound="quarter"
            matches={matches}
            rounds={["quarter", "semi", "final"]}
          />
        </Tab>
        <Tab key="ranking" title="Tableaux de classement">
          À faire
        </Tab>
      </Tabs>
    </section>
  );
}
