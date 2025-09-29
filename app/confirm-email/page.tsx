"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@heroui/spinner";
import { Alert } from "@heroui/alert";
import { addToast } from "@heroui/toast";

import { confirmEmail } from "@/lib/api";

export default function ConfirmEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const confirmEmailHandler = async () => {
      if (!code) {
        setStatus("error");

        return;
      }
      try {
        await confirmEmail(code);
        setStatus("success");
        addToast({
          color: "success",
          title: "Adresse email validée",
          description: "Tu peux maintenant t'inscrire aux tournois FPL",
        });
        router.push("/");
      } catch (err) {
        setStatus("error");
      }
    };

    confirmEmailHandler();
  }, [code]);

  return (
    <>
      {status === "loading" && (
        <>
          <Spinner size="lg" />
          <p>Validation de ton email en cours...</p>
        </>
      )}

      {status === "success" && <Alert color="success">Ton adresse email est validée.</Alert>}

      {status === "error" && (
        <Alert color="danger">Le lien de confirmation est invalide ou expiré.</Alert>
      )}
    </>
  );
}
