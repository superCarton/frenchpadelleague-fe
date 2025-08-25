"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Tabs, Tab } from "@heroui/tabs";
import { useEffect, useState } from "react";
import { Image } from "@heroui/image";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Users, Trophy, Info, LoaderPinwheel } from "lucide-react";
import NextLink from "next/link";

import { Tournament } from "@/lib/interfaces";
import { getTournamentByDocId } from "@/lib/api";
import PadelLoader from "@/components/padelLoader";
import { DateRangeComponent } from "@/components/dateRangeComponent";
import { useUserStore } from "@/store/store";
import TournamentInfos from "@/components/tournament/tournamentInfos";
import TournamentTeams from "@/components/tournament/tournamentTeams";
import TournamentPhases from "@/components/tournament/tournamentPhases";

export default function TournamentPage() {
  const router = useRouter();
  const { tournamentDocId } = useParams<{ tournamentDocId: string }>();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "infos";
  const { profile } = useUserStore();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleTabChange = (key: string) => {
    router.push(`/tournaments/${tournamentDocId}?tab=${key}`);
  };

  useEffect(() => {
    setLoading(true);
    const fetchTournament = async () => {
      try {
        const { data } = await getTournamentByDocId(tournamentDocId);

        setTournament(data);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement du tournoi");
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [tournamentDocId]);

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (loading) return <PadelLoader />;
  if (!tournament) return <div className="p-6">Tournoi introuvable</div>;

  const { league, club } = tournament;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-64 max-w-6xl mx-auto overflow-hidden hidden sm:block">
        <Image
          alt="cover tournoi"
          className="object-cover w-full h-full"
          src={club.coverImage.url}
        />
      </div>

      <div className="sticky top-[64px] z-40 max-w-6xl mx-auto bg-white shadow-sm border-b">
        <Breadcrumbs className="px-4 pt-2 pb-0 text-gray-500" size="sm">
          <BreadcrumbItem>
            <NextLink href="/tournaments">Tournois</NextLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrent>
            FPL {league.title} - {club.name} -{" "}
            <DateRangeComponent
              abbrev
              endDate={tournament.endDate}
              startDate={tournament.startDate}
            />
          </BreadcrumbItem>
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
          <Tab
            key="infos"
            title={
              <span className="flex items-center gap-1">
                <Info size={16} />
                Infos
              </span>
            }
          />
          <Tab
            key="teams"
            title={
              <span className="flex items-center gap-1">
                <Users size={16} />
                Équipes
              </span>
            }
          />
          <Tab
            key="table"
            title={
              <span className="flex items-center gap-1">
                <Trophy size={16} />
                Tableau
              </span>
            }
          />
          <Tab
            key="matches"
            isDisabled
            title={
              <span className="flex items-center gap-1">
                <LoaderPinwheel size={16} />
                Matchs
              </span>
            }
          />
        </Tabs>
      </div>

      <div className="max-w-xl mx-auto px-2 py-6 space-y-6">
        {activeTab === "infos" && <TournamentInfos profile={profile} tournament={tournament} />}
        {activeTab === "teams" && <TournamentTeams tournament={tournament} />}
        {activeTab === "table" && <TournamentPhases tournament={tournament} />}
        {activeTab === "matches" && <div>Tous les matchs ici</div>}
      </div>
    </div>
  );
}
