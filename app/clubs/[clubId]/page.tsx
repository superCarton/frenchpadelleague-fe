import { ClubPreviewView } from "@/components/clubPreview";
import { Image } from "@heroui/image";
import { Avatar } from "@heroui/avatar";

import { getClubById } from "@/lib/api";
import { sectionTitle } from "@/components/primitives";

type ClubPageProps = {
  params: Promise<{ clubId: string }>;
};

export default async function ClubPage({ params }: ClubPageProps) {
  const { clubId } = await params;
  const { data: club } = await getClubById(clubId);

  return (
    <div>
      <div className="flex flex-col item-center justify-center mb-8">
        <Image
          alt="Club background"
          className="object-cover"
          src="/clubs/bg-acacias.png"
        />
        <div className="relative top-6">
          <Avatar
            src="/clubs/logo-acacias.png"
            size="lg"
            isBordered
            color="secondary"
            className="z-10 justify-center absolute left-1/2 -translate-x-1/2 -bottom-0"
          />
        </div>
      </div>
      <div>
        <h2 className={sectionTitle()}>{club.name}</h2>
        <section>
          <p>Situé à Cagnes-sur-Mer, le Tennis Club Les Acacias offre un cadre idéal pour les amateurs de sports de raquette et de foot à 5, dans une ambiance familiale et conviviale.</p>
        </section>
        <section>
          <h3>Horaires d'ouverture</h3>
          <div></div>
        </section>
        <section>
          <h3>Contact</h3>
          <div></div>
        </section>
      </div>


        {/* <ClubPreviewView club={club} /> */}
    </div>
  );
}
