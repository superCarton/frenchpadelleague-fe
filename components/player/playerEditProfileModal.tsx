"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Form } from "@heroui/form";
import { addToast } from "@heroui/toast";

import { useUserStore } from "@/store/store";
import { updateMeProfile } from "@/lib/api";

type PlayerEditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdated: () => void; // callback pour refresh
};

export default function PlayerEditProfileModal({
  isOpen,
  onClose,
  onUpdated,
}: PlayerEditProfileModalProps) {
  const { token, profile } = useUserStore();
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: any) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    setLoading(true);

    try {
      if (token) {
        await updateMeProfile(
          {
            email: data.email.toString(),
            firstname: data.firstname.toString(),
            lastname: data.lastname.toString(),
            phoneNumber: data.phoneNumber
              ? data.phoneNumber.toString().replace(/\s+/g, "")
              : undefined,
          },
          token
        );
      }
      onUpdated();
      onClose();
    } catch (err: any) {
      addToast({
        title: "Une erreur est survenue lors de la mise à jour du profil",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <Modal isOpen={isOpen} placement="center" size="lg" onClose={onClose}>
      <ModalContent>
        <Form onSubmit={handleSave}>
          <ModalHeader>Modifier mon profil</ModalHeader>
          <ModalBody className="flex flex-col items-center gap-4 w-full">
            <Input
              isRequired
              autoComplete="given-name"
              defaultValue={profile.firstname}
              errorMessage="Veuillez entrer votre prénom"
              label="Prénom"
              labelPlacement="outside"
              name="firstname"
              placeholder="Prénom"
              type="text"
            />
            <Input
              isRequired
              autoComplete="family-name"
              defaultValue={profile.lastname}
              errorMessage="Veuillez entrer votre nom"
              label="Nom"
              labelPlacement="outside"
              name="lastname"
              placeholder="Nom"
              type="text"
            />
            <Input
              isRequired
              autoComplete="email"
              defaultValue={profile.user.email}
              errorMessage="Veuillez entrer un email valide"
              label="Email"
              labelPlacement="outside"
              name="email"
              placeholder="ton@adresse.email"
              type="email"
            />
            <Input
              autoComplete="tel"
              defaultValue={profile.phoneNumber}
              errorMessage="Veuillez entrer un numéro de téléphone valide"
              label="Téléphone"
              labelPlacement="outside"
              name="phoneNumber"
              placeholder="+33 6 00 00 00 00"
              type="tel"
              validate={(value) => {
                if (!value) return true;
                const digits = value.replace(/\s+/g, "");
                if (!/^\+?[0-9]{6,15}$/.test(digits)) {
                  return "Veuillez entrer un numéro de téléphone valide";
                }
                return true;
              }}
            />
          </ModalBody>
          <ModalFooter className="flex flex-row justify-between w-full">
            <Button className="w-[150px]" variant="flat" onPress={onClose}>
              Annuler
            </Button>
            <Button className="w-[150px]" color="primary" isLoading={loading} type="submit">
              Sauvegarder
            </Button>
          </ModalFooter>
        </Form>
      </ModalContent>
    </Modal>
  );
}
