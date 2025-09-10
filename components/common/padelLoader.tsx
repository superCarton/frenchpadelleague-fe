"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function PadelLoader({
  size = 300,
  ballSpeed = 1.5, // durée d'un aller simple
}: {
  size?: number;
  ballSpeed?: number;
}) {
  const [positions, setPositions] = useState<{ cx: number[]; cy: number[] }>({
    cx: [70, 230, 70],
    cy: [40, 110, 40],
  });

  // Alterner les angles de la balle à chaque cycle
  useEffect(() => {
    setPositions(() => {
      const flip = Math.random() > 0.5 ? 1 : -1;

      return {
        cx: [70, 230, 70],
        cy:
          flip > 0
            ? [40, 110, 40] // diagonale bas
            : [110, 40, 110], // diagonale haut
      };
    });
  }, [ballSpeed]);

  return (
    <div className="flex items-center justify-center h-screen bg-transparent min-h-[300px]">
      <motion.svg
        height={(size * 150) / 300}
        viewBox="0 0 300 150"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Filet */}
        <line
          stroke="#d7a63c"
          strokeDasharray="4 4"
          strokeWidth="2"
          x1="150"
          x2="150"
          y1="20"
          y2="130"
        />

        {/* Raquettes gauche */}
        <motion.g
          animate={{ y: [0, -12, 0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <PadelRacket color="#d7a63c" rotate={-15} x={65} y={35} />
        </motion.g>
        <motion.g
          animate={{ y: [0, 10, -5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <PadelRacket color="#d7a63c" rotate={-15} x={65} y={85} />
        </motion.g>

        {/* Raquettes droite */}
        <motion.g
          animate={{ y: [0, 8, 0, -8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <PadelRacket color="#d7a63c" rotate={15} x={235} y={35} />
        </motion.g>
        <motion.g
          animate={{ y: [0, -8, 5, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <PadelRacket color="#d7a63c" rotate={15} x={235} y={85} />
        </motion.g>

        {/* Balle avec angle dynamique */}
        <motion.circle
          animate={{
            cx: positions.cx,
            cy: positions.cy,
          }}
          fill="#d7a63c"
          initial={{
            cx: positions.cx,
            cy: positions.cy,
          }}
          r="6"
          transition={{
            duration: ballSpeed * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.svg>
    </div>
  );
}

function PadelRacket({
  x,
  y,
  color,
  rotate,
}: {
  x: number;
  y: number;
  color: string;
  rotate: number;
}) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rotate})`}>
      {/* Manche */}
      <rect fill={color} height="22" rx="2" width="6" x="-3" y="18" />
      {/* Connexion manche-tête */}
      <path d="M -8 18 Q 0 10 8 18 Z" fill={color} />
      {/* Tête */}
      <ellipse cx="0" cy="0" fill={color} rx="18" ry="20" />
      {/* Trous */}
      {[-6, 0, 6].map((dx) =>
        [-6, 0, 6].map((dy) => <circle key={`${dx}-${dy}`} cx={dx} cy={dy} fill="black" r="2" />)
      )}
    </g>
  );
}
