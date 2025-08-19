import Link from "next/link";

import { Address } from "@/lib/interfaces";

export default function AddressLink({ address }: { address: Address }) {
  const fullAddress = `${address.street}, ${address.zipcode} ${address.city}`;
  const encodedAddress = encodeURIComponent(fullAddress);

  return (
    <Link
      className="flex items-center gap-2"
      href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      {fullAddress}
    </Link>
  );
}
