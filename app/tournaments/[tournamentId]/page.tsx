"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import { useEffect, useState } from "react";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { Calendar } from "lucide-react";

import { Tournament } from "@/lib/interfaces";
import { getTournamentById } from "@/lib/api";
import { Loading } from "@/components/loading";
import { DateComponent } from "@/components/dateComponent";
import AddressLink from "@/components/addressLink";

// Fonction pour calculer le statut
const getTournamentStatus = (startDate: string, endDate: string) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (now < start) return "À venir";
  if (now >= start && now <= end) return "En cours";
  if (now > end) return "Terminé";

  return "Annulé";
};

export default function TournamentPage() {
  const router = useRouter();
  const { tournamentId }: { tournamentId: string } = useParams();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "infos";
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleTabChange = (key: string) => {
    router.push(`/tournaments/${tournamentId}?tab=${key}`);
  };

  useEffect(() => {
    setLoading(true);

    const fetchTournament = async () => {
      try {
        const { data } = await getTournamentById(tournamentId);

        setTournament(data);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement du joueur");
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [tournamentId]);

  if (error) {
    return error;
  }

  if (loading) {
    <Loading />;
  }

  if (!tournament) {
    return "Error retrieving tournament";
  }

  const status = getTournamentStatus(tournament.startDate, tournament.endDate);

  return (
    <div>
      {/* Tabs fixes sous la navbar */}
      <div className="sticky top-[64px] z-40 bg-white shadow-sm border-b">
        <div className="pt-1 px-1 w-full inline-flex items-center">
          <Image alt="Ligue Bronze" className="pr-2" height={40} src={`/badge-bronze.png`} />
          <div>
            Ligue Bronze - {tournament.club.name} -{" "}
            <DateComponent abbrev date={tournament.startDate} />
          </div>
        </div>
        <Tabs
          aria-label="Onglets du tournoi"
          classNames={{
            tabList: "px-4",
            tab: "data-[selected=true]:text-primary",
          }}
          selectedKey={activeTab}
          variant="underlined"
          onSelectionChange={(key) => handleTabChange(key as string)}
        >
          <Tab key="infos" title="Infos" />
          <Tab key="teams" title="Équipes inscrites" />
        </Tabs>
      </div>

      {/* Contenu du tab */}
      <div className="w-full min-h-[500px]">
        {activeTab === "infos" && (
          <div>
            <div className="flex justify-center sm:py-10">
              <div className="w-full sm:max-w-[500px] mx-auto py-5 px-5">
                <div className="flex gap-4 items-center">
                  <Image alt="Ligue Bronze" src={`/badge-bronze.png`} width={50} />
                  <div>
                    <h1 className="text-xl font-bold">{tournament.name}</h1>
                    <p className="text-sm text-gray-500">Ligue Bronze</p>
                  </div>
                </div>

                <section className="bg-white py-16 px-6 w-full">
                  <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-bold uppercase mb-8 text-gray-900 border-b-4 border-primary pb-2 inline-block">
                      Lieu
                    </h2>
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                      <p>{tournament.club.name}</p>
                      <AddressLink address={tournament.address} />
                    </div>
                  </div>
                </section>

                <div>
                  <h2 className="font-semibold">
                    <Calendar className="text-primary" size={18} />
                    Dates
                  </h2>
                  <p>
                    Début : <DateComponent withDay withTime date={tournament.startDate} />
                  </p>
                  <p>
                    Fin : <DateComponent withDay withTime date={tournament.endDate} />
                  </p>
                </div>

                {tournament.description && (
                  <div>
                    <h2 className="font-semibold">Description</h2>
                    <p>{tournament.description}</p>
                  </div>
                )}

                {tournament.prizeMoney && (
                  <div>
                    <h2 className="font-semibold">Prize Money</h2>
                    <p>{tournament.prizeMoney} €</p>
                  </div>
                )}

                {tournament.allocatedCourts && (
                  <div>
                    <h2 className="font-semibold">Nombre de courts</h2>
                    <p>{tournament.allocatedCourts}</p>
                  </div>
                )}

                <div>
                  <h2 className="font-semibold">Statut</h2>
                  <p>{status}</p>
                </div>
              </div>
              <div>
                <Button color="primary" variant="solid">
                  S'inscrire au tournoi
                </Button>
              </div>
            </div>
          </div>
        )}
        {activeTab === "teams" && (
          <Card>
            <CardBody>Liste des équipes bientôt dispo...</CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
