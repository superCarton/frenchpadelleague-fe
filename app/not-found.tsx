"use client";

import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      {/* Titre */}
      <h1 className="text-6xl font-extrabold text-primary">404</h1>
      <p className="mt-2 text-xl text-gray-700">Oups… la balle est sortie du terrain</p>

      {/* Illustration padel */}
      <div className="relative mt-8 w-64 h-32">
        {/* Terrain (horizontal) */}
        <div className="absolute inset-0 border-4 border-primary rounded-md" />

        {/* Filet (au milieu du terrain horizontal) */}
        <div className="absolute left-1/2 top-0 bottom-0 border-l-4 border-dashed border-primary" />

        {/* Balle (placée hors du terrain en haut à droite) */}
        <div className="absolute w-8 h-8 bg-primary rounded-full shadow-lg animate-bounce -right-6 -top-6" />
      </div>

      {/* Message & bouton */}
      <p className="mt-6 mb-4 text-lg text-gray-600">
        La page que vous cherchez est <span className="font-semibold">hors limites</span>.
      </p>
      <Button color="primary" onPress={() => router.push("/")}>
        Retourner à l'accueil
      </Button>
    </div>
  );
}
