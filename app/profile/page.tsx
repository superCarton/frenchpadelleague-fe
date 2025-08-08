'use client';

import { useEffect, useState } from 'react';
import {Spinner} from "@heroui/spinner";

import { useAuth } from '@/lib/useAuth';
import { getMeProfiles } from '@/lib/api';

export default function ProfilePage() {

  useAuth();
  const [profiles, setProfiles] = useState<{
    player?: any;
    referee?: any;
    club?: any;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const data = await getMeProfiles();
        setProfiles(data);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des profils');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (loading) return <Spinner variant='wave' />;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div>
      {JSON.stringify(profiles, null, 2)}
    </div>
  );
}
