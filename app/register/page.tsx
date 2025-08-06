'use client';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { createPlayer } from "@/lib/api";
import { Form } from '@heroui/form';

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
  const [message, setMessage] = useState<string | null>(null);
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
      });
      router.push('/confirm-email');
    } catch (err: any) {
      const message = err ? err.message : 'inconnue';
      setMessage(`❌ Erreur : ${translateErrorMessageToFr(message)}`);
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
          radius="none"
        />
        <Input
          isRequired
          type="text"
          name="lastname"
          label="Nom"
          errorMessage="Veuillez entrer votre nom"
          placeholder="Nom"
          labelPlacement="outside"
          radius="none"
        />
        <Input
          isRequired
          type="email"
          name="email"
          label="Email"
          errorMessage="Veuillez entrer un email valide"
          placeholder="email@example.com"
          labelPlacement="outside"
          radius="none"
        />
        <Input
          isRequired
          type="password"
          name="password"
          label="Mot de passe"
          errorMessage="Le mot de passe doit contenir au moins 8 caractères"
          placeholder="••••••••"
          labelPlacement="outside"
          radius="none"
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
          radius="none"
          validate={(value) => {
            return true;
          }}
        />
        <Button type="submit" isLoading={loading} variant="faded" radius="none" className="mt-2 self-center">
          Créer mon compte joueur
        </Button>
      </Form>
      {message && <p className="text-sm mt-2">{message}</p>}
    </div>
  );
}
