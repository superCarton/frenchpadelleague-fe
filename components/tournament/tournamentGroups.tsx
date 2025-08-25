"use client";

import { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";

import PadelLoader from "../padelLoader";
import { PlayerPreviewView } from "../player/playerPreview";

import { getGroupsByTournamentPhaseId } from "@/lib/api";
import { TournamentGroup } from "@/lib/interfaces";

type TournamentGroupsProps = {
  tournamentPhaseId: number;
};

export default function TournamentGroups(props: TournamentGroupsProps) {
  const { tournamentPhaseId } = props;
  const [groups, setGroups] = useState<TournamentGroup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const fetchPhases = async () => {
      try {
        const { data } = await getGroupsByTournamentPhaseId(tournamentPhaseId);

        setGroups(data);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des poules");
      } finally {
        setLoading(false);
      }
    };

    fetchPhases();
  }, [tournamentPhaseId]);

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (loading) return <PadelLoader />;

  return (
    <>
      {groups.map((group) => {
        const sortedTeams = group.teams
          .map((team) => ({
            ...team,
            eloTotal: team.playerA.elo + team.playerB.elo,
          }))
          .sort((a, b) => b.eloTotal - a.eloTotal);

        return (
          <div key={group.documentId}>
            <div>{group.name}</div>
            <Table removeWrapper>
              <TableHeader className="bg-gray-100">
                <TableColumn className="border border-gray-300">ÉQUIPE</TableColumn>
                <TableColumn className="border border-gray-300 text-center">J</TableColumn>
                <TableColumn className="border border-gray-300 text-center">G</TableColumn>
                <TableColumn className="border border-gray-300 text-center">P</TableColumn>
                <TableColumn className="border border-gray-300 text-center">+/-</TableColumn>
              </TableHeader>
              <TableBody>
                {sortedTeams.map((team, index) => (
                  <TableRow
                    key={team.id}
                    className={`divide-x divide-gray-300 ${
                      index === 0 ? "bg-gray-200 font-semibold" : ""
                    }`}
                  >
                    <TableCell className="border border-gray-300 space-y-1 py-1 px-2 sm:py-2 sm:px-3">
                      <PlayerPreviewView
                        hideDescription
                        avatarSize="tiny"
                        nameFont="font-normal"
                        player={team.playerA}
                      />
                      <PlayerPreviewView
                        hideDescription
                        avatarSize="tiny"
                        nameFont="font-normal"
                        player={team.playerB}
                      />
                    </TableCell>
                    <TableCell className="border border-gray-300 text-center">0</TableCell>
                    <TableCell className="border border-gray-300 text-center">0</TableCell>
                    <TableCell className="border border-gray-300 text-center">0</TableCell>
                    <TableCell className="border border-gray-300 text-center">0</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        );
      })}
    </>
  );
}
