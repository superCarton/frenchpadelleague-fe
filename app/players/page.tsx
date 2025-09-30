"use client";

import { useEffect, useState } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import NextLink from "next/link";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Pagination } from "@heroui/pagination";

import { PlayerList } from "@/components/player/playersList";
import { pageTitle } from "@/components/primitives";
import { getPlayers } from "@/lib/api";
import { Player } from "@/lib/interfaces";
import { SectionLoader } from "@/components/common/sectionLoader";

export default function SearchPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");

  const pageSize = 20;
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const handleSearch = (e: any) => {
    e.preventDefault();
    fetchPlayers();
  };

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const nameSearchTokens = searchTerm.length
        ? searchTerm.trim().toLocaleLowerCase().split(/\s+/)
        : undefined;
      const { data, meta } = await getPlayers({ nameSearchTokens }, { page, pageSize });
      setPlayers(data);
      setPageCount(meta.pagination.pageCount);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [page]);

  return (
    <div className="flex justify-center py-4 sm:py-10 px-2 sm:px-4">
      <div className="w-full sm:w-xl mx-auto space-y-4">
        <Breadcrumbs size="md">
          <BreadcrumbItem>
            <NextLink href="/">Accueil</NextLink>
          </BreadcrumbItem>
          <BreadcrumbItem>Joueurs</BreadcrumbItem>
        </Breadcrumbs>

        <h2 className={pageTitle()}>Rechercher des joueurs</h2>

        <Form className="w-full" onSubmit={handleSearch}>
          <div className="w-full flex flex-col sm:flex-row gap-4 items-center">
            <Input
              isClearable
              className="flex-1"
              label="Rechercher par nom ou prénom"
              labelPlacement="inside"
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <Button className="w-[150px]" color="primary" type="submit">
              Appliquer
            </Button>
          </div>
        </Form>

        {loading ? (
          <SectionLoader label="Chargement des joueurs" />
        ) : players.length === 0 ? (
          <p className="text-gray-500">Aucun joueur trouvé</p>
        ) : (
          <PlayerList players={players} />
        )}

        {players.length > 0 && (
          <div className="flex justify-center">
            <Pagination showControls page={page} total={pageCount} onChange={(p) => setPage(p)} />
          </div>
        )}
      </div>
    </div>
  );
}
