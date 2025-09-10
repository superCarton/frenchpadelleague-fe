"use client";

import { useEffect, useState } from "react";
import { Tab, Tabs } from "@heroui/tabs";

import ErrorComponent from "../errorComponent";
import { SectionLoader } from "../common/sectionLoader";

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

  if (error) return <ErrorComponent error={error} />;
  if (loading) return <SectionLoader label="Chargement des tableaux" />;

  return (
    <section className="space-y-2">
      <Tabs aria-label="Tabs variants" color="primary" variant="solid">
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
