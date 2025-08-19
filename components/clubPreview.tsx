import { Card, CardBody, CardHeader } from "@heroui/card";
import { Image } from "@heroui/image";

import { ClubUser } from "./clubUser";

import { Club } from "@/lib/interfaces";

export const ClubPreviewView = (props: { club: Club }) => {
  const { club } = props;

  return (
    <Card className="py-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <ClubUser club={club} />
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src="/clubs/bg-acacias.png"
          width={270}
        />
      </CardBody>
    </Card>
  );
};
