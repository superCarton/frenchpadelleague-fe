"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import { Button } from "@heroui/button";

import { GameFormat } from "@/lib/interfaces";

export default function GameFormatComponent({ gameFormat }: { gameFormat: GameFormat }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        className="p-0 h-auto min-w-0 text-primary hover:underline cursor-pointer"
        variant="light"
        onPress={() => setIsOpen(true)}
      >
        {gameFormat.name}
      </Button>
      <Modal isOpen={isOpen} placement="center" size="md" onClose={() => setIsOpen(false)}>
        <ModalContent>
          <ModalHeader>Format {gameFormat.name}</ModalHeader>
          <ModalBody className="p-4">
            <div>{gameFormat.description}</div>
            <ul>
              <li>Nombre de sets : {gameFormat.nbOfSets}</li>
              <li>Nombre de jeux par sets : {gameFormat.nbGamesInSet}</li>
              <li>
                Jeux <strong>{gameFormat.noAd ? "sans" : "avec"}</strong> avantage
              </li>
              {gameFormat.lastSetSuperTie && <li>Dernier set en super tiebreak en 10 points</li>}
            </ul>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
