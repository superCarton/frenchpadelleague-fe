"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import dayjs from "dayjs";

import { League, Player } from "@/lib/interfaces";
import { getAllLeaguesByGender } from "@/lib/api";
import { leagueColors } from "@/lib/helpers";

type Range = "all" | "12m";

export default function EloHistoryChart({ player }: { player: Player }) {
  const playerStats = {
    bestElo: 810,
    eloHistory: [
      {
        date: "2025-10-03",
        elo: 600,
      },
      {
        date: "2025-04-04",
        elo: 625,
      },
      {
        date: "2025-04-25",
        elo: 665,
      },
      {
        date: "2025-06-04",
        elo: 712,
      },
      {
        date: "2025-06-30",
        elo: 690,
      },
      {
        date: "2025-07-14",
        elo: 720,
      },
      {
        date: "2025-07-28",
        elo: 755,
      },
      {
        date: "2025-08-15",
        elo: 738,
      },
    ],
  };

  if (playerStats.eloHistory.length) {
    playerStats.eloHistory.push({
      date: new Date().toISOString(),
      elo: playerStats.eloHistory[playerStats.eloHistory.length - 1].elo,
    });
  }

  const [leagues, setLeagues] = useState<League[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const fetchLeagues = async () => {
      try {
        const { data } = await getAllLeaguesByGender(player.gender);
        setLeagues(data || []);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des ligues");
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, []);

  const [range, setRange] = useState<Range>("all");
  const [loading, setLoading] = useState(false);
  const [dataAll, setDataAll] = useState<Array<{ date: string; elo: number }>>(
    playerStats.eloHistory
  );

  const data12m = useMemo(() => {
    const from = dayjs().subtract(12, "month");
    return dataAll.filter((d) => dayjs(d.date).isAfter(from));
  }, [dataAll]);

  const data = range === "12m" ? data12m : dataAll;

  const best = useMemo(() => {
    if (!dataAll.length) return null;
    return dataAll.reduce((acc, cur) => (cur.elo > acc.elo ? cur : acc), dataAll[0]);
  }, [dataAll]);

  const yDomain = useMemo(() => {
    if (!data.length) return [0, 1000];
    const values = data.map((d) => d.elo);
    const min = Math.min(...values);
    const max = Math.max(...values);
    return [min - 100, max + 100];
  }, [data]);

  return (
    <Card className="border border-gray-200">
      <CardBody className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-semibold text-gray-700">Évolution de l’Elo</div>
          <Tabs
            aria-label="Filtre de période"
            classNames={{ tabList: "gap-1", tab: "px-2 py-1 text-xs" }}
            selectedKey={range}
            size="sm"
            onSelectionChange={(k) => setRange(k as Range)}
          >
            <Tab key="12m" title="12 derniers mois" />
            <Tab key="all" title="Toujours" />
          </Tabs>
        </div>

        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <div className="h-56">
            <ResponsiveContainer height="100%" width="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="eloFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgb(215,166,60)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="rgb(215,166,60)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="date"
                  fontSize={12}
                  stroke="#9ca3af"
                  tickFormatter={(v) => dayjs(v).format(range === "12m" ? "DD/MM" : "MM/YY")}
                />

                <YAxis
                  allowDecimals={false}
                  domain={yDomain}
                  fontSize={12}
                  stroke="#9ca3af"
                  width={40}
                />

                <Tooltip
                  contentStyle={{ fontSize: 12 }}
                  formatter={(value: any) => [`${value}`, "Elo"]}
                  labelFormatter={(v) => dayjs(v).format("DD/MM/YYYY")}
                />

                {leagues.map((league) => (
                  <Fragment key={league.documentId}>
                    <ReferenceLine
                      label={league.badge}
                      stroke={leagueColors[league.badge]}
                      strokeDasharray="3 3"
                      y={league.minElo}
                    />
                  </Fragment>
                ))}

                <Area
                  activeDot={{ r: 3 }}
                  dataKey="elo"
                  dot={false}
                  fill="url(#eloFill)"
                  stroke="rgb(215,166,60)"
                  strokeWidth={2}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
