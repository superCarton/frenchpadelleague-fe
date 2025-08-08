import { Card, CardBody, CardHeader } from "@heroui/card";

export default function LoginLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        Se connecter
      </CardHeader>
      <CardBody className="">
        {children}
      </CardBody>
    </Card>
  );
}
  