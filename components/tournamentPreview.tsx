import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";

import { DateComponent } from "./dateComponent";

import { Tournament } from "@/lib/interfaces";

export const TournamentPreviewView = (props: { tournament: Tournament }) => {
  const { tournament } = props;

  return (
    <div className="flex items-center space-x-4">
      <Card>
        <CardHeader>
          <Link href={`/tournaments/${tournament.documentId}`}>{tournament.name}</Link>
        </CardHeader>
        <CardBody>{tournament.club.name}</CardBody>
        <CardFooter>
          <DateComponent withDay date={tournament.startDate} />
        </CardFooter>
      </Card>
    </div>
  );
};
