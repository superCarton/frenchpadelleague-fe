"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@heroui/spinner";

import { getMePlayer } from "@/lib/api";
import { PlayerPreviewView } from "@/components/playerPreview";
import { Player } from "@/lib/interfaces";
import { DateComponent } from "@/components/dateComponent";

export default function ProfilePage() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const data = await getMePlayer();

        setPlayer(data);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement du joueur");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, []);

  if (loading) return <Spinner variant="wave" />;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!player) return <div className="p-4">Profil joueur introuvable</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* User info */}
      <div className="flex items-center space-x-4">
        <h2>Infos</h2>
        <PlayerPreviewView player={player} />
        <div>
          Date de naissance: <DateComponent abbrev date={player.birthdate} />
        </div>
      </div>

      {/* Compétitions passées */}
      {/* <section>
        <h2 className="text-xl font-semibold mb-3">Compétitions passées</h2>
        {player.competitionsPast.length === 0 ? (
          <p>Aucune compétition passée.</p>
        ) : (
          <ul className="list-disc list-inside space-y-1">
            {player.competitionsPast.map((comp) => (
              <li key={comp.id}>
                {comp.name} — {new Date(comp.date).toLocaleDateString()} {comp.result ? `— Résultat : ${comp.result}` : ''}
              </li>
            ))}
          </ul>
        )}
      </section> */}

      {/* Historique Elo */}
      {/* <section>
        <h2 className="text-xl font-semibold mb-3">Évolution de mon niveau</h2>
        {eloHistory.length === 0 ? (
          <p>Aucune donnée historique.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={eloHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
              <YAxis />
              <Tooltip labelFormatter={(label) => new Date(label).toLocaleDateString()} />
              <Line type="monotone" dataKey="elo" stroke="#0070f3" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </section> */}

      {/* Inscriptions aux compétitions futures */}
      {/* <section>
        <h2 className="text-xl font-semibold mb-3">Inscriptions aux compétitions futures</h2>
        {player.competitionsFuture.length === 0 ? (
          <p>Aucune inscription future.</p>
        ) : (
          <ul className="list-disc list-inside space-y-1">
            {player.competitionsFuture.map((comp) => (
              <li key={comp.id}>
                {comp.name} — {new Date(comp.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        )}
      </section> */}
    </div>
  );
}
