import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";
import NextLink from "next/link";

export default function UnSubscribeNewsletterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center sm:py-10">
      <Card className="w-full sm:w-xl mx-auto py-5 sm:px-5">
        <CardHeader className="flex gap-3 text-lg font-semibold text-gray-80 border-b border-gray-200 pb-2 mb-4">
          <h2>Mot de passe oublié</h2>
        </CardHeader>
        <CardBody className="py-2">{children}</CardBody>
        <CardFooter className="text-small">
          <Link as={NextLink} className="pl-2 text-small" href="/login">
            Se connecter
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
