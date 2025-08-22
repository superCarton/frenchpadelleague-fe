"use client";

import { Button } from "@heroui/button";
import { useRef, useState } from "react";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { addToast } from "@heroui/toast";

import { getMePlayer, resetPassword } from "@/lib/api";
import { siteConfig } from "@/config/site";
import { useUserStore } from "@/store/store";

export default function RenewPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("code");
  const passwordRef = useRef<HTMLInputElement>(null);
  const { setToken, setProfile } = useUserStore();

  const [loading, setLoading] = useState(false);

  const handleRenewPassword = async (e: any) => {
    e.preventDefault();

    if (!token) {
      addToast({
        title: "Une erreur est survenue lors du renouvellement du mot de passe",
        description: "Lien invalide ou expiré",
        color: "danger",
      });

      return;
    }

    const data = Object.fromEntries(new FormData(e.currentTarget));

    setLoading(true);

    try {
      const { jwt } = await resetPassword(token, data.password.toString());

      setToken(jwt);
      const profile = await getMePlayer(jwt);

      setProfile(profile);
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
      addToast({
        title: "Mot de passe mis à jour",
        color: "success",
      });
      router.push(`/players/${profile.documentId}`);
    } catch (err: any) {
      let description;

      if (err && err.message) {
        description = err.message;
      }
      addToast({
        title: `Une erreur est survenue lors du renouvellement du mot de passe`,
        description,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form className="" onSubmit={handleRenewPassword}>
        <Input
          ref={passwordRef}
          isRequired
          autoComplete="new-password"
          errorMessage="Le mot de passe est requis"
          label="Nouveau mot de passe"
          labelPlacement="outside"
          name="password"
          placeholder="••••••••"
          type="password"
          validate={(value) => {
            if (!siteConfig.passwordRegex.test(value)) {
              return "Le mot de passe doit contenir au minimum 8 caractères, dont 1 lettre, 1 chiffre et 1 caractère spécial";
            }

            return true;
          }}
        />
        <Input
          isRequired
          autoComplete="new-password"
          errorMessage="La confirmation doit être identique au mot de passe"
          label="Confirmation du nouveau mot de passe"
          labelPlacement="outside"
          name="confirm-password"
          placeholder="••••••••"
          type="password"
          validate={(value) => {
            const password = passwordRef.current?.value || "";

            if (value !== password) {
              return "La confirmation doit être identique au mot de passe";
            }

            return true;
          }}
        />
        <Button
          className="mt-2 self-center w-full"
          color="primary"
          isLoading={loading}
          type="submit"
          variant="solid"
        >
          Mettre à jour mon mot de passe
        </Button>
      </Form>
    </div>
  );
}
