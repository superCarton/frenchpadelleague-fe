'use client';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { createPlayer } from "@/lib/api";
import { Form } from '@heroui/form';
import { addToast } from '@heroui/toast';
import { DateInput } from "@heroui/date-input";
import { CalendarDate } from '@internationalized/date';
import { siteConfig } from '@/config/site';

const translateErrorMessageToFr = (message: string) => {
  let messageFR = message;
  if (message.includes('Invalid identifier or password')) {
    messageFR = 'Identifiants incorrects.';
  } else if (message.includes('Email or Username are already taken')) {
    messageFR = 'Cet email est déjà utilisé.';
  } else if (message.includes('password is too short')) {
    messageFR = 'Mot de passe trop court.';
  }
  return messageFR;
};

export default function RegisterPage() {
  const router = useRouter();
  const passwordRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: any) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));
    setLoading(true);

    try {
      await createPlayer({
        email: data.email.toString(), 
        password: data.password.toString(),
        firstname: data.firstname.toString(),
        lastname: data.lastname.toString(),
        birthdate: data.birthdate.toString()
      });
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
      addToast({
        title: "Inscription réussie ✅",
        description: "Un email de confirmation vient de t'être envoyé",
        color: "success"
      });
      router.push('/profile');
    } catch (err: any) {
      let description;
      if (err && err.message) {
        description = translateErrorMessageToFr(err.message)
      }
      addToast({
        title: "Une erreur est survenue lors de l'inscription",
        description,
        color: "danger"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form 
        className="" 
        onSubmit={handleRegister}
      >
        <Input
          isRequired
          type="text"
          name="firstname"
          label="Prénom"
          errorMessage="Veuillez entrer votre prénom"
          placeholder="Prénom"
          labelPlacement="outside"
        />
        <Input
          isRequired
          type="text"
          name="lastname"
          label="Nom"
          errorMessage="Veuillez entrer votre nom"
          placeholder="Nom"
          labelPlacement="outside"
        />
        <DateInput
          isRequired
          name="birthdate"
          label="Date de naissance"
          errorMessage="Veuillez entrer une date valide"
          labelPlacement="outside"
          placeholderValue={new CalendarDate(1993, 3, 10)}
          maxValue={new CalendarDate(2025, 1, 1)}
          className="max-w-sm"
        />
        <Input
          isRequired
          type="email"
          name="email"
          label="Email"
          errorMessage="Veuillez entrer un email valide"
          placeholder="ton@adresse.email"
          labelPlacement="outside"
        />
        <Input
          isRequired
          type="password"
          name="password"
          label="Mot de passe"
          placeholder="••••••••"
          labelPlacement="outside"
          validate={(value) => {
            if (!siteConfig.passwordRegex.test(value)) {
              return "Le mot de passe doit contenir au minimum 8 caractères, dont 1 lettre, 1 chiffre et 1 caractère spécial";
            }
            return true;
          }}
          ref={passwordRef}
        />
        <Input
          isRequired
          type="password"
          name="confirm-password"
          label="Confirmation du mot de passe"
          placeholder="••••••••"
          labelPlacement="outside"
          errorMessage="La confirmation doit être identique au mot de passe"
          validate={(value) => {
            const password = passwordRef.current?.value || "";
            if (value !== password) {
              return "La confirmation doit être identique au mot de passe";
            }
            return true;
          }}
        />
        <Button type="submit" isLoading={loading} className="mt-2 self-center w-full" color="primary" variant="solid">
          S'inscrire
        </Button>
      </Form>
    </div>
  );
}
