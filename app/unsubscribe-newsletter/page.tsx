'use client';

import { unsubscribeNewsletter } from "@/lib/api";
import { Button } from "@heroui/button";
import { useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { addToast } from "@heroui/toast";

export default function UnsubscribeNewsletterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(false);

  const handleUnsubscribeNewsletter = async (e: any) => {
    if (!token) {
      addToast({
        title: "❌ Erreur : token manquant",
        color: "danger"
      });
      return null;
    }
    setLoading(true);
    try {
      if (token) {
        await unsubscribeNewsletter(token);
        addToast({
          title: "Vous êtes désinscrit(e) de la newsletter !",
          description: "Nous sommes désolés de vous voir partir. Vous pouvez vous réabonner à tout moment.",
          color: "success"
        });
        router.push('/');
      }
    } catch (err: any) {
      const message = err ? err.message : 'inconnue';
      addToast({
        title: `❌ Erreur : ${message}}`,
        color: "danger"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onPress={handleUnsubscribeNewsletter} isLoading={loading} variant="faded" className="mt-2 self-center">
        Se désinscrire de la newsletter
      </Button>
    </div>
  );
}
