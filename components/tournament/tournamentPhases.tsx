"use client";

import { useEffect, useState } from "react";
import { Select, SelectItem } from "@heroui/select";

import PadelLoader from "../padelLoader";
import GameFormatComponent from "../gameFormat";

import TournamentGroups from "./tournamentGroups";

import { Tournament, TournamentPhase } from "@/lib/interfaces";
import { getPhasesByTournamentId } from "@/lib/api";

export default function TournamentPhases({ tournament }: { tournament: Tournament }) {
  const [phases, setPhases] = useState<TournamentPhase[]>([]);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const fetchPhases = async () => {
      try {
        const { data } = await getPhasesByTournamentId(tournament.id);

        setPhases(data);

        // Sélectionne la première phase par défaut
        if (data.length > 0) {
          setSelectedPhase(data[0].id.toString());
        }
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des phases du tournoi");
      } finally {
        setLoading(false);
      }
    };

    fetchPhases();
  }, [tournament.id]);

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (loading) return <PadelLoader />;

  const currentPhase = phases.find((p) => p.id.toString() === selectedPhase);

  return (
    <section className="space-y-2">
      <Select
        label="Sélectionner une phase"
        selectedKeys={selectedPhase ? [selectedPhase] : []}
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0] as string;

          setSelectedPhase(key);
        }}
      >
        {phases.map((phase) => (
          <SelectItem key={phase.id}>{phase.description}</SelectItem>
        ))}
      </Select>

      {currentPhase ? (
        <>
          <p className="text-gray-600">
            Format de jeu : <GameFormatComponent gameFormat={currentPhase.game_format} />
          </p>
          {currentPhase.type === "group-stage" ? (
            <TournamentGroups tournamentPhaseId={currentPhase.id} />
          ) : (
            <div>{JSON.stringify(currentPhase, null, 2)}</div>
          )}
        </>
      ) : (
        <div className="text-gray-500">Aucune phase sélectionnée</div>
      )}
    </section>
  );
}
