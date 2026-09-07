import type { Database } from "@/types/database";

// Row-типы таблиц (генерируются из схемы: npm run db:types)
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Club = Database["public"]["Tables"]["clubs"]["Row"];
export type Computer = Database["public"]["Tables"]["computers"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export type Tournament = Database["public"]["Tables"]["tournaments"]["Row"];
export type LoyaltyLevel = Database["public"]["Tables"]["loyalty_levels"]["Row"];

export type { Database };

export type UserRole = Database["public"]["Enums"]["user_role"];
export type ZoneType = Database["public"]["Enums"]["zone_type"];
export type BookingStatus = Database["public"]["Enums"]["booking_status"];
export type PaymentMethod = Database["public"]["Enums"]["payment_method"];
export type ClubStatus = Database["public"]["Enums"]["club_status"];

export const ZONE_LABELS: Record<ZoneType, string> = {
  standart: "STANDART",
  vip: "VIP",
  duo: "DUO",
};

export const ZONE_COLORS: Record<ZoneType, string> = {
  standart: "#ff6a00",
  vip: "#ffb066",
  duo: "#ffffff",
};
