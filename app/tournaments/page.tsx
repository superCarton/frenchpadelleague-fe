import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";

import { sectionTitle } from "@/components/primitives";
import { TournamentPreviewView } from "@/components/tournamentPreview";
import { getTournaments } from "@/lib/api";

export default async function SearchTournamentsPage() {
  const { data: tournaments } = await getTournaments();

  return (
    <div className="flex justify-center py-4 sm:py-10 px-2 sm:px-4">
      <div className="w-full sm:w-xl mx-auto">
        <Breadcrumbs className="" size="md">
          <BreadcrumbItem href="/accueil">Accueil</BreadcrumbItem>
          <BreadcrumbItem href="/tournaments">Tournois</BreadcrumbItem>
        </Breadcrumbs>
        <h2 className={sectionTitle()}>Liste des tournois</h2>
        <div className="w-full">
          {tournaments.map((tournament) => (
            <TournamentPreviewView key={tournament.documentId} tournament={tournament} />
          ))}
        </div>
      </div>
    </div>
  );
}
