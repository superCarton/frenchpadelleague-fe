"use client";

import { useState } from "react";
import { Pagination } from "@heroui/pagination";

import { PlayerPreviewView } from "./playerPreview";

import { Player } from "@/lib/interfaces";

interface PlayerListProps {
  players: Player[];
  itemsPerPage?: number;
}

export const PlayerList = ({ players, itemsPerPage = 5 }: PlayerListProps) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(players.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentPlayers = players.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="flex flex-col gap-4">
      {/* Liste des joueurs */}
      <div className="space-y-3">
        {currentPlayers.map((player) => (
          <div
            key={player.documentId}
            className="p-4 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <PlayerPreviewView player={player} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination showControls page={page} size="sm" total={totalPages} onChange={setPage} />
        </div>
      )}
    </div>
  );
};
