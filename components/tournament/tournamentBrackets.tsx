"use client";

import { useState } from "react";
import { Link } from "@heroui/link";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

import MatchComponent from "../matchComponent";

import { Match, TournamentRound } from "@/lib/interfaces";
import { roundNames } from "@/lib/helpers";

export default function TournamentBracket({
  matches,
  rounds,
  defaultRound,
}: {
  matches: Match[];
  rounds: TournamentRound[];
  defaultRound: TournamentRound;
}) {
  const [currentRound, setCurrentRound] = useState<TournamentRound>(defaultRound);
  const [direction, setDirection] = useState<"prev" | "next">("next");

  const getNextRound = (): TournamentRound | null => {
    const idx = rounds.indexOf(currentRound);

    if (idx < rounds.length - 1) {
      return rounds[idx + 1];
    }

    return null;
  };

  const goPrev = () => {
    const idx = rounds.indexOf(currentRound);

    setDirection("prev");

    if (idx > 0) {
      setCurrentRound(rounds[idx - 1]);
    }
  };

  const goNext = () => {
    const idx = rounds.indexOf(currentRound);

    setDirection("next");

    if (idx < rounds.length - 1) {
      setCurrentRound(rounds[idx + 1]);
    }
  };

  const nextRound = getNextRound();
  const currentRoundMatches = matches.filter((m) => m.round === currentRound);
  const gapSize = 4;
  const matchHeight = 91;
  const tableHeight =
    currentRoundMatches.length * matchHeight +
    (currentRoundMatches.length - 1) * 2 * gapSize + // gap between matches
    20 + // title size
    2 * gapSize; // gap between title and matches

  const animationVariants = {
    enter: (direction: "next" | "prev") => ({
      x: direction === "next" ? "100%" : "-100%",
    }),
    center: {
      x: 0,
    },
    exit: (direction: "next" | "prev") => ({
      x: direction === "next" ? "-100%" : "100%",
    }),
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Navigation */}
      <div className="flex justify-between mb-4">
        <Link className="cursor-pointer" isDisabled={currentRound === "quarter"} onClick={goPrev}>
          ← Tour précédent
        </Link>
        <Link className="cursor-pointer" isDisabled={currentRound === "final"} onClick={goNext}>
          Tour suivant →
        </Link>
      </div>
      <motion.div
        animate={{ height: tableHeight }}
        className="relative"
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={currentRound}
            animate="center"
            className="absolute top-0 left-0 w-full flex flex-row gap-16"
            custom={direction}
            exit="exit"
            initial="enter"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            variants={animationVariants}
          >
            <div className="flex flex-col flex-1 gap-2 justify-center relative">
              <div className="text-small text-gray-400 uppercase text-center">
                {roundNames[currentRound]}
              </div>

              <div className="flex flex-col flex-1 gap-2">
                {currentRoundMatches.map((m, i) => (
                  <div key={m.id} className="relative">
                    <MatchComponent match={m} />
                    {nextRound && (
                      <>
                        <div className="absolute -right-8 top-1/2 w-8 h-px bg-gray-400" />

                        <div
                          className={clsx("absolute -right-8 h-full w-px bg-gray-400", {
                            "top-1/2": i % 2 === 0,
                            "bottom-1/2": i % 2 !== 0,
                          })}
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {nextRound && (
              <div className="flex flex-col flex-1 gap-2">
                <div className="text-small text-gray-400 uppercase text-center">
                  {roundNames[nextRound]}
                </div>

                {/* On espace les matchs du next round de la hauteur d'une paire (≈ 2 matchs + gap) */}
                <div className="flex flex-col flex-1 justify-center gap-[110px]">
                  {matches
                    .filter((m) => m.round === nextRound)
                    .map((m) => (
                      <div key={m.id} className="relative">
                        <MatchComponent key={m.id} showTournamentSeeds match={m} />
                        <div className="absolute -left-8 top-1/2 w-8 h-px bg-gray-400" />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
