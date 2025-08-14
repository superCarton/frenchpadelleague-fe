import { PlayerPreviewView } from "@/components/playerPreview";
import { getPlayerById } from "@/lib/api";

type PlayerPageProps = {
  params: Promise<{ playerId: string }>;
};

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { playerId } = await params;
  const { data: player } = await getPlayerById(playerId);

  return (
    <div>
      <PlayerPreviewView player={player} />
    </div>
  );
}
