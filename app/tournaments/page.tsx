import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import dayjs from "dayjs";

import { sectionTitle } from "@/components/primitives";
import { TournamentPreviewView } from "@/components/tournamentPreview";
import { getTournaments } from "@/lib/api";

export default async function TournamentsPage() {
  const { data: tournaments } = await getTournaments();

  return (
    <div className="flex justify-center py-4 sm:py-10 px-2 sm:px-4">
      <div className="w-full sm:w-xl mx-auto">
        <Breadcrumbs className="" size="md">
          <BreadcrumbItem href="/accueil">Accueil</BreadcrumbItem>
          <BreadcrumbItem href="/tournaments">Tournois</BreadcrumbItem>
        </Breadcrumbs>
        <h2 className={sectionTitle()}>Les tournois à venir</h2>
        <div className="w-full space-y-4">
          {tournaments
            .sort((a, b) => (dayjs(b.startDate).isBefore(dayjs(a.startDate)) ? 1 : -1))
            .map((tournament) => (
              <TournamentPreviewView key={tournament.documentId} tournament={tournament} />
            ))}
        </div>
      </div>
    </div>
  );
}
