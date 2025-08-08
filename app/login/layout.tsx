import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Link } from "@heroui/link";

export default function LoginLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
  return (
    <div className="flex justify-center sm:py-10">
      <Card className="sm:p-5 w-full">
        <CardHeader className="flex gap-3">
          <h2>Se connecter</h2>
        </CardHeader>
        <CardBody className="">
          {children}
        </CardBody>
        <CardFooter className="text-small">
          Pas de compte ? <Link className="pl-2 text-small" href="/register">S'inscrire maintenant</Link>
        </CardFooter>
      </Card>
    </div>
  );
}
  