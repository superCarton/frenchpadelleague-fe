"use client";

import { useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";
import { Alert } from "@heroui/alert";

import { PlayerPreviewView } from "../player/playerPreview";

import { getPlayers, registerTeam } from "@/lib/api";
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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const filterPlayers = (player: Player) => player.documentId !== profile?.documentId;

      getPlayers({ leagueDocumentId: league.documentId }).then((res) =>
        setPlayers(res.data.filter(filterPlayers))
      );
      setPartnerId(null);
      setError(null);
    }
  }, [isOpen, league.id]);

  const handleRegister = async () => {
    if (!partnerId || !token) return;
    try {
      setError(null);
      setLoading(true);
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
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} size="lg" onClose={onClose}>
      <ModalContent>
        <ModalHeader>Inscription au tournoi</ModalHeader>
        <ModalBody>
          <Alert
            className="mx-auto"
            color="danger"
            description={error}
            isVisible={!!error}
            title="Erreur lors de l'inscription au tournoi"
            variant="faded"
            onClose={() => setError(null)}
          />
          <Autocomplete
            isDisabled={loading}
            label="Choisir un partenaire"
            listboxProps={{
              emptyContent: "Aucun joueur disponible.",
            }}
            placeholder="Rechercher un joueur"
            onSelectionChange={(key) => setPartnerId(key as string)}
          >
            {players.map((player) => (
              <AutocompleteItem key={player.documentId}>
                {player.firstname} {player.lastname} ({player.elo.current})
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
        <ModalFooter className="flex justify-between">
          <Button className="w-[150px]" variant="light" onPress={onClose}>
            Annuler
          </Button>
          <Button
            className="w-[150px]"
            color="primary"
            isDisabled={!partnerId}
            isLoading={loading}
            onPress={handleRegister}
          >
            Valider l'inscription
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
