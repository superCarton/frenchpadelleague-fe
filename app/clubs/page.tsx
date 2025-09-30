"use client";

import { useEffect, useState } from "react";
import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import NextLink from "next/link";
import { Pagination } from "@heroui/pagination";

import { ClubPreviewView } from "@/components/club/clubPreview";
import { sectionTitle } from "@/components/primitives";
import { getClubs } from "@/lib/api";
import { Club } from "@/lib/interfaces";
import { SectionLoader } from "@/components/common/sectionLoader";

export default function SearchClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  const pageSize = 20;
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const fetchClubs = async () => {
    setLoading(true);
    try {
      const { data, meta } = await getClubs({ pageSize, page });
      setClubs(data);
      setPageCount(meta.pagination.pageCount);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, [page]);

  return (
    <div className="flex justify-center py-4 sm:py-10 px-2 sm:px-4">
      <div className="w-full sm:w-xl mx-auto space-y-4">
        <Breadcrumbs size="md">
          <BreadcrumbItem>
            <NextLink href="/">Accueil</NextLink>
          </BreadcrumbItem>
          <BreadcrumbItem>Clubs</BreadcrumbItem>
        </Breadcrumbs>

        <h2 className={sectionTitle()}>Rechercher des clubs</h2>

        {loading ? (
          <SectionLoader label="Chargement des clubs" />
        ) : clubs.length === 0 ? (
          <p className="text-gray-500">Aucun club trouvé</p>
        ) : (
          <div className="space-y-4">
            {clubs.map((club) => (
              <ClubPreviewView key={club.documentId} club={club} />
            ))}
          </div>
        )}
        {clubs.length > 0 && (
          <div className="flex justify-center">
            <Pagination showControls page={page} total={pageCount} onChange={(p) => setPage(p)} />
          </div>
        )}
      </div>
    </div>
  );
}
