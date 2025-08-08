import { subtitle, title } from "@/components/primitives";
import { Card, CardBody, CardHeader } from "@heroui/card";

export default function UnSubscribeNewsletterLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <Card>
        <CardHeader>Mot de passe oublié</CardHeader>
        <CardBody>{children}</CardBody>
      </Card>
    );
  }
  