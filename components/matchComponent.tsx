import { Card, CardBody } from "@heroui/card";
import clsx from "clsx";

import { MatchDateComponent } from "./matchDateComponent";

import { Match, Team } from "@/lib/interfaces";

export default function MatchComponent({
  match,
  showTournamentSeeds,
}: {
  match: Match;
  showTournamentSeeds?: boolean;
}) {
  const winnerTeamId = match.winner?.id;

  const renderSetScore = (score: number, isWinner: boolean) => (
    <div
      className={clsx(
        "px-2 py-1 min-w-[32px] text-center bg-gray-100 border",
        isWinner ? "text-gray-800 font-semibold border-gray-400" : "text-gray-600 border-gray-200"
      )}
    >
      {score}
    </div>
  );

  const renderScore = () => {
    if (!match.score) return null;

    return (
      <div className="flex flex-row gap-2 text-small">
        {match.score.map((set, index) => {
          const teamAWon = set.teamAScore > set.teamBScore;
          const teamBWon = set.teamBScore > set.teamAScore;

          return (
            <div key={index} className="flex flex-col items-center gap-1">
              {renderSetScore(set.teamAScore, teamAWon)}
              {renderSetScore(set.teamBScore, teamBWon)}
            </div>
          );
        })}
      </div>
    );
  };

  const renderTeam = (team: Team, isWinner: boolean) => (
    <div className={clsx("flex flex-row items-center gap-2", { "font-semibold": isWinner })}>
      {team.playerA.firstname.at(0)}. {team.playerA.lastname}
      <span className="text-gray-400 font-normal">/</span>
      {team.playerB.firstname.at(0)}. {team.playerB.lastname}{" "}
      {showTournamentSeeds && team.seed && (
        <span className="text-tiny text-gray-400 font-normal">({team.seed})</span>
      )}
    </div>
  );

  return (
    <Card className="mx-auto shadow-sm hover:shadow-md transition overflow-hidden border border-gray-200 min-h-[90px] min-w-[350px]">
      <CardBody className="flex flex-row justify-between items-center p-3 px-4 gap-4 text-gray-600 text-small">
        <div className="flex flex-col flex-1 justify-between gap-2">
          <div className="flex items-center min-h-[24px]">
            {match.team_a && renderTeam(match.team_a, winnerTeamId === match.team_a.id)}
          </div>
          <div className="border-t border-gray-200 w-full" />
          <div className="flex items-center min-h-[24px]">
            {match.team_b && renderTeam(match.team_b, winnerTeamId === match.team_b.id)}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-w-[80px]">
          {match.matchStatus === "scheduled" ? (
            match.scheduledDate ? (
              match.scheduledDate ? (
                <MatchDateComponent
                  className="text-gray-500 text-tiny"
                  date={match.scheduledDate}
                />
              ) : null
            ) : null
          ) : (
            renderScore()
          )}
        </div>
      </CardBody>
    </Card>
  );
}
