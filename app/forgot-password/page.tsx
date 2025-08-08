'use client';

import { Button } from "@heroui/button";
import { useState } from "react";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";

import { forgotPassword } from "@/lib/api";
import { addToast } from "@heroui/toast";
import { Link } from "@heroui/link";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e: any) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.currentTarget));
    setLoading(true);

    try {
      await forgotPassword(data.email.toString());
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
      addToast({
        title: "Un email vient de t'être envoyé ✅",
        description: "Pour réinitialiser ton mode de passe, il te suffit de cliquer sur le lien sécurisé que tu as reçu",
        color: "success"
      })
    } catch (err: any) {
      let description;
      if (err && err.message) {
        description = err.message;
      }
      addToast({
        title: "❌ Erreur lors de la reinitialisation du mot de passe",
        description,
        color: "danger"
      })
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form 
        className="" 
        onSubmit={handleForgotPassword}
      >
        <Input
          isRequired
          type="email"
          name="email"
          label="Email"
          errorMessage="Veuillez entrer votre email"
          placeholder="email@example.com"
          labelPlacement="outside"
        />
        <Button type="submit" isLoading={loading} variant="faded" className="mt-2 self-center">
          Réinitialiser le mot de passe
        </Button>
        <Link href="/login">Se connecter</Link>
      </Form>
    </div>
  );
}
