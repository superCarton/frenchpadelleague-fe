import { PlayerList } from "@/components/playersList";
import { getPlayers } from "@/lib/api";

export default async function SearchPlayersPage() {
  const { data: players } = await getPlayers();

  return (
    <div>
      <PlayerList players={players} />
    </div>
  );
}
