'use client';

import { title, subtitle } from "@/components/primitives";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center bg-black">
        <div className="">
          <h1 className={title()}>French Padel League</h1>
          <br />
          <div className={subtitle({ class: "mt-4 uppercase" })}>
            La plus grande ligue amateur de france
          </div>
          <div><Button color="primary" variant="bordered" onPress={() => router.push('/register')}>S'inscrire</Button></div>
        </div>
      </div>
      <div className="inline-block max-w-xl text-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
          <div className={subtitle({ class: "uppercase" })}>Qui sommes-nous ?</div>
          <div>La French Padel League est la première ligue 100 % amateur, ouverte à tous les passionnés.</div>
          <div>Notre mission ?</div>
          <div>Offrir aux joueurs une vraie structure compétitive, claire, équitable et indépendante de la FFT.</div>
          <div>Tournois par niveau, classement transparent, badges officiels : tout est pensé pour que chaque joueur, quel que soit son niveau, puisse progresser, se challenger et prendre du plaisir.</div>
          <div>Bienvenue dans une nouvelle façon de vivre le padel amateur.</div>
        </div>
      </div>
    </section>
  );
}
