import { PlayerList } from "@/components/playersList";
import { getPlayers } from "@/lib/api";

export const revalidate = 120; // ISR
export const dynamic = "force-dynamic"; // prevent pre-render at first build

export default async function SearchPlayersPage() {
  const { data: players } = await getPlayers();

  return (
    <div>
      <PlayerList players={players} />
    </div>
  );
}
