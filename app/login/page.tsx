"use client";

import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form } from "@heroui/form";
import { Link } from "@heroui/link";
import { addToast } from "@heroui/toast";

import { login } from "@/lib/api";

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
        color: "success",
      });
      router.push("/profile");
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
        disabled={loading}
        errorMessage="Le mot de passe est requis"
        label="Mot de passe"
        labelPlacement="outside"
        name="password"
        placeholder="••••••••"
        type="password"
      />
      <Link className="self-end text-small" href="/forgot-password">
        Mot de passe oublié ?
      </Link>
      <Button
        className="mt-2 self-center w-full"
        color="primary"
        isLoading={loading}
        type="submit"
        variant="solid"
      >
        Se Connecter
      </Button>
    </Form>
  );
}
