import React from "react";
import {
  Clock,
  UserPlus,
  CheckCircle,
  Play,
  XCircle,
  Flag
} from "lucide-react";
import { TournamentStatus } from "@/lib/interfaces";

interface TournamentStatusBadgeProps {
  status: TournamentStatus;
}

const statusMap: Record<TournamentStatus, { label: string; color: string; icon: React.ElementType }> = {
  "pending-validation": {
    label: "En cours de validation",
    color: "bg-orange-100 text-orange-800",
    icon: Clock,
  },
  "validated": {
    label: "Inscriptions ouvertes",
    color: "bg-green-100 text-green-800",
    icon: UserPlus,
  },
  "registrations-opened": {
    label: "Inscriptions ouvertes",
    color: "bg-green-100 text-green-800",
    icon: UserPlus,
  },
  "registrations-closed": {
    label: "Inscriptions terminées",
    color: "bg-yellow-100 text-yellow-800",
    icon: CheckCircle,
  },
  "started": {
    label: "En cours",
    color: "bg-indigo-100 text-indigo-800",
    icon: Play,
  },
  "cancelled": {
    label: "Annulé",
    color: "bg-red-100 text-red-800",
    icon: XCircle,
  },
  "completed": {
    label: "Terminé",
    color: "bg-gray-100 text-gray-800",
    icon: Flag,
  },

};

const TournamentStatusBadge: React.FC<TournamentStatusBadgeProps> = ({ status }: { status: TournamentStatus }) => {
  const statusEl = statusMap[status];
  const Icon = statusEl.icon;

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusEl.color}`}
    >
      <Icon className="w-4 h-4 mr-1" />
      {statusEl.label}
    </span>
  );
};

export default TournamentStatusBadge;
