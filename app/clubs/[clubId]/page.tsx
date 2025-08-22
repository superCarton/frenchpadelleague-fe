import { Image } from "@heroui/image";
import { Avatar } from "@heroui/avatar";
import { Link } from "@heroui/link";
import NextLink from "next/link";
import { Globe, Mail, Phone, Smartphone } from "lucide-react";

import { getClubById } from "@/lib/api";
import { sectionTitle } from "@/components/primitives";
import AddressLink from "@/components/addressLink";

export const revalidate = 120; // ISR
export const dynamic = "force-dynamic"; // prevent pre-render at first build

type ClubPageProps = {
  params: Promise<{ clubId: string }>;
};

export default async function ClubPage({ params }: ClubPageProps) {
  const { clubId } = await params;
  const { data: club } = await getClubById(clubId);

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
        <h2 className={sectionTitle()}>{club.name}</h2>
      </div>
      <div className="space-y-6">
        {club.description && (
          <section>
            <p>{club.description}</p>
          </section>
        )}
        <section>
          <h3 className={sectionTitle()}>Installations</h3>
          <ul className="space-y-2">
            <li>Nombre de courts : {club.totalCourts}</li>
            {club.hasRestaurant && <li>Restauration sur place disponible</li>}
          </ul>
        </section>
        <section>
          <h3 className={sectionTitle()}>Horaires d'ouverture</h3>
          <div />
        </section>
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
      </div>
    </div>
  );
}
