"use client";

import { Button } from "@heroui/button";
import { User } from "@heroui/user";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Calendar, Euro, Info, MapPin, ScanLine, Utensils } from "lucide-react";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { useState } from "react";

import { DateComponent } from "../dateComponent";
import { sectionTitle } from "../primitives";
import { ClubUser } from "../club/clubUser";
import AddressLink from "../addressLink";

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
  const isCurrentPlayerInTournamentLeague =
    profile && profile.elo > league.minElo && profile.elo < league.maxElo;
  const isRegistrationButtonEnabled =
    tournament.currentStatus === "registrations-opened" && isCurrentPlayerInTournamentLeague;

  return (
    <>
      <TournamentPreviewView tournament={tournament} />

      {tournament.description && (
        <div className="prose max-w-none text-gray-700">{tournament.description}</div>
      )}

      <section className="space-y-2">
        <h2 className={sectionTitle()}>
          <div className="flex items-center gap-2">
            <MapPin size={18} />
            Lieu
          </div>
        </h2>
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

      {/* Dates */}
      <section className="space-y-2">
        <h2 className={sectionTitle()}>
          <div className="flex items-center gap-2">
            <Calendar size={18} />
            Dates
          </div>
        </h2>
        <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
          <div>
            <h3 className="font-semibold">Début</h3>
            <DateComponent withDay withTime date={tournament.startDate} />
          </div>
          <div>
            <h3 className="font-semibold">Fin</h3>
            <DateComponent
              withDay
              date={tournament.endDate || tournament.startDate}
              withTime={!!tournament.endDate}
            />
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className={sectionTitle()}>
          <div className="flex items-center gap-2">
            <Info size={18} />
            Informations
          </div>
        </h2>
        <div className="text-gray-700 space-y-2">
          {tournament.prizeMoney && (
            <div>
              <h3 className="font-semibold">Prize Money</h3>
              <p className="flex items-center">
                <Euro className="mr-2" size={16} />
                {tournament.prizeMoney}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold">Juge arbitre</h3>
            <User name="Guillaume Mathias" />
          </div>
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
            le badge <strong>{league.badge}</strong> (Elo compris entre {league.minElo} et{" "}
            {league.maxElo}) au moment de l'inscription
          </p>
        </CardBody>
        <CardFooter className="justify-center">
          {profile ? (
            isRegistrationButtonEnabled && (
              <Button
                className="w-full sm:w-auto"
                color="primary"
                onPress={() => setRegisterModalOpen(true)}
              >
                S'inscrire au tournoi
              </Button>
            )
          ) : (
            <p className="text-gray-600 text-sm">
              Tu dois{" "}
              <Link as={NextLink} href="/login">
                te connecter
              </Link>{" "}
              pour pouvoir t'inscrire
            </p>
          )}
        </CardFooter>
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
