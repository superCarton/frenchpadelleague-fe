"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { RadioGroup, Radio } from "@heroui/radio";
import { Progress } from "@heroui/progress";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Image } from "@heroui/image";
import clsx from "clsx";
import { addToast } from "@heroui/toast";

import { SectionLoader } from "../common/sectionLoader";

import { questionnaire } from "@/config/levelQuestionnaire";
import { League } from "@/lib/interfaces";
import { updateMeElo } from "@/lib/api";
import { useUserStore } from "@/store/store";

export default function PlayerLevelQuiz({
  isOpen,
  onClose,
  onQuizzFinished,
}: {
  isOpen: boolean;
  onClose: () => void;
  onQuizzFinished: () => void;
}) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [resultLeague, setResultLeague] = useState<League | null>(null);
  const { token } = useUserStore();

  useEffect(() => {
    setAnswers({});
    setStep(0);
    setResultLeague(null);
    setLoading(false);
  }, [isOpen]);

  const currentQuestion = questionnaire[step];

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleNext = async () => {
    if (resultLeague) {
      onClose();
    } else if (step < questionnaire.length - 1) {
      setStep(step + 1);
    } else {
      setLoading(true);
      try {
        if (token) {
          const quizzTotalPoints = Object.values(answers).reduce((acc, val) => acc + val, 0);
          const { league } = await updateMeElo({ quizzTotalPoints }, token);
          setResultLeague(league);
          onQuizzFinished();
        }
      } catch (e: any) {
        addToast({
          title: "Une erreur est survenue lors de la finalisation du quizz",
          color: "danger",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const renderNewLeague = () => {
    if (!resultLeague) return null;
    const newElo = Math.ceil((resultLeague.maxElo + resultLeague.minElo) / 2);
    return (
      <div className="flex flex-col items-center gap-4">
        <Image
          alt={`Badge ${resultLeague.title}`}
          className="object-contain w-24 h-24"
          height={120}
          radius="none"
          src={resultLeague.badgeImage.url}
        />
        <div className="text-gray-500 text-sm">{resultLeague.title}</div>
        <div className="flex items-end justify-center gap-1 text-2xl font-bold text-gray-900">
          {newElo}
          <span className="text-sm text-gray-500 font-medium">Elo</span>
        </div>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} placement="center" size="lg" onClose={onClose}>
      <ModalContent>
        <ModalHeader>{!resultLeague ? "Ajuster mon niveau" : "Nouvelle ligue !"}</ModalHeader>
        <ModalBody>
          {!resultLeague ? (
            !loading ? (
              <>
                <h2 className="flex flex-row items-center gap-2">
                  Question {step + 1} / {questionnaire.length}
                  <Progress className="flex-1" value={(step / questionnaire.length) * 100} />
                </h2>

                <p className="my-2 text-gray-800 font-semibold">{currentQuestion.question}</p>

                <RadioGroup
                  value={answers[currentQuestion.id]?.toString() || "0"}
                  onValueChange={(val) =>
                    setAnswers({ ...answers, [currentQuestion.id]: parseInt(val) })
                  }
                >
                  {currentQuestion.options.map((opt) => (
                    <Radio key={opt.value} value={opt.value.toString()}>
                      <span className="ml-1 text-gray-700">{opt.label}</span>
                    </Radio>
                  ))}
                </RadioGroup>
              </>
            ) : (
              <SectionLoader label="Calcul de la nouvelle league" />
            )
          ) : (
            renderNewLeague()
          )}
        </ModalBody>

        <ModalFooter
          className={clsx("flex flex-row", {
            "justify-between": !resultLeague,
            "justify-center": resultLeague,
          })}
        >
          {!resultLeague && (
            <Button
              className="w-[150px]"
              color="primary"
              isDisabled={step < 1 || loading}
              variant="bordered"
              onPress={handlePrev}
            >
              Précédent
            </Button>
          )}
          <Button
            className="w-[150px]"
            color="primary"
            isDisabled={!answers[currentQuestion.id] || loading}
            variant="shadow"
            onPress={handleNext}
          >
            {!resultLeague
              ? step === questionnaire.length - 1
                ? "Terminer"
                : "Suivant"
              : "Fermer"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
