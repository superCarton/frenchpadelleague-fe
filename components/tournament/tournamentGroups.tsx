"use client";

import { useEffect, useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/table";
import { CircularProgress } from "@heroui/progress";

import { getGroupsByTournamentId } from "@/lib/api";
import { TournamentGroupWithStats } from "@/lib/interfaces";

type TournamentGroupsProps = {
  tournamentId: number;
};

export default function TournamentGroups(props: TournamentGroupsProps) {
  const { tournamentId } = props;
  const [groups, setGroups] = useState<TournamentGroupWithStats[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const fetchTournamentGroups = async () => {
      try {
        const data = await getGroupsByTournamentId(tournamentId);
        setGroups(data || []);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des poules");
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentGroups();
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
        return (
          <div key={group.documentId}>
            <div className="text-small text-gray-400 uppercase">{group.name}</div>
            <Table removeWrapper>
              <TableHeader className="bg-gray-100">
                <TableColumn className="border border-gray-300">ÉQUIPE</TableColumn>
                <TableColumn className="border border-gray-300 text-center w-[50px]">J</TableColumn>
                <TableColumn className="border border-gray-300 text-center w-[50px]">G</TableColumn>
                <TableColumn className="border border-gray-300 text-center w-[50px]">P</TableColumn>
                <TableColumn className="border border-gray-300 text-center w-[50px]">
                  JP
                </TableColumn>
                <TableColumn className="border border-gray-300 text-center w-[50px]">
                  JC
                </TableColumn>
                <TableColumn className="border border-gray-300 text-center w-[50px]">
                  +/-
                </TableColumn>
              </TableHeader>
              <TableBody>
                {group.stats
                  .sort((statA, statB) => (statA.team.seed || 0) - (statB.team.seed || 0))
                  .map((stat) => (
                    <TableRow key={stat.team.id} className={`divide-x divide-gray-300`}>
                      <TableCell className="border border-gray-300 flex flex-col gap-1 items-start">
                        <div className="truncate">
                          {stat.team.playerA.firstname.at(0)}. {stat.team.playerA.lastname}
                        </div>
                        <div className="truncate">
                          {stat.team.playerB.firstname.at(0)}. {stat.team.playerB.lastname}{" "}
                          {stat.team.seed && (
                            <span className="text-tiny text-gray-400">({stat.team.seed})</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="border border-gray-300 text-center">
                        {stat.played}
                      </TableCell>
                      <TableCell className="border border-gray-300 text-center">
                        {stat.won}
                      </TableCell>
                      <TableCell className="border border-gray-300 text-center">
                        {stat.lost}
                      </TableCell>
                      <TableCell className="border border-gray-300 text-center">
                        {stat.gamesFor}
                      </TableCell>
                      <TableCell className="border border-gray-300 text-center">
                        {stat.gamesAgainst}
                      </TableCell>
                      <TableCell className="border border-gray-300 text-center">
                        {stat.gamesDiff}
                      </TableCell>
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
