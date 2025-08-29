"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { Form } from "@heroui/form";
import { Link } from "@heroui/link";
import { addToast } from "@heroui/toast";

import { getMePlayer, login } from "@/lib/api";
import { useUserStore } from "@/store/store";

const translateErrorMessageToFr = (message: string) => {
  if (message.includes("Invalid identifier or password")) {
    return "Identifiants incorrects.";
  } else if (message.includes("Email or Username are already taken")) {
    return "Cet email est déjà utilisé.";
  } else if (message.includes("password is too short")) {
    return "Mot de passe trop court.";
  } else {
    return message;
  }
};

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { setToken, setProfile } = useUserStore();

  const handleLogin = async (e: any) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));

    setLoading(true);

    try {
      const { jwt } = await login(data.email.toString(), data.password.toString());

      setToken(jwt);
      const profile = await getMePlayer(jwt);

      setProfile(profile);
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
      addToast({
        title: "Login success",
        color: "success",
      });
      router.push(`/players/${profile.documentId}`);
    } catch (err: any) {
      let description;

      if (err && err.message) {
        description = translateErrorMessageToFr(err.message);
      }
      addToast({
        title: "Une erreur est survenue lors de la connexion",
        description,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleLogin}>
      <Input
        isRequired
        autoComplete="email"
        disabled={loading}
        errorMessage="Veuillez entrer un email valide"
        label="Email"
        labelPlacement="outside"
        name="email"
        placeholder="ton@adress.email"
        type="email"
      />
      <Input
        isRequired
        autoComplete="current-password"
        disabled={loading}
        errorMessage="Le mot de passe est requis"
        label="Mot de passe"
        labelPlacement="outside"
        name="password"
        placeholder="••••••••"
        type="password"
      />
      <Link as={NextLink} className="self-end text-small" href="/forgot-password">
        Mot de passe oublié ?
      </Link>
      <Button
        className="mt-2 self-center w-full"
        color="primary"
        isLoading={loading}
        type="submit"
        variant="solid"
      >
        Se connecter
      </Button>
    </Form>
  );
}
