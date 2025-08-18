"use client";
import { User } from "@heroui/user";

import { Club } from "@/lib/interfaces";
import { useRouter } from "next/navigation";

export const ClubUser = (props: { club: Club }) => {
  const { club } = props;
  const router = useRouter();
  return (
    <User
        avatarProps={{
          src: "/clubs/logo-acacias.png",
          isBordered: true,
        }}
        name={<div className="text-bold text-gray-900">{club.name}</div>}
        description={club.address ? <div className="text-gray-600">{club.address.city}</div> : null}
        onClick={() => router.push(`/clubs/${club.documentId}`)}
        className="cursor-pointer"
      />
  );
};
