import { PlayerList } from "@/components/player/playersList";
import { pageTitle } from "@/components/primitives";
import { getPlayers } from "@/lib/api";

export const revalidate = 120; // ISR
export const dynamic = "force-dynamic"; // prevent pre-render at first build

export default async function SearchPlayersPage() {
  const { data: players } = await getPlayers();

  return (
    <div className="flex justify-center py-4 sm:py-10 px-2 sm:px-4">
      <div className="w-full sm:w-xl mx-auto">
        <h2 className={pageTitle()}>Tous les joueurs</h2>
        <PlayerList players={players} />
      </div>
    </div>
  );
}
