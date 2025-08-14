"use client";

import { Button } from "@heroui/button";
import { useState } from "react";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";

import { forgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();
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
        description:
          "Pour réinitialiser ton mode de passe, il te suffit de cliquer sur le lien sécurisé que tu as reçu",
        color: "success",
      });
      router.push("/");
    } catch (err: any) {
      let description;

      if (err && err.message) {
        description = err.message;
      }
      addToast({
        title: "Une erreur est survenue lors de la réinitialisation du mot de passe",
        description,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form className="" onSubmit={handleForgotPassword}>
        <Input
          isRequired
          disabled={loading}
          errorMessage="Veuillez entrer votre email"
          label="Email"
          labelPlacement="outside"
          name="email"
          placeholder="email@example.com"
          type="email"
        />
        <Button
          className="mt-2 self-center w-full"
          color="primary"
          isLoading={loading}
          type="submit"
          variant="solid"
        >
          Réinitialiser le mot de passe
        </Button>
      </Form>
    </div>
  );
}
