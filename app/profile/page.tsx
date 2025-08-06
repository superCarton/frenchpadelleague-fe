'use client';

import { useEffect, useState } from 'react';

import { Card, CardBody } from '@heroui/card';
import {Tabs, Tab} from "@heroui/tabs";

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

  if (loading) return <p className="p-4">Chargement...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div>
      <Tabs aria-label="Options" radius="none" color="primary">
        <Tab key="player" title="Joueur">
          <Card>
            <CardBody>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </CardBody>
          </Card>
        </Tab>
        <Tab key="referee" title="Juge Arbitre">
          <Card>
            <CardBody>
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur.
            </CardBody>
          </Card>
        </Tab>
        <Tab key="club" title="Club">
          <Card>
            <CardBody>
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
