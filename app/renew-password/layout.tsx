import { Card, CardBody, CardHeader } from "@heroui/card";

export default function RenewPasswordLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
<div className="flex justify-center sm:py-10">
<Card className="w-full sm:max-w-[500px] mx-auto py-5 sm:px-5">
  <CardHeader className="flex gap-3 text-lg font-semibold text-gray-80 border-b border-gray-200 pb-2 mb-4">
    <h2>Renouveler le mot de passe</h2>
  </CardHeader>
  <CardBody className="py-2">
    {children}
  </CardBody>
</Card>
</div>
    );
  }
  