type StrapiDocument = { documentId: string };

export type WithStrapiMeta<A> = {
  data: A;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export interface Address {
  street: string;
  streetComplement?: string;
  city: string;
  zipcode: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface League extends StrapiDocument {
  badge: "bronze" | "silver" | "gold" | "premium" | "legend";
  description: string;
  title: string;
  minElo: number;
  maxElo: number;
}

export interface User extends StrapiDocument {
  username: string;
  email: string;
}

export interface Player extends StrapiDocument {
  firstname: string;
  lastname: string;
  birthdate: string;
  elo: number;
  league?: League;
  user: User;
  club?: Club;
  matchesHistory: Match[];
}

export interface Club extends StrapiDocument {
  user: User;
  name: string;
  address: Address;
  totalCourts: number;
  contactEmail: string;
  hasRestaurant: boolean;
  phoneNumber?: string;
  description?: string;
  players: Player[];
  tournaments: Tournament[];
}

export interface Referee extends StrapiDocument {
  user: User;
}

export interface Match extends StrapiDocument {
  players1: [Player, Player];
  players2: [Player, Player];
  date: string;
  score?: Text;
  winner?: number;
  tournament: Tournament;
}

export type TournamentStatus = "pending" | "validated" | "started" | "completed" | "cancelled";

export interface Tournament extends StrapiDocument {
  documentId: string;
  startDate: string;
  endDate: string;
  currentStatus: TournamentStatus;
  league: League;
  club: Club;
  referee: Referee;
  address: Address;
  matches: Match[];
  name?: string;
  registrationDeadline?: string;
  description?: string;
  prizeMoney?: number;
  allocatedCourts: number;
  registrationFee?: number;
  maxTeams?: number;
  gameFormat?: string;
}
