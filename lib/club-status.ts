"use client";

import { useEffect, useState } from "react";

export type ClubStatus = "open" | "closed" | "special";

export interface ClubStatusInfo {
  slug: string;
  name: string;
  address: string;
  status: ClubStatus;
}

export const STATUS_META: Record<
  ClubStatus,
  { label: string; className: string; dot: string }
> = {
  open: {
    label: "Открыто",
    className: "text-emerald-400",
    dot: "bg-emerald-400",
  },
  closed: {
    label: "Закрыто",
    className: "text-red-400",
    dot: "bg-red-400",
  },
  special: {
    label: "Спец-обслуживание",
    className: "text-amber-400",
    dot: "bg-amber-400",
  },
};

/** Загрузка статусов клубов из БД (публичный эндпоинт) */
export function useClubStatuses() {
  const [clubs, setClubs] = useState<ClubStatusInfo[] | null>(null);

  useEffect(() => {
    let alive = true;

    fetch("/api/clubs")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data) => {
        if (alive) setClubs(data.clubs);
      })
      .catch(() => {
        if (alive) setClubs([]);
      });

    return () => {
      alive = false;
    };
  }, []);

  return clubs;
}

/** Статус конкретного клуба по slug */
export function statusOf(
  clubs: ClubStatusInfo[] | null,
  slug: string
): ClubStatus {
  return clubs?.find((c) => c.slug === slug)?.status ?? "open";
}
