"use client";

import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";
import { Tab, Tabs } from "@heroui/tabs";
import { AnimatePresence, motion } from "framer-motion";

import { sectionTitle } from "@/components/primitives";
import { League, Tournament } from "@/lib/interfaces";
import { getAllLeagues, getNextTournaments } from "@/lib/api";
import { TournamentPreviewView } from "@/components/tournament/tournamentPreview";
import { useUserStore } from "@/store/store";

export default function Home() {
  const router = useRouter();
  const [loadingNextTournamenents, setLoadingNextTournaments] = useState(true);
  const [nextTournaments, setNextTournaments] = useState<Tournament[]>([]);
  const [loadingLeagues, setLoadingLeagues] = useState(true);
  const [leagues, setLeagues] = useState<League[]>([]);
  const { profile } = useUserStore();

  useEffect(() => {
    async function fetchTournaments() {
      try {
        const { data } = await getNextTournaments();

        setNextTournaments(data);
      } catch (err: any) {
      } finally {
        setLoadingNextTournaments(false);
      }
    }

    fetchTournaments();
  }, []);

  useEffect(() => {
    async function fetchLeagues() {
      try {
        const { data } = await getAllLeagues();

        setLeagues(data);
      } catch (err: any) {
      } finally {
        setLoadingLeagues(false);
      }
    }

    fetchLeagues();
  }, []);

  return (
    <div className="flex flex-col w-full">
      <section className="relative bg-black text-white py-20 px-6 w-full">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-7xl mx-auto">
          <Image
            alt="French Padel League Logo"
            className="rounded-xl p-4 shadow-lg"
            src="/logo-black-with-title.jpeg"
            width={500}
          />
        </div>
        <p className="mt-6 text-lg md:text-xl text-gray-300 uppercase tracking-wide text-center">
          La plus grande ligue amateur de France
        </p>
        {!profile && (
          <div className="flex justify-center mt-10">
            <Button
              className="px-10 py-4 text-xl shadow-lg hover:scale-105 transition-transform"
              color="primary"
              variant="solid"
              onPress={() => router.push("/register")}
            >
              S'inscrire
            </Button>
          </div>
        )}
      </section>

      <section className="bg-white py-16 px-4 w-full">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className={sectionTitle()}>Qui sommes-nous ?</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              La French Padel League est la première ligue 100 % amateur, ouverte à tous les
              passionnés.
            </p>
            <p>
              Notre mission ? Offrir aux joueurs une vraie structure compétitive, claire, équitable
              et indépendante de la FFT.
            </p>
            <p>
              Tournois par niveau, classement transparent, badges officiels : tout est pensé pour
              que chaque joueur, quel que soit son niveau, puisse progresser, se challenger et
              prendre du plaisir.
            </p>
            <p className="font-medium">
              Bienvenue dans une nouvelle façon de vivre le padel amateur.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4 w-full">
        <div className="max-w-7xl mx-auto">
          <h2 className={sectionTitle()}>Nos Catégories</h2>
          <div>
            {loadingLeagues ? (
              <Spinner size="lg" />
            ) : (
              <Tabs
                disableAnimation
                aria-label="Options"
                color="primary"
                radius="full"
                size="md"
                variant="bordered"
              >
                {[
                  { type: "male", label: "Messieurs" },
                  { type: "female", label: "Dames" },
                ].map((gender) => (
                  <Tab key={gender.type} title={<div className="min-w-[80px]">{gender.label}</div>}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={gender.type}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        initial={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 max-w-6xl mx-auto text-center mt-4">
                          {leagues
                            .filter((l) => l.gender == gender.type)
                            .map((league) => (
                              <div key={league.documentId} className="flex flex-col items-center">
                                <Image
                                  alt={league.description}
                                  className="mb-4"
                                  height={153}
                                  src={league.badgeImage.url}
                                  width={100}
                                />
                                <span className="text-sm text-gray-700">{league.description}</span>
                              </div>
                            ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </Tab>
                ))}
              </Tabs>
            )}
          </div>

          <div className="text-center mt-10 max-w-3xl mx-auto text-gray-700">
            <p>
              Chaque joueur s’inscrit dans la catégorie correspondant à son niveau de jeu. Des
              critères de montée et de descente encadrent l’évolution entre les catégories, afin de
              garantir des confrontations équilibrées.
            </p>
            <Button
              className="mt-6 px-8 py-3"
              color="primary"
              onPress={() => router.push("/test-level")}
            >
              Tester son niveau
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 px-4 w-full">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className={sectionTitle()}>Les compétitions</h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-6">
            Des tournois sont organisés dans toute la France, toute l’année, pour permettre à chaque
            joueur de participer au plus proche de chez lui.
          </p>
          <p className="text-gray-700 max-w-3xl mx-auto mb-8">
            En plus des étapes régulières, la French Padel League propose des événements majeurs
            pour valoriser les performances et rassembler la communauté amateur autour de
            rendez-vous clés.
          </p>
          <Button color="primary" onPress={() => router.push("/tournaments")}>
            Rechercher une compétition
          </Button>
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4 w-full">
        <div className="max-w-2xl mx-auto">
          <h2 className={sectionTitle()}>Prochains tournois</h2>
          <div className="max-w-6xl mx-auto space-y-2">
            {loadingNextTournamenents ? (
              <Spinner size="lg" />
            ) : (
              nextTournaments.map((t) => (
                <TournamentPreviewView key={t.documentId} tournament={t} />
              ))
            )}
          </div>
          <div className="mx-auto mt-4 text-center">
            <Button color="primary" onPress={() => router.push("/tournaments")}>
              Voir tous les tournois
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
