'use client';

import { Button } from "@heroui/button";
import { useState } from "react";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";

import { subscribeNewsletter } from "@/lib/api";
import { addToast } from "@heroui/toast";

export default function SubscribeNewsletter() {
  const [loading, setLoading] = useState(false);

  const handleSubscribeNewsLetter = async (e: any) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setLoading(true);

    try {
      await subscribeNewsletter(data.email.toString());
      if (e.currentTarget) {
        e.currentTarget.reset();
      }
      addToast({
        title: "Vous êtes désormais inscrits à la newsletter !",
        color: "success"
      });
    } catch (err: any) {
      let description;
      if (err && err.message) {
        if (err.message === "This attribute must be unique") {
            description = "Cet email est déjà inscrit";
        } else {
            description = err.message;
        }
      }
      addToast({
        title: "❌ Erreur lors de l'inscription à la newsletter",
        description,
        color: "danger"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        Reste informé des prochaines actualités, tournois et offres exclusives
      <Form 
        className="pt-2" 
        onSubmit={handleSubscribeNewsLetter}
      >
        <Input
          isRequired
          type="email"
          name="email"
          errorMessage="Une adresse email valide est requise"
          placeholder="ton@adresse.email"
        />
        <Button type="submit" isLoading={loading} variant="bordered" className="w-full bg-black text-white">
          S'abonner à la newsletter
        </Button>
      </Form>
    </div>
  );
}
