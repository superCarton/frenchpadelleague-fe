'use client';

import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { login } from "@/lib/api";
import { Form } from '@heroui/form';
import { Link } from '@heroui/link';
import { addToast } from '@heroui/toast';

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
  const [errors, setErrors] = useState({});

  const handleLogin = async (e: any) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));
    setLoading(true);

    try {
      await login(data.email.toString(), data.password.toString());
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
      addToast({
        title: "Login success",
        color: "success"
      })
      router.push('/profile');
    } catch (err: any) {
      let description;
      if (err && err.message) {
        description = translateErrorMessageToFr(err.message);
      }
      addToast({
        title: `❌ Erreur lors de la connexion`,
        description,
        color: "danger"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-container'>
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
        />
        <Input
          isRequired
          type="password"
          name="password"
          label="Mot de passe"
          errorMessage="Le mot de passe est requis"
          placeholder="••••••••"
          labelPlacement="outside"
        />
        <Link href="/forgot-password">Mot de passe oublié ?</Link>
        <Button type="submit" isLoading={loading} variant="faded" className="mt-2 self-center">
          Se Connecter
        </Button>
      </Form>
      <div>Pas de compte ? <Link href="/register">S'inscrire maintenant</Link></div>
    </div>
  );
}
