"use client";

import { Alert } from "@heroui/react";
import { useState } from "react";

import { useUserStore } from "@/store/store";

export default function EmailConfirmationBanner() {
  const { profile } = useUserStore();
  const [isVisible, setIsVisible] = useState(true);

  if (!profile?.user || profile.user.confirmed) {
    return null;
  }

  return (
    <div className="w-full p-3">
      <Alert
        className="max-w-xl mx-auto rounded-sm shadow-md"
        color="warning"
        description="Tu dois confirmer ton email pour pouvoir t'inscrire aux tournois FPL."
        isVisible={isVisible}
        title="Email non confirmé"
        variant="faded"
        onClose={() => setIsVisible(false)}
      />
    </div>
  );
}
