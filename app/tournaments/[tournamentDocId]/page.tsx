"use client";

import { useParams } from "next/navigation";
import { Tabs, Tab } from "@heroui/tabs";
import { useEffect, useState } from "react";
import { Image } from "@heroui/image";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Users, Trophy, Info, Table, HandFist } from "lucide-react";
import NextLink from "next/link";
import { Button } from "@heroui/button";
import { Alert } from "@heroui/alert";
import { addToast } from "@heroui/toast";

import { Tournament } from "@/lib/interfaces";
import { getTournamentByDocId } from "@/lib/api";
import { DateRangeComponent } from "@/components/common/dateRangeComponent";
import TournamentInfos from "@/components/tournament/tournamentInfos";
import TournamentTeams from "@/components/tournament/tournamentTeams";
import TournamentPhases from "@/components/tournament/tournamentPhases";
import TournamentMatches from "@/components/tournament/tournamentMatches";
import TournamentRanking from "@/components/tournament/tournamentRanking";
import ErrorComponent from "@/components/errorComponent";
import { SectionLoader } from "@/components/common/sectionLoader";
import { useUserStore } from "@/store/store";

export default function TournamentPage() {
  const { tournamentDocId } = useParams<{ tournamentDocId: string }>();

  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { profile } = useUserStore();

  const fetchCurrentTournament = () => {
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
  };

  useEffect(() => {
    fetchCurrentTournament();
  }, [tournamentDocId]);

  if (error) return <ErrorComponent error={error} />;
  if (loading) return <SectionLoader label="Chargement du tournoi" />;
  if (!tournament) return <div className="p-6">Tournoi introuvable</div>;

  const { league, club } = tournament;

  const playerTeamRegistered =
    profile &&
    tournament &&
    tournament.teams.find(
      (team) =>
        team.playerA.documentId === profile.documentId ||
        team.playerB.documentId === profile.documentId
    );

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
        radius="md"
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

      {playerTeamRegistered && (
        <div className="max-w-2xl mx-auto px-2 pt-2">
          <Alert
            isClosable
            className="py-2 px-2"
            color="primary"
            endContent={
              tournament.currentStatus == "registrations-opened" ? (
                <Button
                  color="secondary"
                  variant="light"
                  onPress={() =>
                    addToast({
                      color: "warning",
                      title: "Tu dois contacter le juge arbitre pour te désinscrire du tournoi",
                    })
                  }
                >
                  Désinscription
                </Button>
              ) : null
            }
            variant="faded"
          >
            <div className="flex flex-row gap-2 items-center">
              Tu es inscrit à ce tournoi avec{" "}
              {
                (playerTeamRegistered.playerA.documentId === profile.documentId
                  ? playerTeamRegistered.playerB
                  : playerTeamRegistered.playerA
                ).firstname
              }
            </div>
          </Alert>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-2 pb-6 pt-2">
        <Tabs
          aria-label="Onglets du tournoi"
          className="w-full"
          classNames={{
            tabList: "w-full flex-nowrap overflow-x-auto scrollbar-hide",
            tab: "shrink-0 w-auto flex-initial data-[selected=true]:text-primary",
          }}
          color="primary"
          radius="full"
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
            <TournamentInfos tournament={tournament} onUpdate={fetchCurrentTournament} />
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
            isDisabled={
              tournament.currentStatus !== "started" && tournament.currentStatus !== "completed"
            }
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
            isDisabled={
              tournament.currentStatus !== "started" && tournament.currentStatus !== "completed"
            }
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
