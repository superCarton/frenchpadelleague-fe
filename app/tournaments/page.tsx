import { TournamentPreviewView } from "@/components/tournamentPreview";
import { getTournaments } from "@/lib/api";

export default async function SearchTournamentsPage() {
  const { data: tournaments } = await getTournaments();

  return (
    <div>
      <h1>Liste des tournois</h1>
      {tournaments.map((tournament) => (
        <TournamentPreviewView key={tournament.documentId} tournament={tournament} />
      ))}
    </div>
  );
}
