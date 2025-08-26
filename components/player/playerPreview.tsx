"use client";

import { User } from "@heroui/user";
import { useRouter } from "next/navigation";

import { Player } from "@/lib/interfaces";
import { useUserStore } from "@/store/store";

const leagueAvatarClasses: Record<string, string> = {
  bronze: "bg-bronze border-bronze text-white",
  silver: "bg-silver border-silver",
  gold: "bg-gold border-gold",
  premium: "bg-premium border-premium text-white",
  legend: "bg-legend border-legend text-white",
};

export const PlayerPreviewView = (props: {
  player: Player;
  hideDescription?: boolean;
  avatarSize?: "md" | "sm" | "lg" | "tiny";
  nameFont?: string;
  hideElo?: boolean;
}) => {
  const router = useRouter();
  const { profile } = useUserStore();
  const { player, hideDescription, avatarSize, nameFont, hideElo } = props;
  const prettyNameWithElo = (
    <>
      {player.firstname} {player.lastname}
      {hideElo ? "" : ` (${player.elo})`}
    </>
  );

  return (
    <div className="flex items-center space-x-4">
      <User
        avatarProps={{
          name: `${player.firstname.charAt(0).toUpperCase()}${player.lastname.charAt(0).toUpperCase()}`,
          className: `${leagueAvatarClasses[player.league.badge]} ${avatarSize === "tiny" && "w-6 h-6 text-tiny"}`,
          size: avatarSize && avatarSize !== "tiny" ? avatarSize : "md",
        }}
        className="cursor-pointer"
        description={
          !hideDescription ? <div className="text-gray-600">{player.league.badge}</div> : null
        }
        name={
          <div
            className={`${nameFont || "font-bold"} ${profile && profile.documentId === player.documentId ? "text-blue-800" : "text-gray-800"}`}
          >
            {prettyNameWithElo}
          </div>
        }
        onClick={() => router.push(`/players/${player.documentId}`)}
      />
    </div>
  );
};
