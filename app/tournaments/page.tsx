"use client";

import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { Checkbox } from "@heroui/checkbox";
import { useEffect, useState } from "react";
import { addToast } from "@heroui/toast";
import NextLink from "next/link";
import { Pagination } from "@heroui/pagination";

import { sectionTitle } from "@/components/primitives";
import { TournamentPreviewView } from "@/components/tournament/tournamentPreview";
import { getTournaments } from "@/lib/api";
import { useUserStore } from "@/store/store";
import { Tournament } from "@/lib/interfaces";
import { SectionLoader } from "@/components/common/sectionLoader";

export default function TournamentsPage() {
  const { profile } = useUserStore();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  // filtres
  const [eligibleOnly, setEligibleOnly] = useState(false);

  const pageSize = 20;
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const fetchTournaments = async () => {
    setLoading(true);
    try {
      const leagueDocumentId = profile && eligibleOnly ? profile.league.documentId : undefined;
      const { data, meta } = await getTournaments(
        { future: true, leagueDocumentId },
        { page, pageSize }
      );
      setTournaments(data);
      setPageCount(meta.pagination.pageCount);
    } catch (e) {
      addToast({
        title: "Une erreur est survenue lors de la récupération des tournois",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [eligibleOnly, page]);

  return (
    <div className="flex justify-center py-4 sm:py-10 px-2 sm:px-4">
      <div className="w-full sm:w-xl mx-auto space-y-4">
        <Breadcrumbs size="md">
          <BreadcrumbItem>
            <NextLink href="/">Accueil</NextLink>
          </BreadcrumbItem>
          <BreadcrumbItem>Tournois</BreadcrumbItem>
        </Breadcrumbs>

        <h2 className={sectionTitle()}>Rechercher des tournois</h2>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          {profile && (
            <Checkbox isSelected={eligibleOnly} onValueChange={setEligibleOnly}>
              Afficher uniquement les tournois auxquels j'ai le droit de participer
            </Checkbox>
          )}
        </div>

        <div className="w-full space-y-4">
          {loading ? (
            <SectionLoader label="Recherche de tournois" />
          ) : tournaments.length === 0 ? (
            <p className="text-gray-500">Aucun tournoi trouvé.</p>
          ) : (
            tournaments.map((tournament) => (
              <TournamentPreviewView key={tournament.documentId} tournament={tournament} />
            ))
          )}
        </div>

        {tournaments.length > 0 && (
          <div className="flex justify-center">
            <Pagination showControls page={page} total={pageCount} onChange={(p) => setPage(p)} />
          </div>
        )}
      </div>
    </div>
  );
}
