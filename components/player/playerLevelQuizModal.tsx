"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/button";
import { RadioGroup, Radio } from "@heroui/radio";
import { Progress } from "@heroui/progress";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Image } from "@heroui/image";
import { addToast } from "@heroui/toast";
import { Form } from "@heroui/form";
import { Alert } from "@heroui/alert";
import { Input } from "@heroui/input";

import { SectionLoader } from "../common/sectionLoader";

import { questionnaire } from "@/config/levelQuestionnaire";
import { League } from "@/lib/interfaces";
import { selfEvaluation } from "@/lib/api";
import { useUserStore } from "@/store/store";

export default function PlayerLevelQuizModal({
  isOpen,
  onClose,
  onQuizFinished,
}: {
  isOpen: boolean;
  onClose: () => void;
  onQuizFinished: () => void;
}) {
  const [mode, setMode] = useState<"choice" | "fft" | "quiz" | "done">("choice");
  const [preselectedMode, setPreselectedMode] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [resultLeague, setResultLeague] = useState<League | null>(null);
  const { token } = useUserStore();

  useEffect(() => {
    setMode("choice");
    setAnswers({});
    setStep(0);
    setResultLeague(null);
    setLoading(false);
  }, [isOpen]);

  const currentQuestion = questionnaire[step];

  const handleChoice = (e: any) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setMode(data.mode as any);
  };

  const handleFinishFft = async (e: any) => {
    e.preventDefault();
    const { fftPadelRank, fftLicenceNumber } = Object.fromEntries(new FormData(e.currentTarget));
    if (!fftPadelRank || !fftLicenceNumber || !token) return;
    try {
      setLoading(true);
      const { league } = await selfEvaluation(
        {
          fftPadelRank: parseInt(fftPadelRank.toString()),
          fftLicenceNumber: fftLicenceNumber.toString(),
        },
        token
      );
      setResultLeague(league);
      setMode("done");
      onQuizFinished();
    } catch {
      addToast({
        title: "Erreur lors de l'enregistrement du classement FFT",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFinishQuiz = async () => {
    setLoading(true);
    try {
      if (token) {
        const quizScore = Object.values(answers).reduce((acc, val) => acc + val, 0);
        const { league } = await selfEvaluation({ quizScore }, token);
        setResultLeague(league);
        setMode("done");
        onQuizFinished();
      }
    } catch {
      addToast({
        title: "Une erreur est survenue lors de la finalisation du quiz",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderChoice = () => {
    return (
      <Form onSubmit={handleChoice}>
        <div className="flex flex-col gap-4">
          <RadioGroup
            isRequired
            description="L'auto-évaluation de niveau ne peut être faite qu'une seule fois"
            errorMessage="Veuillez sélectionner une option"
            name="mode"
            title="Choisir une option"
            onValueChange={setPreselectedMode}
          >
            <Radio
              className="gap-1"
              description="Munis toi de ton numéro de license et de ton dernier classement connu"
              value="fft"
            >
              J'ai déjà un classement padel FFT
            </Radio>
            <Radio
              className="gap-1"
              description="Tu vas répondre à une série de questions pour déterminer ton niveau de padel"
              value="quiz"
            >
              Je n'ai pas de classement padel FFT
            </Radio>
          </RadioGroup>
          {preselectedMode === "quiz" && (
            <Alert color="warning" variant="bordered">
              Attention, les top ligues Premium et Legend pour les messieurs, Rubis et Diamant pour
              les dames sont réservées aux joueurs possédant déjà un très bon classement padel FFT.
              Rien ne t'empêchera d'y accéder après tes bonnes performances FPL, mais il faudra
              faire tes preuves 😘
            </Alert>
          )}
          <Button className="mb-2" color="primary" type="submit">
            Continuer
          </Button>
        </div>
      </Form>
    );
  };

  const renderFft = () => {
    return (
      <Form onSubmit={handleFinishFft}>
        <Input
          isRequired
          className="mb-2"
          errorMessage="Veuillez entrer votre dernier classement padel FFT. Il doit être compris entre 1 et 100000"
          label="Dernier classement padel FFT"
          labelPlacement="outside"
          max={100000}
          min={1}
          name="fftPadelRank"
          placeholder="Dernier classement padel FFT"
          type="number"
        />
        <Input
          isRequired
          errorMessage="Veuillez entrer votre numéro de licence FFT"
          label="Numéro de licence FFT"
          labelPlacement="outside"
          name="fftLicenceNumber"
          placeholder="Numéro de licence FFT"
        />
        <div className="flex flex-row w-full justify-between mt-4 mb-2">
          <Button className="w-[150px]" onPress={() => setMode("choice")}>
            Précédent
          </Button>
          <Button className="w-[150px]" color="primary" type="submit">
            Terminer
          </Button>
        </div>
      </Form>
    );
  };

  const renderQuiz = () => (
    <>
      <h2 className="flex flex-row items-center gap-2">
        Question {step + 1} / {questionnaire.length}
        <Progress
          className="flex-1"
          value={
            ((step + (typeof answers[currentQuestion.id] !== "undefined" ? 1 : 0)) /
              questionnaire.length) *
            100
          }
        />
      </h2>
      <p className="my-2 text-gray-800 font-semibold">{currentQuestion.question}</p>
      <RadioGroup
        value={answers[currentQuestion.id]?.toString() || "0"}
        onValueChange={(val) => setAnswers({ ...answers, [currentQuestion.id]: parseInt(val) })}
      >
        {currentQuestion.options.map((opt) => (
          <Radio key={opt.value} value={opt.value.toString()}>
            <span className="ml-1 text-gray-700">{opt.label}</span>
          </Radio>
        ))}
      </RadioGroup>
      <div className="flex justify-between mt-4 mb-2">
        <Button
          className="w-[150px]"
          onPress={() => (step > 0 ? setStep((s) => s - 1) : setMode("choice"))}
        >
          Précédent
        </Button>
        <Button
          className="w-[150px]"
          color="primary"
          isDisabled={!answers[currentQuestion.id]}
          onPress={() =>
            step === questionnaire.length - 1 ? handleFinishQuiz() : setStep(step + 1)
          }
        >
          {step === questionnaire.length - 1 ? "Terminer" : "Suivant"}
        </Button>
      </div>
    </>
  );

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
        <ModalHeader>
          {mode !== "done" && "Ajuster mon niveau"}
          {mode === "done" && "Nouvelle ligue !"}
        </ModalHeader>
        <ModalBody>
          {loading ? (
            <SectionLoader label="Calcul de la nouvelle ligue" />
          ) : mode === "choice" ? (
            renderChoice()
          ) : mode === "fft" ? (
            renderFft()
          ) : mode === "quiz" ? (
            renderQuiz()
          ) : (
            renderNewLeague()
          )}
        </ModalBody>
        {mode === "done" && (
          <ModalFooter className="justify-center">
            <Button color="primary" onPress={onClose}>
              Fermer
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
