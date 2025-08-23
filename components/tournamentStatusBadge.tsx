import React from "react";
import { Clock, UserPlus, CheckCircle, Play, XCircle, Flag, CheckCheck } from "lucide-react";
import { Chip } from "@heroui/chip";

import { TournamentStatus } from "@/lib/interfaces";

interface TournamentStatusBadgeProps {
  status: TournamentStatus;
}

const statusMap: Record<
  TournamentStatus,
  {
    label: string;
    color: "default" | "success" | "warning" | "danger" | "primary" | "secondary";
    icon: React.ElementType;
  }
> = {
  "pending-validation": {
    label: "En cours de validation",
    color: "warning",
    icon: Clock,
  },
  validated: {
    label: "Validé",
    color: "success",
    icon: CheckCheck,
  },
  "registrations-opened": {
    label: "Inscriptions ouvertes",
    color: "success",
    icon: UserPlus,
  },
  "registrations-closed": {
    label: "Inscriptions terminées",
    color: "warning",
    icon: CheckCircle,
  },
  started: {
    label: "En cours",
    color: "secondary",
    icon: Play,
  },
  cancelled: {
    label: "Annulé",
    color: "danger",
    icon: XCircle,
  },
  completed: {
    label: "Terminé",
    color: "default",
    icon: Flag,
  },
};

const TournamentStatusBadge: React.FC<TournamentStatusBadgeProps> = ({
  status,
}: {
  status: TournamentStatus;
}) => {
  const statusEl = statusMap[status];
  const Icon = statusEl.icon;

  return (
    <Chip color={statusEl.color} startContent={<Icon className="ml-2" size={16} />}>
      {statusEl.label}
    </Chip>
  );
};

export default TournamentStatusBadge;
