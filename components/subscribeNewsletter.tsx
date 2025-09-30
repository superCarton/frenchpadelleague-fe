"use client";

import { Button } from "@heroui/button";
import { useState } from "react";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";

import { subscribeNewsletter } from "@/lib/api";

export default function SubscribeNewsletter() {
  const [loading, setLoading] = useState(false);

  const handleSubscribeNewsLetter = async (e: any) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setLoading(true);

    try {
      await subscribeNewsletter(data.email.toString());
      if (form) {
        form.reset();
      }
      addToast({
        title: "Vous êtes désormais inscrits à la newsletter !",
        color: "success",
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
        title: "Une erreur est survenue lors de l'inscription à la newsletter",
        description,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      Reste informé des prochaines actualités, tournois et offres exclusives
      <Form className="pt-2" onSubmit={handleSubscribeNewsLetter}>
        <Input
          isRequired
          autoComplete="email"
          errorMessage="Une adresse email valide est requise"
          name="email"
          placeholder="ton@adresse.email"
          type="email"
        />
        <Button
          className="w-full bg-black text-white"
          isLoading={loading}
          type="submit"
          variant="bordered"
        >
          S'abonner à la newsletter
        </Button>
      </Form>
    </div>
  );
}
