"use client";

import { User } from "@heroui/user";
import { useRouter } from "next/navigation";

import { Player } from "@/lib/interfaces";

export const PlayerPreviewView = (props: { player: Player }) => {
  const router = useRouter();
  const { player } = props;
  const prettyNameWithElo = (
    <>
      {player.firstname} {player.lastname} ({player.elo})
    </>
  );

  return (
    <div className="flex items-center space-x-4">
      <User
        avatarProps={{
          name: `${player.firstname.charAt(0).toUpperCase()}${player.lastname.charAt(0).toUpperCase()}`,
          className: `border-2 border-${player.league?.badge}`,
        }}
        className="cursor-pointer"
        description={<div className="text-gray-600">{player.league.badge}</div>}
        name={<div className="font-bold text-gray-900">{prettyNameWithElo}</div>}
        onClick={() => router.push(`/players/${player.documentId}`)}
      />
    </div>
  );
};
