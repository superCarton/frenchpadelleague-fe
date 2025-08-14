import { Link } from "@heroui/link";
import { User } from "@heroui/user";

import { Player } from "@/lib/interfaces";

export const PlayerPreviewView = (props: { player: Player }) => {
  const { player } = props;
  const prettyNameWithElo = (
    <>
      {player.firstname} {player.lastname} ({player.elo})
    </>
  );
  const leagueTitle = player.league && player.league.title;

  return (
    <div className="flex items-center space-x-4">
      <User
        avatarProps={{
          name: `${player.firstname.charAt(0).toUpperCase()}${player.lastname.charAt(0).toUpperCase()}`,
        }}
        description={leagueTitle}
        name={
          <Link className="text-black hover:underline" href={`/players/${player.documentId}`}>
            {prettyNameWithElo}
          </Link>
        }
      />
    </div>
  );
};
