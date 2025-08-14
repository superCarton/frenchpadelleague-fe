"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Erreur : {error.message}</h2>
      <button onClick={() => reset()}>Réessayer</button>
    </div>
  );
}
