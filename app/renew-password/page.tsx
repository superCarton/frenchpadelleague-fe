'use client';

import { Button } from "@heroui/button";
import { useState } from "react";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";

import { resetPassword } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { addToast } from "@heroui/toast";

export default function RenewPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('code');

  const [loading, setLoading] = useState(false);

  const handleRenewPassword = async (e: any) => {
    e.preventDefault();

    if (!token) {
      addToast({
        title: "Une erreur est survenue lors du renouvellement du mot de passe",
        description: "Lien invalide ou expiré",
        color: "danger"
      });
      return;
    }

    const data = Object.fromEntries(new FormData(e.currentTarget));
    setLoading(true);

    try {
      await resetPassword(token, data.password.toString());
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
      addToast({
        title: "Mot de passe mis à jour ✅",
        color: "success"
      });
      router.push('/profile');
    } catch (err: any) {
      let description;
      if (err && err.message) {
        description = err.message;
      }
      addToast({
        title: `Une erreur est survenue lors du renouvellement du mot de passe`,
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
        onSubmit={handleRenewPassword}
      >
        <Input
          isRequired
          type="password"
          name="password"
          label="Nouveau mot de passe"
          errorMessage="Le mot de passe est requis"
          placeholder="••••••••"
          labelPlacement="outside"
        />
        <Input
          isRequired
          type="password"
          name="confirm-password"
          label="Confirmation du nouveau mot de passe"
          errorMessage="La confirmation du mot de passe est requise"
          placeholder="••••••••"
          labelPlacement="outside"
        />
        <Button type="submit" isLoading={loading} className="mt-2 self-center w-full" color="primary" variant="solid">
          Mettre à jour mon mot de passe
        </Button>
      </Form>
    </div>
  );
}
