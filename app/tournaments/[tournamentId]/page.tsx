"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { useEffect, useState } from "react";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { User } from "@heroui/user";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";

import { Tournament } from "@/lib/interfaces";
import { getTournamentById, isUserConnected } from "@/lib/api";
import { DateComponent } from "@/components/dateComponent";
import AddressLink from "@/components/addressLink";
import PadelLoader from "@/components/padelLoader";
import { Calendar, Users, Trophy, Info, Utensils, Euro, MapPin, ScanLine } from "lucide-react";
import { TournamentPreviewView } from "@/components/tournamentPreview";
import { ClubUser } from "@/components/clubUser";
import { sectionTitle } from "@/components/primitives";
import { DateRangeComponent } from "@/components/dateRangeComponent";

export default function TournamentPage() {
  const router = useRouter();
  const { tournamentId } = useParams<{ tournamentId: string }>();
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
        setError(err.message || "Erreur lors du chargement du tournoi");
      } finally {
        setLoading(false);
      }
    };
    fetchTournament();
  }, [tournamentId]);

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (loading) return <PadelLoader />;
  if (!tournament) return <div className="p-6">Tournoi introuvable</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-64 w-full overflow-hidden hidden sm:block">
        <Image
          src={"/clubs/bg-acacias.png"}
          alt="cover tournoi"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="sticky top-[64px] z-40 bg-white shadow-sm border-b">
        <Breadcrumbs size="sm" className="px-4 pt-2 pb-0 text-gray-500">
          <BreadcrumbItem href="/tournaments">Tournois</BreadcrumbItem>
          <BreadcrumbItem isCurrent>FPL Bronze - {tournament.club.name} - <DateRangeComponent abbrev startDate={tournament.startDate} endDate={tournament.endDate}/></BreadcrumbItem>
        </Breadcrumbs>
        <Tabs
          aria-label="Onglets du tournoi"
          classNames={{
            tabList: "px-4 sm:px-6",
            tab: "data-[selected=true]:text-primary",
          }}
          selectedKey={activeTab}
          variant="underlined"
          onSelectionChange={(key) => handleTabChange(key as string)}
        >
          <Tab key="infos" title={<span className="flex items-center gap-1"><Info size={16}/>Infos</span>} />
          <Tab key="teams" title={<span className="flex items-center gap-1"><Users size={16}/>Équipes</span>} />
          <Tab key="table" title={<span className="flex items-center gap-1"><Trophy size={16}/>Tableau</span>} isDisabled />
        </Tabs>
      </div>

      <div className="max-w-xl mx-auto px-2 py-6 space-y-6">
        {activeTab === "infos" && (
          <>
            <TournamentPreviewView tournament={tournament} />

            {tournament.description && (
              <div className="prose max-w-none text-gray-700">
                {tournament.description}
              </div>
            )}

            <section className="space-y-2">
              <h2 className={sectionTitle()}><div className="flex items-center gap-2"><MapPin size={18}/>Lieu</div></h2>
              <div className="text-gray-700 space-y-1">
                <ClubUser club={tournament.club} />
                <p className="flex items-center gap-2 mt-2"><MapPin size={16}/><AddressLink address={tournament.address} /></p>
                <p className="flex items-center gap-2"><Utensils size={16}/>Restauration sur place disponible</p>
                <p className="flex items-center gap-2"><ScanLine size={16}/>6 courts alloués</p>
              </div>
            </section>

            {/* Dates */}
            <section className="space-y-2">
              <h2 className={sectionTitle()}><div className="flex items-center gap-2"><Calendar size={18}/>Dates</div></h2>
              <div className="grid sm:grid-cols-2 gap-4 text-gray-700">
                <div>
                  <h3 className="font-semibold">Début</h3>
                  <DateComponent date={tournament.startDate} withDay withTime />
                </div>
                <div>
                  <h3 className="font-semibold">Fin</h3>
                  <DateComponent date={tournament.endDate} withDay withTime />
                </div>
              </div>
            </section>

             <section className="space-y-2">
               <h2 className={sectionTitle()}><div className="flex items-center gap-2"><Info size={18}/>Informations</div></h2>
               <div className="text-gray-700 space-y-2">
                {tournament.prizeMoney && (
                  <div>
                    <h3 className="font-semibold">Prize Money</h3>
                    <p className="flex items-center"><Euro className="mr-2" size={16} />{tournament.prizeMoney}</p>
                  </div>
                )}
                {tournament.gamesFormat && (
                  <div>
                    <h3 className="font-semibold">Formats de jeu</h3>
                    <p className="prose">{tournament.gamesFormat}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="font-semibold">Juge arbitre</h3>
                  <User name="Guillaume Mathias" />
                </div>
              </div>
            </section>

            {/* Inscriptions */}
            <Card className="w-full sm:w-xl mx-auto mx-auto py-5 sm:px-5">
              <CardHeader className="flex gap-3 text-lg font-semibold text-gray-80 border-b border-gray-200 pb-2 mb-4">Inscriptions</CardHeader>
              <CardBody className="space-y-3 text-gray-700">
                <p>Les inscriptions se font uniquement en ligne sur ce site. Le paiement se fera directement à l'arrivée au bar du club.</p>

                {tournament.registrationFee && (
                  <div>
                    <h3 className="font-semibold">Tarif</h3>
                    <p className="flex items-center gap-1">{tournament.registrationFee}<Euro size={16}/></p>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">Status des inscriptions</h3>
                  <p>{tournament.currentStatus === 'registrations-opened' ? 'Ouvertes' : 'Fermées'}</p>
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
              </CardBody>
              <CardFooter className="justify-center">
                {isUserConnected() ? (
                  <Button color="primary" className="w-full sm:w-auto">
                    S'inscrire au tournoi
                  </Button>
                ) : (
                  <p className="text-gray-600 text-sm">Tu dois <Link href="/login">te connecter</Link> pour pouvoir t'inscrire</p>
                )}
              </CardFooter>
            </Card>
          </>
        )}

        {activeTab === "teams" && (
          <div className="text-gray-600">Liste des équipes bientôt disponible</div>
        )}
      </div>
    </div>
  );
}
