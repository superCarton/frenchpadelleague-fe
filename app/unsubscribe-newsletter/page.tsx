"use client";

import { Button } from "@heroui/button";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addToast } from "@heroui/toast";

import { unsubscribeNewsletter } from "@/lib/api";

export default function UnsubscribeNewsletterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);

  const handleUnsubscribeNewsletter = async () => {
    if (!token) {
      addToast({
        title: "Erreur lors de la désinscription",
        description: "Token manquant",
        color: "danger",
      });

      return null;
    }
    setLoading(true);
    try {
      if (token) {
        await unsubscribeNewsletter(token);
        addToast({
          title: "Vous êtes désinscrit(e) de la newsletter !",
          description:
            "Nous sommes désolés de vous voir partir. Vous pouvez vous réabonner à tout moment.",
          color: "success",
        });
        router.push("/");
      }
    } catch (err: any) {
      let description;

      if (err && err.message) {
        description = err.message;
      }
      addToast({
        title: "Erreur lors de la désisnscription",
        description,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        className="mt-2 self-center w-full"
        color="primary"
        isLoading={loading}
        variant="solid"
        onPress={handleUnsubscribeNewsletter}
      >
        Se désinscrire de la newsletter
      </Button>
    </div>
  );
}
