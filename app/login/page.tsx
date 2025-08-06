'use client';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { login } from "@/lib/api";
import { Form } from '@heroui/form';

const translateErrorMessageToFr = (message: string) => {
  let messageFR = 'Inconnue.';
  if (message.includes('Invalid identifier or password')) {
    messageFR = 'Identifiants incorrects.';
  } else if (message.includes('Email or Username are already taken')) {
    messageFR = 'Cet email est déjà utilisé.';
  } else if (message.includes('password is too short')) {
    messageFR = 'Mot de passe trop court.';
  }
  return messageFR;
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState({});

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setLoading(true);

    try {
      await login(data.email.toString(), data.password.toString());
      router.push('/profile');
    } catch (err: any) {
      const message = err ? err.message : 'unknown';
      setMessage(`❌ Erreur : ${translateErrorMessageToFr(message)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form 
        className="" 
        onSubmit={handleLogin}
        validationErrors={errors}
      >
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
          errorMessage="Le mot de passe est requis"
          placeholder="••••••••"
          labelPlacement="outside"
          radius="none"
        />
        <Button type="submit" isLoading={loading} variant="faded" radius="none" className="mt-2 self-center">
          Se Connecter
        </Button>
      </Form>
      {message && <p className="text-sm mt-2">{message}</p>}
    </div>
  );
}
