"use client";

import { useParams } from "next/navigation";
import { Tabs, Tab } from "@heroui/tabs";
import { useEffect, useState } from "react";
import { Image } from "@heroui/image";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Users, Trophy, Info, Table, HandFist } from "lucide-react";
import NextLink from "next/link";
import { CircularProgress } from "@heroui/progress";

import { Tournament } from "@/lib/interfaces";
import { getTournamentByDocId } from "@/lib/api";
import { DateRangeComponent } from "@/components/dateRangeComponent";
import { useUserStore } from "@/store/store";
import TournamentInfos from "@/components/tournament/tournamentInfos";
import TournamentTeams from "@/components/tournament/tournamentTeams";
import TournamentPhases from "@/components/tournament/tournamentPhases";
import TournamentMatches from "@/components/tournament/tournamentMatches";
import TournamentRanking from "@/components/tournament/tournamentRanking";
import ErrorComponent from "@/components/errorComponent";

export default function TournamentPage() {
  const { tournamentDocId } = useParams<{ tournamentDocId: string }>();
  const { profile } = useUserStore();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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

  if (error) return <ErrorComponent error={error} />;
  if (loading)
    return (
      <div className="w-full flex h-[200px] justify-center items-center">
        <CircularProgress label="Chargement du tournoi..." />
      </div>
    );
  if (!tournament) return <div className="p-6">Tournoi introuvable</div>;

  const { league, club } = tournament;

  return (
    <div className="bg-gray-50">
      <div className="relative h-64 max-w-6xl mx-auto overflow-hidden hidden sm:block">
        <Image
          alt="cover tournoi"
          className="object-cover w-full h-full"
          src={club.coverImage.url}
        />
      </div>

      <Breadcrumbs
        className="w-full text-gray-600 flex justify-center mt-2"
        separator="/"
        size="md"
        variant="bordered"
      >
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

      <div className="max-w-2xl mx-auto px-2 pb-6 pt-2">
        <Tabs
          aria-label="Onglets du tournoi"
          className="w-full"
          classNames={{
            tabList: "w-full flex-nowrap overflow-x-auto scrollbar-hide",
            tab: "shrink-0 w-auto flex-initial data-[selected=true]:text-primary",
          }}
          color="primary"
          variant="bordered"
        >
          <Tab
            key="infos"
            title={
              <span className="flex items-center gap-1">
                <Info size={16} />
                Infos
              </span>
            }
          >
            <TournamentInfos profile={profile} tournament={tournament} />
          </Tab>
          <Tab
            key="teams"
            title={
              <span className="flex items-center gap-1">
                <Users size={16} />
                Équipes
              </span>
            }
          >
            <TournamentTeams tournament={tournament} />
          </Tab>
          <Tab
            key="table"
            title={
              <span className="flex items-center gap-1">
                <Table size={16} />
                Tableau
              </span>
            }
          >
            <TournamentPhases tournament={tournament} />
          </Tab>
          <Tab
            key="matches"
            title={
              <span className="flex items-center gap-1">
                <HandFist size={16} />
                Matchs
              </span>
            }
          >
            <TournamentMatches tournament={tournament} />
          </Tab>
          <Tab
            key="ranking"
            isDisabled={tournament.currentStatus !== "completed"}
            title={
              <span className="flex items-center gap-1">
                <Trophy size={16} />
                Classement
              </span>
            }
          >
            <TournamentRanking tournament={tournament} />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}
