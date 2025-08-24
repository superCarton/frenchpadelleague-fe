import { ClubPreviewView } from "@/components/club/clubPreview";
import { pageTitle } from "@/components/primitives";
import { getClubs } from "@/lib/api";

export const revalidate = 120; // ISR
export const dynamic = "force-dynamic"; // prevent pre-render at first build

export default async function SearchClubsPage() {
  const { data: clubs } = await getClubs();

  return (
    <div className="flex justify-center py-4 sm:py-10 px-2 sm:px-4">
      <div className="w-full sm:w-xl mx-auto">
        <h2 className={pageTitle()}>Tous les clubs</h2>
        <div className="space-y-2">
          {clubs.map((club) => (
            <ClubPreviewView key={club.documentId} club={club} />
          ))}
        </div>
      </div>
    </div>
  );
}
