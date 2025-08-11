'use client';

import { Button } from "@heroui/button";
import { useRef, useState } from "react";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";

import { resetPassword } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { addToast } from "@heroui/toast";
import { siteConfig } from "@/config/site";

export default function RenewPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('code');
  const passwordRef = useRef<HTMLInputElement>(null);

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
          label="Confirmation du nouveau mot de passe"
          errorMessage="La confirmation doit être identique au mot de passe"
          placeholder="••••••••"
          labelPlacement="outside"
          validate={(value) => {
            const password = passwordRef.current?.value || "";
            if (value !== password) {
              return "La confirmation doit être identique au mot de passe";
            }
            return true;
          }}
        />
        <Button type="submit" isLoading={loading} className="mt-2 self-center w-full" color="primary" variant="solid">
          Mettre à jour mon mot de passe
        </Button>
      </Form>
    </div>
  );
}
