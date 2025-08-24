"use client";

import { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";

import { PlayerPreviewView } from "../player/playerPreview";

import { getPlayersByLeague, registerTeam } from "@/lib/api";
import { useUserStore } from "@/store/store";
import { League, Player, Tournament } from "@/lib/interfaces";

export default function TournamentRegisterModal({
  isOpen,
  onClose,
  tournament,
  league,
}: {
  isOpen: boolean;
  onClose: () => void;
  tournament: Tournament;
  league: League;
}) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [partnerId, setPartnerId] = useState<string | null>(null);
  const { token, profile } = useUserStore();

  useEffect(() => {
    if (isOpen) {
      const filterPlayers = (player: Player) => player.documentId !== profile?.documentId;

      getPlayersByLeague(league.id).then((res) => setPlayers(res.data.filter(filterPlayers)));
      setPartnerId(null);
    }
  }, [isOpen, league.id]);

  const handleRegister = async () => {
    if (!partnerId || !token) return;
    try {
      await registerTeam(
        { tournamentDocId: tournament.documentId, partnerDocId: partnerId },
        token
      );
      addToast({
        title: "Inscription au tournoi réussie",
        color: "success",
      });
      onClose();
    } catch (err: any) {
      addToast({
        title: "Erreur lors de l'inscription au tournoi",
        description: err.message,
        color: "danger",
      });
    }
  };

  return (
    <Modal isOpen={isOpen} placement="center" size="md" onClose={onClose}>
      <ModalContent>
        <ModalHeader>Inscription au tournoi</ModalHeader>
        <ModalBody>
          <Autocomplete
            label="Choisir un partenaire"
            listboxProps={{
              emptyContent: "Aucun joueur disponible.",
            }}
            placeholder="Rechercher un joueur"
            onSelectionChange={(key) => setPartnerId(key as string)}
          >
            {players.map((player) => (
              <AutocompleteItem key={player.documentId}>
                {player.firstname} {player.lastname} ({player.elo})
              </AutocompleteItem>
            ))}
          </Autocomplete>
          {partnerId !== null && (
            <div className="space-y-2">
              <h3>Partenaire sélectionné</h3>
              <PlayerPreviewView player={players.find((p) => p.documentId === partnerId)!} />
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Annuler
          </Button>
          <Button color="primary" isDisabled={!partnerId} onPress={handleRegister}>
            Valider l'inscription
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
