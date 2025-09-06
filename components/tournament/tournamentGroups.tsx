"use client";

import { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { CircularProgress } from "@heroui/progress";

import { PlayerPreviewView } from "../player/playerPreview";

import { getGroupsByTournamentId } from "@/lib/api";
import { TournamentGroup } from "@/lib/interfaces";

type TournamentGroupsProps = {
  tournamentId: number;
};

export default function TournamentGroups(props: TournamentGroupsProps) {
  const { tournamentId } = props;
  const [groups, setGroups] = useState<TournamentGroup[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const fetchPhases = async () => {
      try {
        const { data } = await getGroupsByTournamentId(tournamentId);

        setGroups(data);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des poules");
      } finally {
        setLoading(false);
      }
    };

    fetchPhases();
  }, [tournamentId]);

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (loading)
    return (
      <div className="w-full flex h-[200px] justify-center items-center">
        <CircularProgress label="Chargement des poules..." />
      </div>
    );

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
                <TableColumn className="border border-gray-300 text-center w-[60px]">J</TableColumn>
                <TableColumn className="border border-gray-300 text-center w-[60px]">G</TableColumn>
                <TableColumn className="border border-gray-300 text-center w-[60px]">P</TableColumn>
                <TableColumn className="border border-gray-300 text-center w-[60px]">
                  +/-
                </TableColumn>
              </TableHeader>
              <TableBody>
                {sortedTeams.map((team, index) => (
                  <TableRow
                    key={team.id}
                    className={`divide-x divide-gray-300 ${
                      index === 0 ? "bg-gray-200 font-semibold" : ""
                    }`}
                  >
                    <TableCell className="border border-gray-300 flex flex-row gap-2 items-center">
                      <PlayerPreviewView
                        hideDescription
                        hideElo
                        shortName
                        avatarSize="tiny"
                        nameFont="font-normal"
                        player={team.playerA}
                      />
                      <span className="text-gray-400">/</span>
                      <PlayerPreviewView
                        hideDescription
                        hideElo
                        shortName
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
