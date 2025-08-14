import { Link } from "@heroui/react";
import { MapPin } from "lucide-react";

import { Address } from "@/lib/interfaces";

export default function AddressLink({ address }: { address: Address }) {
  const fullAddress = `${address.street}, ${address.zipcode} ${address.city}`;
  const encodedAddress = encodeURIComponent(fullAddress);

  return (
    <Link
      isExternal
      className="flex items-center gap-2"
      color="primary"
      href={`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`}
      rel="noopener noreferrer"
      target="_blank"
      underline="always"
    >
      <MapPin className="text-primary" size={18} />
      {fullAddress}
    </Link>
  );
}
