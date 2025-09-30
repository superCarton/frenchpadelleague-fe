"use client";

import { User } from "@heroui/user";
import { useRouter } from "next/navigation";

import { Player } from "@/lib/interfaces";
import { useUserStore } from "@/store/store";
import { getPlayerPictureUrl } from "@/lib/helpers";

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
  shortName?: boolean;
}) => {
  const router = useRouter();
  const { profile } = useUserStore();
  const { player, hideDescription, avatarSize, nameFont, hideElo, shortName } = props;
  const prettyNameWithElo = (
    <>
      {shortName ? `${player.firstname.at(0)}.` : player.firstname} {player.lastname}
      {hideElo ? "" : <span className="font-normal text-gray-400"> ({player.elo.current})</span>}
    </>
  );

  return (
    <User
      avatarProps={{
        name: `${player.firstname.charAt(0).toUpperCase()}${player.lastname.charAt(0).toUpperCase()}`,
        className: `${leagueAvatarClasses[player.league.badge]} ${avatarSize === "tiny" && "w-6 h-6 text-tiny"} border-${avatarSize === "tiny" ? 1 : 2} border-${player.league.badge}`,
        size: avatarSize && avatarSize !== "tiny" ? avatarSize : "md",
        src: getPlayerPictureUrl(player),
      }}
      className={`cursor-pointer ${avatarSize === "tiny" && "!gap-1"}`}
      description={
        !hideDescription ? <div className="text-gray-400">{player.league.badge}</div> : null
      }
      name={
        <div
          className={`${nameFont || "font-bold"} ${profile && profile.documentId === player.documentId ? "text-blue-800" : "text-gray-600"}`}
        >
          {prettyNameWithElo}
        </div>
      }
      onClick={() => router.push(`/players/${player.documentId}`)}
    />
  );
};
