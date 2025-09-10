import { Image } from "@heroui/image";
import { Avatar } from "@heroui/avatar";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { Globe, Mail, Phone, Smartphone } from "lucide-react";
import dayjs from "dayjs";

import { getClubByDocId, getTournamentsByClubDocumentId } from "@/lib/api";
import { pageTitle, sectionTitle } from "@/components/primitives";
import AddressLink from "@/components/common/addressLink";
import { TournamentPreviewView } from "@/components/tournament/tournamentPreview";
import { daysNames, formatHour } from "@/lib/helpers";

export const revalidate = 120; // ISR
export const dynamic = "force-dynamic"; // prevent pre-render at first build

type ClubPageProps = {
  params: Promise<{ clubDocId: string }>;
};

export default async function ClubPage({ params }: ClubPageProps) {
  const { clubDocId } = await params;
  const { data: club } = await getClubByDocId(clubDocId);
  const { data: tournaments } = await getTournamentsByClubDocumentId(clubDocId);

  const nbIndoorCourts =
    club.padelCourts && club.padelCourts.filter((court) => court.type === "indoor").length;
  const nbOutdoorCourts =
    club.padelCourts && club.padelCourts.filter((court) => court.type === "outdoor").length;

  return (
    <div className="max-w-xl mx-auto px-2 py-6">
      <div className="flex flex-col item-center justify-center mb-8">
        <Image alt="Club background" className="object-cover" src={club.coverImage.url} />
        <div className="relative top-6">
          <Avatar
            isBordered
            className="z-10 justify-center absolute left-1/2 -translate-x-1/2 -bottom-0"
            color="secondary"
            size="lg"
            src={club.logo.url}
          />
        </div>
      </div>
      <div className="flex item-center justify-center">
        <h2 className={pageTitle()}>{club.name}</h2>
      </div>
      <div className="space-y-6">
        {club.description && (
          <section>
            <p>{club.description}</p>
          </section>
        )}
        <section>
          <h3 className={sectionTitle()}>Installations</h3>
          <ul className="space-y-1">
            {nbOutdoorCourts !== 0 && <li>{nbOutdoorCourts} courts extérieurs</li>}
            {nbIndoorCourts !== 0 && <li>{nbIndoorCourts} courts couverts</li>}
            {club.hasRestaurant && <li>Restauration sur place disponible</li>}
          </ul>
        </section>
        {club.opening_hours && (
          <section>
            <h3 className={sectionTitle()}>Horaires d'ouverture</h3>
            <div>
              {club.opening_hours.map((openingHours) => {
                return openingHours.days.map((day) => (
                  <div key={day.name} className="flex flex-row">
                    <div className="w-[150px]">{daysNames[day.name]} :</div>
                    <div>
                      {formatHour(openingHours.openingTime)} -{" "}
                      {formatHour(openingHours.closingTime)}
                    </div>
                  </div>
                ));
              })}
            </div>
          </section>
        )}
        <section>
          <h3 className={sectionTitle()}>Contact</h3>
          <ul className="space-y-2">
            <li>
              <AddressLink address={club.address} />
            </li>
            {club.contactEmail && (
              <li>
                <Link
                  isExternal
                  as={NextLink}
                  className="flex align-center gap-2"
                  href={`mailto:${club.contactEmail}`}
                >
                  <Mail size={16} />
                  {club.contactEmail}
                </Link>
              </li>
            )}
            {club.phoneNumber && (
              <li>
                <Link
                  isExternal
                  as={NextLink}
                  className="flex align-center gap-2"
                  href={`tel:${club.phoneNumber}`}
                >
                  <Phone size={16} />
                  {club.phoneNumber}
                </Link>
              </li>
            )}
            {club.instagramLink && (
              <li>
                <Link
                  isExternal
                  as={NextLink}
                  className="flex align-center gap-2"
                  href={club.instagramLink}
                >
                  <Smartphone size={16} />
                  Instagram
                </Link>
              </li>
            )}
            {club.website && (
              <li>
                <Link
                  isExternal
                  as={NextLink}
                  className="flex align-center gap-2"
                  href={club.website}
                >
                  <Globe size={16} />
                  {club.website}
                </Link>
              </li>
            )}
          </ul>
        </section>
        <section>
          <h3 className={sectionTitle()}>Les tournois au club</h3>
          <div className="w-full space-y-4">
            {tournaments.length ? (
              tournaments
                .sort((a, b) => (dayjs(b.startDate).isBefore(dayjs(a.startDate)) ? 1 : -1))
                .map((tournament) => (
                  <TournamentPreviewView key={tournament.documentId} tournament={tournament} />
                ))
            ) : (
              <>Pas de tournois</>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
