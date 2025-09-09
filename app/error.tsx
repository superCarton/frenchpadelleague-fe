"use client";

import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { useRouter } from "next/navigation";

import { getPrettyErrorMessage } from "@/lib/helpers";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      {/* Titre */}
      <h1 className="text-6xl font-extrabold text-red-600">500</h1>
      <p className="mt-2 text-xl text-gray-700">Oups… une erreur est survenue</p>
      {error && error.message && (
        <p className="mt-2 text-lg text-gray-500">{getPrettyErrorMessage(error.message)}</p>
      )}

      {/* Illustration padel */}
      <div className="relative mt-8 w-64 h-32">
        {/* Terrain horizontal */}
        <div className="absolute inset-0 border-4 border-primary rounded-md" />

        {/* Filet */}
        <div className="absolute left-1/2 top-0 bottom-0 border-l-4 border-dashed border-primary" />

        {/* Balle coincée dans le filet */}
        <div className="absolute w-10 h-10 bg-red-500 rounded-full shadow-lg left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>

      {/* Message & bouton */}
      <p className="mt-6 mb-4">
        <Link className="text-lg cursor-pointer" onPress={() => reset()}>
          Réessayer
        </Link>
        .
      </p>
      <Button color="primary" onPress={() => router.push("/")}>
        Retourner à l'accueil
      </Button>
    </div>
  );
}
