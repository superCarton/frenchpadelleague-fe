"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Avatar } from "@heroui/avatar";
import { addToast } from "@heroui/toast";

import { useUserStore } from "@/store/store";
import { uploadMeProfilePhoto } from "@/lib/api";

type PlayerUploadPictureProps = {
  onUploaded: () => void;
  isOpen: boolean;
  onClose: () => void;
};

export default function PlayerUploadPictureModal({
  onUploaded,
  isOpen,
  onClose,
}: PlayerUploadPictureProps) {
  const { token } = useUserStore();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      if (token) {
        await uploadMeProfilePhoto(file, token);
      }
      onUploaded();
      onClose();
      setFile(null);
    } catch (e: any) {
      addToast({
        title: "Une erreur est survenue lors de la mise à jour de la photo de profil",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Télécharger une photo de profil</ModalHeader>
        <ModalBody className="flex flex-col items-center gap-4">
          {previewUrl && <Avatar alt="Preview photo" className="w-32 h-32" src={previewUrl} />}

          <Input
            accept="image/*"
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                const selectedFile = e.target.files[0];
                if (selectedFile.size > 5 * 1024 * 1024) {
                  alert("La photo ne doit pas dépasser 5 MB");
                  return;
                }
                setFile(selectedFile);
              }
            }}
          />
        </ModalBody>
        <ModalFooter className="flex justify-between">
          <Button className="w-[150px]" variant="flat" onPress={onClose}>
            Annuler
          </Button>
          <Button
            className="w-[150px]"
            color="primary"
            isDisabled={!file}
            isLoading={loading}
            onPress={handleUpload}
          >
            Sauvegarder
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
