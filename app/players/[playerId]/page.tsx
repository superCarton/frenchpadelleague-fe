import { Image } from "@heroui/image";
import dayjs from "dayjs";

import { getPlayerById } from "@/lib/api";
import { sectionTitle } from "@/components/primitives";

export const revalidate = 120; // ISR
export const dynamic = "force-dynamic"; // prevent pre-render at first build

type PlayerPageProps = {
  params: Promise<{ playerId: string }>;
};

export default async function PlayerPage({ params }: PlayerPageProps) {
  const { playerId } = await params;
  const { data: player } = await getPlayerById(playerId);
  const playerAge = dayjs().diff(dayjs(player.birthdate), "year");

  return (
    <div className="max-w-xl mx-auto px-2 py-6">
      <div className={`flex flex-col item-center justify-center mb-8 bg-${player.league.badge}`}>
        <Image
          alt="Club background"
          className="object-cover"
          height={150}
          src={`/badge-${player.league.badge}.png`}
        />
      </div>
      <div className="flex item-center justify-center">
        <h2 className={sectionTitle()}>
          {player.firstname} {player.lastname}
        </h2>
      </div>
      <div className="space-y-6">
        <section>
          <h3 className={sectionTitle()}>Stats</h3>
          <div>
            <div>Age : {playerAge}</div>
            <div>Elo : {player.elo}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
