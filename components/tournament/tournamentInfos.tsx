"use client";

import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { AlignEndHorizontal, Calendar, Euro, Gavel, Utensils } from "lucide-react";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { Alert, useDisclosure } from "@heroui/react";

import { DateComponent } from "../common/dateComponent";
import { sectionTitle } from "../primitives";
import { ClubUser } from "../club/clubUser";
import AddressLink from "../common/addressLink";
import { PlayerPreviewView } from "../player/playerPreview";
import Gender from "../common/gender";
import { DateRangeComponent } from "../common/dateRangeComponent";
import { TennisBallIcon, TennisCourtIcon } from "../icons";

import { TournamentPreviewView } from "./tournamentPreview";
import TournamentRegisterModal from "./tournamentRegisterModal";

import { Tournament } from "@/lib/interfaces";
import { getMePlayer } from "@/lib/api";
import { useUserStore } from "@/store/store";

export default function TournamentInfos({
  tournament,
  onUpdate,
}: {
  tournament: Tournament;
  onUpdate: () => void;
}) {
  const { league, club, teams } = tournament;
  const { token, profile, setProfile } = useUserStore();
  const {
    isOpen: isRegisterModalOpen,
    onOpen: onOpenRegisterModal,
    onClose: onCloseRegisterModal,
  } = useDisclosure();

  const refreshMePlayer = async () => {
    if (token) {
      const profile = await getMePlayer(token);
      setProfile(profile);
    }
  };

  const refresh = () => {
    onUpdate();
    refreshMePlayer();
    onCloseRegisterModal();
  };

  const playerTeamRegistered =
    profile &&
    teams.find(
      (team) =>
        team.playerA.documentId === profile.documentId ||
        team.playerB.documentId === profile.documentId
    );

  const renderRegisterButton = () => {
    const isCurrentPlayerInTournamentLeague =
      profile && profile.league.documentId === tournament.league.documentId;

    if (!profile) {
      return (
        <p className="text-gray-600 text-sm">
          Tu dois{" "}
          <Link as={NextLink} href="/login">
            te connecter
          </Link>{" "}
          pour pouvoir t'inscrire
        </p>
      );
    }
    if (!profile.user.confirmed) {
      return (
        <Alert color="warning" variant="faded">
          Tu dois confirmer ton email pour pouvoir t'inscrire
        </Alert>
      );
    }
    if (tournament.currentStatus !== "registrations-opened") {
      return (
        <Alert color="warning" variant="faded">
          Les inscriptions au tournoi ne sont pas encore ouvertes
        </Alert>
      );
    }
    if (!isCurrentPlayerInTournamentLeague) {
      return (
        <Alert color="warning" variant="faded">
          Tu n'es pas éligible pour t'inscrire à ce tournoi
        </Alert>
      );
    }

    return (
      <Button className="w-full sm:w-auto" color="primary" onPress={onOpenRegisterModal}>
        S'inscrire au tournoi
      </Button>
    );
  };

  return (
    <div className="space-y-6">
      <TournamentPreviewView disableClick tournament={tournament} />
      <section>
        <h2 className={sectionTitle()}>Description</h2>
        <div className="text-gray-700 space-y-2">
          {tournament.description && (
            <div className="prose max-w-none">{tournament.description}</div>
          )}

          {tournament.league && (
            <div className="flex items-center gap-2">
              <AlignEndHorizontal size={16} />
              {tournament.league.title} ( joueurs de {tournament.league.minElo} à{" "}
              {tournament.league.maxElo} elo )
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <DateRangeComponent
              withDay
              withTime
              withYear
              endDate={tournament.endDate}
              startDate={tournament.startDate}
            />
          </div>

          <Gender gender={tournament.gender} />

          {tournament.courts && tournament.courts.length > 0 && (
            <div className="flex flex-col gap-2">
              {tournament.courts.filter((court) => court.type === "outdoor").length > 0 && (
                <p className="flex items-center gap-2">
                  <TennisCourtIcon size={16} />
                  <span>
                    {tournament.courts.filter((court) => court.type === "outdoor").length} court(s)
                    extérieur(s)
                  </span>
                </p>
              )}
              {tournament.courts.filter((court) => court.type === "indoor").length > 0 && (
                <p className="flex items-center gap-2">
                  <TennisCourtIcon size={16} />
                  <span>
                    {tournament.courts.filter((court) => court.type === "indoor").length} court(s)
                    couvert(s)
                  </span>
                </p>
              )}
            </div>
          )}

          {tournament.ballsType && (
            <div className="flex items-center gap-2">
              <TennisBallIcon size={16} />
              <span>Balles {tournament.ballsType}</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Euro size={16} />
            <span>
              Prize money {tournament.prizeMoney ? `${tournament.prizeMoney}$` : "non défini"}
            </span>
          </div>

          {tournament.referee && (
            <div className="flex items-center gap-2">
              <Gavel size={16} />
              <span>Juge arbitre</span>
              <PlayerPreviewView
                hideDescription
                hideElo
                avatarSize="tiny"
                player={tournament.referee}
              />
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className={sectionTitle()}>Lieu</h2>
        <div className="text-gray-700 space-y-1">
          <ClubUser club={club} />
          <p className="flex items-center gap-2 mt-2">
            <AddressLink address={club.address} className="text-gray-700" />
          </p>
          <p className="flex items-center gap-2">
            <Utensils size={16} />
            Restauration sur place disponible
          </p>
        </div>
      </section>

      {!playerTeamRegistered && (
        <Card className="w-full sm:w-xl mx-auto mx-auto py-5 sm:px-5">
          <CardHeader className="flex gap-3 text-lg font-semibold text-gray-80 border-b border-gray-200 pb-2 mb-4">
            Inscriptions
          </CardHeader>
          <CardBody className="space-y-3 text-gray-700">
            <p>
              Les inscriptions se font uniquement en ligne sur ce site. Le paiement se fera
              directement à l'arrivée au bar du club.
            </p>
            {tournament.registrationFee && (
              <div>
                <h3 className="font-semibold">Tarif</h3>
                <p className="flex items-center gap-1">
                  {tournament.registrationFee}
                  <Euro size={16} />
                </p>
              </div>
            )}
            <div>
              <h3 className="font-semibold">Statut des inscriptions</h3>
              <p>{tournament.currentStatus === "registrations-opened" ? "Ouvertes" : "Fermées"}</p>
            </div>
            <div>
              <h3 className="font-semibold">Nombre d'équipes inscrites</h3>
              <p>
                {tournament.teams.length}
                {typeof tournament.maxTeams !== "undefined" && <> / {tournament.maxTeams}</>}
              </p>
            </div>
            {tournament.registrationDeadline && (
              <div>
                <h3 className="font-semibold">Date limite</h3>
                <DateComponent withDay withTime date={tournament.registrationDeadline} />
              </div>
            )}
            <p>
              Ce tournoi de niveau <strong>{league.title}</strong> est réservé aux joueurs possédant
              le badge <strong>{league.badge}</strong> ( elo compris entre {league.minElo} et{" "}
              {league.maxElo} ) au moment de l'inscription
            </p>
          </CardBody>
          <CardFooter className="justify-center">{renderRegisterButton()}</CardFooter>
        </Card>
      )}

      <TournamentRegisterModal
        isOpen={isRegisterModalOpen}
        league={league}
        tournament={tournament}
        onClose={refresh}
      />
    </div>
  );
}
