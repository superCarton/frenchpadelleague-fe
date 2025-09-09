"use client";

import { Image } from "@heroui/image";
import dayjs from "dayjs";
import { Avatar } from "@heroui/avatar";
import clsx from "clsx";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { CircularProgress } from "@heroui/progress";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@heroui/button";

import { getPlayerByDocId } from "@/lib/api";
import { pageTitle, sectionTitle } from "@/components/primitives";
import EloHistoryChart from "@/components/player/eloHistoryChart";
import { Player } from "@/lib/interfaces";
import { useUserStore } from "@/store/store";
import ErrorComponent from "@/components/errorComponent";
import { DateComponent } from "@/components/dateComponent";

export default function PlayerPage() {
  const { playerDocId } = useParams<{ playerDocId: string }>();
  const { profile } = useUserStore();

  const [player, setPlayer] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const fetchPlayer = async () => {
      try {
        const { data } = await getPlayerByDocId(playerDocId);

        setPlayer(data);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement du tournoi");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [playerDocId]);

  if (error) return <ErrorComponent error={error} />;
  if (loading)
    return (
      <div className="w-full flex h-[200px] justify-center items-center">
        <CircularProgress label="Chargement du profil..." />
      </div>
    );
  if (!player) return <div className="p-6">Joueur introuvable</div>;

  const isPlayerConnected = profile && profile.documentId === player.documentId;

  const playerAge = dayjs().diff(dayjs(player.birthdate), "year");
  // --- Niveau / progression ---
  const min = player.league.minElo ?? 0;
  const max = player.league.maxElo ?? 1;
  const elo = player.elo ?? min;
  const percent = Math.round(
    Math.max(0, Math.min(100, ((elo - min) / Math.max(1, max - min)) * 100))
  );
  const toNext = Math.max(0, max - elo);

  console.log(player);
  return (
    <div className="max-w-xl mx-auto px-2 py-6 text-sm">
      {/* Cover + avatar */}
      <div className="flex flex-col item-center justify-center mb-8">
        <Image
          alt="Club background"
          className="object-cover"
          src={`/cover-player-${player.gender}.png`}
        />
        <div className="relative top-6">
          <Avatar
            isBordered
            className="z-10 justify-center absolute left-1/2 -translate-x-1/2 -bottom-0"
            color="secondary"
            name={`${player.firstname.charAt(0).toUpperCase()}${player.lastname.charAt(0).toUpperCase()}`}
            size="lg"
          />
        </div>
      </div>

      {/* Nom + infos rapides */}
      <div className="w-full flex flex-col items-center justify-center space-y-2">
        <h2 className={clsx(pageTitle(), " !mb-2")}>
          {player.firstname} {player.lastname}
        </h2>
        {/* {isPlayerConnected && ( */}
        <Button className="w-sm" color="secondary">
          Modifier mon profil
        </Button>
        {/* )} */}
        <div className="flex flex-col items-center text-sm text-gray-500 gap-1 mb-8">
          <div>
            Membre depuis le <DateComponent withYear date={player.publishedAt} />
          </div>
          <div>
            <span>{playerAge} ans</span>
          </div>
          <div className="space-x-1">
            Forme :{" "}
            {[true, true, false, true, true].map((win, i) => (
              <Chip key={i} color={win ? "success" : "danger"} radius="sm" variant="flat">
                {win ? "V" : "D"}
              </Chip>
            ))}
          </div>
          <div>68% de victoires</div>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h3 className={sectionTitle()}>Niveau</h3>

          <div className="flex flex-row items-center justify-center gap-10">
            {/* Badge + Elo */}
            <div className="flex flex-col items-center gap-4">
              <Image
                alt={`Badge ${player.league.title}`}
                className="object-contain w-24 h-24"
                height={120}
                radius="none"
                src={player.league.badgeImage.url}
              />
              <div className="text-gray-500 text-sm">{player.league.title}</div>
              <div className="flex items-end justify-center gap-1 text-2xl font-bold text-gray-900">
                {player.elo}
                <span className="text-sm text-gray-500 font-medium">Elo</span>
              </div>
              <div>Meilleur Elo 725</div>
            </div>

            {/* Progression circulaire */}
            <div className="flex flex-col items-center justify-center gap-4">
              <Tooltip
                content={`${elo} Elo • ${percent}% de la ${player.league.title}`}
                placement="bottom"
              >
                <CircularProgress
                  showValueLabel
                  aria-label="Progression dans la ligue"
                  classNames={{
                    svg: "w-24 h-24",
                    indicator: "text-green-500",
                    track: "text-gray-200",
                    value: "text-base font-semibold text-gray-800",
                  }}
                  value={percent}
                />
              </Tooltip>
              <div className="text-xs text-gray-500 text-center">
                {toNext > 0
                  ? `Encore ${toNext} Elo avant la ligue supérieure`
                  : `Au plafond de la ligue`}
              </div>
            </div>
          </div>

          {/* Graphique d’évolution */}
          <div className="mt-8">
            <EloHistoryChart playerDocId={player.documentId} />
          </div>
        </section>

        {/* --- Derniers matchs --- */}
        <section>
          <h3 className={sectionTitle()}>Derniers matchs</h3>
          <div />
        </section>
      </div>
    </div>
  );
}
