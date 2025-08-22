import NextLink from "next/link";
import { Link } from "@heroui/link";
import { MapPin } from "lucide-react";

import { Address } from "@/lib/interfaces";

export default function AddressLink({
  address,
  className,
}: {
  address: Address;
  className?: string;
}) {
  const fullAddress = `${address.street}, ${address.zipcode} ${address.city}`;
  const encodedAddress = encodeURIComponent(fullAddress);

  return (
    <Link
      isExternal
      as={NextLink}
      className={`flex items-center gap-2 ${className}`}
      href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <MapPin size={16} />
      {fullAddress}
    </Link>
  );
}
