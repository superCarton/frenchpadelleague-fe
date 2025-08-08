'use client';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { createPlayer } from "@/lib/api";
import { Form } from '@heroui/form';
import { Link } from '@heroui/link';
import { addToast } from '@heroui/toast';
import { DateInput } from "@heroui/date-input";
import { CalendarDate } from '@internationalized/date';

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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
        title: "❌ Erreur lors de l'inscription",
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
        validationErrors={errors}
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
          errorMessage="Le mot de passe doit contenir au moins 8 caractères"
          placeholder="••••••••"
          labelPlacement="outside"
          validate={(value) => {
            if (value.length < 8) {
              return "Le mot de passe doit contenir au moins 8 caractères dddd";
            }      
          }}
        />
        <Input
          isRequired
          type="password"
          name="confirm-password"
          label="Confirmation du mot de passe"
          errorMessage="Le mot de passe n'est pas indentique"
          placeholder="••••••••"
          labelPlacement="outside"
          validate={(value) => {
            return true;
          }}
        />
        <Button type="submit" isLoading={loading} variant="faded" className="mt-2 self-center">
          Créer mon compte joueur
        </Button>
      </Form>
      <div>Déjà un compte ? <Link href="/login">Se connecter</Link></div>
    </div>
  );
}
