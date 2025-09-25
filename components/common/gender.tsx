import { Mars, Venus, VenusAndMars } from "lucide-react";
import clsx from "clsx";

import { TournamentGender } from "@/lib/interfaces";

export default function Gender({
  gender,
  className,
  iconOnly = false,
}: {
  gender: TournamentGender;
  iconOnly?: boolean;
  className?: string;
}) {
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      {gender === "male" && (
        <>
          <Mars size={16} />
          {!iconOnly && "Messieurs"}
        </>
      )}
      {gender === "female" && (
        <>
          <Venus size={16} />
          Dames
        </>
      )}
      {gender === "mixed" && (
        <>
          <VenusAndMars size={16} />
          Mixte
        </>
      )}
    </div>
  );
}
