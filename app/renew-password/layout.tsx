import { subtitle, title } from "@/components/primitives";
import { Card, CardBody, CardHeader } from "@heroui/card";

export default function RenewPasswordLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Card>
          <CardHeader>Renouveler votre mot de passe</CardHeader>
          <CardBody>{children}</CardBody>
        </Card>
      </section>
    );
  }
  