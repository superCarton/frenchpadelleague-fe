import { Card, CardBody } from "@heroui/card";
import clsx from "clsx";

import { PlayerPreviewView } from "./player/playerPreview";
import { MatchDateComponent } from "./matchDateComponent";

import { Match } from "@/lib/interfaces";

export default function MatchComponent({ match }: { match: Match }) {
  const winnerTeamId = match.winner?.id;

  const renderSetScore = (score: number, isWinner: boolean) => (
    <div
      className={clsx(
        "px-2 py-1 text-sm font-medium min-w-[32px] text-center bg-gray-100 border",
        isWinner ? "text-gray-800 font-semibold border-gray-400" : "text-gray-600 border-gray-200"
      )}
    >
      {score}
    </div>
  );

  const renderScore = () => {
    if (!match.score) return null;

    return (
      <div className="flex flex-row gap-2">
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

  const renderTeam = (team: Match["team_a"], isWinner: boolean) => (
    <div className="flex flex-col gap-1">
      {[team.playerA, team.playerB].map((player, i) => (
        <PlayerPreviewView
          key={i}
          hideDescription
          hideElo
          shortName
          avatarSize="tiny"
          nameFont={isWinner ? "text-gray-800 font-semibold" : "text-gray-600 border-gray-200"}
          player={player}
        />
      ))}
    </div>
  );

  return (
    <Card className="mx-auto shadow-sm hover:shadow-md transition overflow-hidden border border-gray-200 min-h-[145px]">
      <CardBody className="flex flex-row justify-between items-center p-3 px-4">
        <div className="flex flex-col flex-1 justify-between gap-4">
          {renderTeam(match.team_a, winnerTeamId === match.team_a.id)}
          {renderTeam(match.team_b, winnerTeamId === match.team_b.id)}
        </div>

        <div className="flex flex-col items-center justify-center min-w-[100px]">
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
