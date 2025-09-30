"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Form } from "@heroui/form";
import { addToast } from "@heroui/toast";
import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { DatePicker } from "@heroui/date-picker";
import { Radio, RadioGroup } from "@heroui/radio";

import { siteConfig } from "@/config/site";
import { createPlayer, getMePlayer } from "@/lib/api";
import { useUserStore } from "@/store/store";
import { PasswordInput } from "@/components/common/passwordInput";

const translateErrorMessageToFr = (message: string) => {
  let messageFR = message;

  if (message.includes("Invalid identifier or password")) {
    messageFR = "Identifiants incorrects.";
  } else if (message.includes("Email or Username are already taken")) {
    messageFR = "Cet email est déjà utilisé.";
  } else if (message.includes("password is too short")) {
    messageFR = "Mot de passe trop court.";
  }

  return messageFR;
};

export default function RegisterPage() {
  const router = useRouter();
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const { setToken, setProfile } = useUserStore();

  const handleRegister = async (e: any) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    setLoading(true);

    try {
      const { jwt } = await createPlayer({
        email: data.email.toString(),
        password: data.password.toString(),
        firstname: data.firstname.toString(),
        lastname: data.lastname.toString(),
        birthdate: data.birthdate.toString(),
        gender: data.gender.toString(),
        phoneNumber: data.phoneNumber ? data.phoneNumber.toString().replace(/\s+/g, "") : undefined,
      });

      setToken(jwt);
      const profile = await getMePlayer(jwt);

      setProfile(profile);
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
      addToast({
        title: "Inscription réussie",
        description: "Un email de confirmation vient de t'être envoyé",
        color: "success",
      });
      router.push(`/players/${profile.documentId}`);
    } catch (err: any) {
      let description;

      if (err && err.message) {
        description = translateErrorMessageToFr(err.message);
      }
      addToast({
        title: "Une erreur est survenue lors de l'inscription",
        description,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form onSubmit={handleRegister}>
        <RadioGroup
          isRequired
          className="mb-1"
          errorMessage="Veuillez sélectionner votre genre"
          label={<span className="text-small">Vous êtes</span>}
          name="gender"
          orientation="horizontal"
          size="sm"
        >
          <Radio size="sm" value="male">
            Un homme
          </Radio>
          <Radio className="mr-1" size="sm" value="female">
            Une femme
          </Radio>
        </RadioGroup>
        <Input
          isRequired
          autoComplete="given-name"
          errorMessage="Veuillez entrer votre prénom"
          label="Prénom"
          labelPlacement="outside"
          name="firstname"
          placeholder="Prénom"
          type="text"
        />
        <Input
          isRequired
          autoComplete="family-name"
          errorMessage="Veuillez entrer votre nom"
          label="Nom"
          labelPlacement="outside"
          name="lastname"
          placeholder="Nom"
          type="text"
        />
        <DatePicker
          isRequired
          autoComplete="bday"
          className="w-full max-w-full"
          errorMessage="Veuillez entrer une date valide"
          label="Date de naissance"
          labelPlacement="outside"
          maxValue={today(getLocalTimeZone()).subtract({ years: 10 })}
          minValue={today(getLocalTimeZone()).subtract({ years: 100 })}
          name="birthdate"
          placeholderValue={new CalendarDate(1993, 3, 10)}
        />
        <Input
          isRequired
          autoComplete="email"
          errorMessage="Veuillez entrer un email valide"
          label="Email"
          labelPlacement="outside"
          name="email"
          placeholder="ton@adresse.email"
          type="email"
        />
        <Input
          autoComplete="tel"
          errorMessage="Veuillez entrer un numéro de téléphone valide"
          label="Téléphone"
          labelPlacement="outside"
          name="phoneNumber"
          placeholder="+33 6 00 00 00 00"
          type="tel"
          validate={(value) => {
            if (!value) return true;
            const digits = value.replace(/\s+/g, "");
            if (!/^\+?[0-9]{6,15}$/.test(digits)) {
              return "Veuillez entrer un numéro de téléphone valide";
            }
            return true;
          }}
        />
        <PasswordInput
          ref={passwordRef}
          isRequired
          autoComplete="new-password"
          label="Mot de passe"
          labelPlacement="outside"
          name="password"
          placeholder="••••••••"
          validate={(value) => {
            if (!siteConfig.passwordRegex.test(value)) {
              return "Le mot de passe doit contenir au minimum 8 caractères, dont 1 lettre, 1 chiffre et 1 caractère spécial";
            }

            return true;
          }}
        />
        <PasswordInput
          isRequired
          autoComplete="new-password"
          errorMessage="La confirmation doit être identique au mot de passe"
          label="Confirmation du mot de passe"
          labelPlacement="outside"
          name="confirm-password"
          placeholder="••••••••"
          validate={(value) => {
            const password = passwordRef.current?.value || "";

            if (value !== password) {
              return "La confirmation doit être identique au mot de passe";
            }

            return true;
          }}
        />
        <Button
          className="mt-2 self-center w-full"
          color="primary"
          isLoading={loading}
          type="submit"
          variant="solid"
        >
          S'inscrire
        </Button>
      </Form>
    </div>
  );
}
