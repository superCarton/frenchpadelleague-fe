"use client";

import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { useRouter } from "next/navigation";

import { ClubUser } from "./clubUser";

import { Club } from "@/lib/interfaces";

export const ClubPreviewView = (props: { club: Club }) => {
  const router = useRouter();
  const { club } = props;

  return (
    <Card
      className="mx-auto rounded-sm shadow-sm hover:shadow-md transition overflow-hidden border border-gray-200 cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/clubs/${club.documentId}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(`/clubs/${club.documentId}`);
      }}
    >
      <CardBody className="flex flex-col sm:flex-row gap-3 py-3 items-center sm:items-center justify-center sm:justify-start">
        {/* Club info */}
        <div className="flex-1 w-full text-center sm:text-left">
          <ClubUser club={club} />
        </div>

        {/* Image */}
        <div className="flex-shrink-0">
          <Image
            alt={club.name ?? "Club"}
            className="object-cover rounded-xl"
            height={120}
            src={club.coverImage.url}
          />
        </div>
      </CardBody>
    </Card>
  );
};
