"use client";

import { Image } from "@heroui/image";
import dayjs from "dayjs";
import { Avatar } from "@heroui/avatar";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import { Chip } from "@heroui/chip";
import { Badge } from "@heroui/badge";
import { Camera } from "lucide-react";
import { useDisclosure } from "@heroui/react";

import { getMePlayer, getPlayerByDocId } from "@/lib/api";
import { sectionTitle } from "@/components/primitives";
import { Player } from "@/lib/interfaces";
import { useUserStore } from "@/store/store";
import ErrorComponent from "@/components/errorComponent";
import { SectionLoader } from "@/components/common/sectionLoader";
import Gender from "@/components/common/gender";
import { leagueGradients } from "@/lib/helpers";
import PlayerLevelQuiz from "@/components/player/playerLevelQuizzModal";
import PlayerUploadPictureModal from "@/components/player/playerUploadPictureModal";
import PlayerEditProfileModal from "@/components/player/playerEditProfileModal";
import PlayerTournamentsRegistrations from "@/components/player/playerTournamentsRegistrations";

export default function PlayerPage() {
  const { playerDocId } = useParams<{ playerDocId: string }>();
  const { profile, token, setProfile } = useUserStore();
  const router = useRouter();

  const [player, setPlayer] = useState<Player | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const {
    isOpen: isLevelQuizzModalOpen,
    onOpen: onOpenLevelQuizzModal,
    onClose: onCloseLevelQuizzModal,
  } = useDisclosure();
  const {
    isOpen: isUploadProfilePictureModalOpen,
    onOpen: onOpenUploadProfilePictureModal,
    onClose: onCloseUploadProfilePictureModal,
  } = useDisclosure();
  const {
    isOpen: isEditProfileModalOpen,
    onOpen: onOpenEditProfileModal,
    onClose: onCloseEditProfileModal,
  } = useDisclosure();

  const fetchCurrentPlayer = () => {
    setLoading(true);
    const fetchPlayer = async () => {
      try {
        const { data } = await getPlayerByDocId(playerDocId);

        setPlayer(data);
        if (!data.playerStat.quizzDone) {
          onOpenLevelQuizzModal();
        }
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement du tournoi");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  };

  const refreshMePlayer = async () => {
    if (token) {
      const profile = await getMePlayer(token);
      setProfile(profile);
    }
  };

  const refresh = () => {
    fetchCurrentPlayer();
    refreshMePlayer();
  };

  useEffect(() => {
    fetchCurrentPlayer();
  }, [playerDocId]);

  const winLoseLast5Matches: (boolean | null)[] = [null, null, null, null, null];

  const renderContent = () => {
    if (error) return <ErrorComponent error={error} />;
    if (loading) {
      return <SectionLoader label="Chargement du profil" />;
    }
    if (!player) return <div className="p-6">Joueur introuvable</div>;
    const isPlayerConnected = profile && profile.documentId === player.documentId;
    const playerAge = dayjs().diff(dayjs(player.birthdate), "year");

    return (
      <div className="max-w-2xl mx-auto px-2 py-6 text-sm space-y-4">
        <Card
          className={`mx-auto rounded-sm shadow-sm hover:shadow-md transition overflow-hidden border border-${player.league.badge} p-0`}
        >
          <CardHeader
            className={`bg-gradient-to-r px-2 py-2 sm:px-6 sm:py-3 ${leagueGradients[player.league.badge]}`}
          >
            <h3 className="text-white font-bold text-xl uppercase tracking-wide">
              {player.firstname} {player.lastname}
            </h3>
          </CardHeader>
          <CardBody className="flex sm:flex-row flex-col px-8 py-4 gap-6 items-center justify-center">
            <div className="flex justify-center w-[200px]">
              <Badge
                isOneChar
                className="cursor-pointer"
                color="primary"
                content={<Camera size={16} />}
                hidden={!isPlayerConnected}
                placement="top-right"
                shape="circle"
                showOutline={false}
                size="lg"
                variant="solid"
                onClick={onOpenUploadProfilePictureModal}
              >
                <Avatar
                  className="w-40 h-40"
                  name={`${player.firstname.charAt(0).toUpperCase()}${player.lastname.charAt(0).toUpperCase()}`}
                  size="lg"
                  src={player.photo?.url}
                />
              </Badge>
            </div>
            <div className="w-full flex flex-col items-center justify-center space-y-3">
              <div className="flex flex-row items-center justify-center gap-4 p-2">
                <div>
                  <div className="flex items-end justify-center gap-1 text-4xl font-bold text-gray-900">
                    {player.playerStat.elo}
                    <span className="text-sm text-gray-500 font-medium">Elo</span>
                  </div>
                  <div className="text-tiny text-gray-500">
                    Meilleur Elo {player.playerStat.bestElo}
                  </div>
                </div>
                <Image
                  alt={`Badge ${player.league.title}`}
                  className="object-contain w-24 h-24"
                  height={120}
                  radius="none"
                  src={player.league.badgeImage.url}
                />
              </div>
              <div className="flex flex-col items-center text-tiny text-gray-500 gap-1">
                {/* <div>
                Membre depuis le <DateComponent withYear date={player.publishedAt} />
              </div> */}
                <div className="flex flex-row gap-1">
                  {playerAge} ans, section <Gender className="!gap-1" gender={player.gender} />
                </div>
                <div className="space-x-1">
                  Forme :{" "}
                  {winLoseLast5Matches.map((win, i) => (
                    <Chip
                      key={i}
                      color={win !== null ? (win ? "success" : "danger") : "default"}
                      radius="sm"
                      variant="flat"
                    >
                      {win !== null ? (win ? "V" : "D") : "N"}
                    </Chip>
                  ))}
                </div>
                <div>68% de victoires</div>
              </div>
              {isPlayerConnected && (
                <div className="flex flex-row items-center gap-2">
                  <Link
                    className="cursor-pointer text-small"
                    color="foreground"
                    underline="hover"
                    onPress={onOpenEditProfileModal}
                  >
                    Modifier mon profil
                  </Link>
                  {!player.playerStat.quizzDone && (
                    <Link
                      className="cursor-pointer text-small"
                      color="foreground"
                      underline="hover"
                      onPress={onOpenLevelQuizzModal}
                    >
                      Ajuster mon niveau
                    </Link>
                  )}
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        <section>
          <h3 className={sectionTitle()}>Statistiques</h3>
          <div className="text-sm text-gray-500">Prochainement disponible</div>
        </section>

        <section>
          <h3 className={sectionTitle()}>Derniers matchs</h3>
          <div className="text-sm text-gray-500">Prochainement disponible</div>
        </section>

        {isPlayerConnected && (
          <section>
            <h3 className={sectionTitle()}>Mes inscriptions aux tournois</h3>
            <PlayerTournamentsRegistrations playerDocumentId={playerDocId} />
            <div className="mx-auto mt-4 text-center">
              <Button color="primary" onPress={() => router.push("/tournaments")}>
                Voir tous les tournois
              </Button>
            </div>
          </section>
        )}
      </div>
    );
  };

  return (
    <>
      {renderContent()}

      <PlayerLevelQuiz
        isOpen={isLevelQuizzModalOpen}
        onClose={onCloseLevelQuizzModal}
        onQuizzFinished={refresh}
      />

      <PlayerUploadPictureModal
        isOpen={isUploadProfilePictureModalOpen}
        onClose={onCloseUploadProfilePictureModal}
        onUploaded={refresh}
      />

      <PlayerEditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={onCloseEditProfileModal}
        onUpdated={refresh}
      />
    </>
  );
}
