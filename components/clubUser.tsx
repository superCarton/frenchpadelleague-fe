"use client";
import { User } from "@heroui/user";
import { useRouter } from "next/navigation";

import { Club } from "@/lib/interfaces";

export const ClubUser = (props: { club: Club }) => {
  const { club } = props;
  const router = useRouter();

  return (
    <User
      avatarProps={{
        src: "/clubs/logo-acacias.png",
        isBordered: true,
      }}
      className="cursor-pointer"
      description={club.address ? <div className="text-gray-600">{club.address.city}</div> : null}
      name={<div className="text-bold text-gray-900">{club.name}</div>}
      onClick={() => router.push(`/clubs/${club.documentId}`)}
    />
  );
};
