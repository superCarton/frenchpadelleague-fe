"use client";

import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { AlignEndHorizontal, Calendar, Euro, Gavel, ScanLine, Utensils } from "lucide-react";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { useState } from "react";

import { DateComponent } from "../dateComponent";
import { sectionTitle } from "../primitives";
import { ClubUser } from "../club/clubUser";
import AddressLink from "../addressLink";
import { PlayerPreviewView } from "../player/playerPreview";
import Gender from "../gender";
import { DateRangeComponent } from "../dateRangeComponent";

import { TournamentPreviewView } from "./tournamentPreview";
import TournamentRegisterModal from "./tournamentRegister";

import { Player, Tournament } from "@/lib/interfaces";

export default function TournamentInfos({
  tournament,
  profile,
}: {
  tournament: Tournament;
  profile: Player | null;
}) {
  const { league, club } = tournament;
  const [isRegisterModalOpen, setRegisterModalOpen] = useState<boolean>(false);

  const renderRegisterButton = () => {
    const isCurrentPlayerInTournamentLeague =
      profile && profile.elo > league.minElo && profile.elo < league.maxElo;

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
        <p className="text-warning-600 text-sm">
          Tu dois confirmer ton email pour pouvoir t'inscrire
        </p>
      );
    }
    if (tournament.currentStatus !== "registrations-opened") {
      return (
        <p className="text-gray-600 text-sm">
          Les inscriptions au tournoi ne sont pas encore ouvertes
        </p>
      );
    }
    if (!isCurrentPlayerInTournamentLeague) {
      return (
        <p className="text-warning-600 text-sm">
          Tu n'es pas éligible pour t'inscrire à ce tournoi
        </p>
      );
    }

    return (
      <Button
        className="w-full sm:w-auto"
        color="primary"
        onPress={() => setRegisterModalOpen(true)}
      >
        S'inscrire au tournoi
      </Button>
    );
  };

  return (
    <>
      <TournamentPreviewView tournament={tournament} />

      <section className="space-y-2">
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

          <div className="flex items-center gap-2">
            <Euro size={16} />
            <span>
              Prize money{" "}
              {typeof tournament.prizeMoney !== "undefined"
                ? `${tournament.prizeMoney}$`
                : "non défini"}
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

      <section className="space-y-2">
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
          <p className="flex items-center gap-2">
            <ScanLine size={16} />6 courts alloués
          </p>
        </div>
      </section>

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
            <h3 className="font-semibold">Nombre de places restantes</h3>
            <p>2 / 24</p>
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
      <TournamentRegisterModal
        isOpen={isRegisterModalOpen}
        league={league}
        tournament={tournament}
        onClose={() => setRegisterModalOpen(false)}
      />
    </>
  );
}
