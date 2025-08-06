'use client';

import { unsubscribeNewsletter } from "@/lib/api";
import { Button } from "@heroui/button";
import { useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

export default function UnsubscribeNewsletterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUnsubscribeNewsletter = async (e: any) => {
    setLoading(true);
    try {
      if (token) {
        await unsubscribeNewsletter(token);
        router.push('/unsubscribed-newsletter');
      }
    } catch (err: any) {
      const message = err ? err.message : 'inconnue';
      setMessage(`❌ Erreur : ${message}}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {token ? <Button onPress={handleUnsubscribeNewsletter} isLoading={loading} variant="faded" radius="none" className="mt-2 self-center">
        Se désinscrire de la newsletter
      </Button> : "Token manquant !"}
      {message && <p className="text-sm mt-2">{message}</p>}
    </div>
  );
}
