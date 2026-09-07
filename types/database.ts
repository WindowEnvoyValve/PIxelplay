export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          bonuses_used: number
          cashback_earned: number
          club_id: string
          created_at: string
          end_time: string
          id: string
          notes: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          pc_id: string
          start_time: string
          status: Database["public"]["Enums"]["booking_status"]
          total_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          bonuses_used?: number
          cashback_earned?: number
          club_id: string
          created_at?: string
          end_time: string
          id?: string
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          pc_id: string
          start_time: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          bonuses_used?: number
          cashback_earned?: number
          club_id?: string
          created_at?: string
          end_time?: string
          id?: string
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          pc_id?: string
          start_time?: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_pc_id_fkey"
            columns: ["pc_id"]
            isOneToOne: false
            referencedRelation: "computers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          address: string
          created_at: string
          id: string
          is_active: boolean
          layout_json: Json
          location: Json
          name: string
          open_hours: Json
          phone: string | null
          slug: string
          status: Database["public"]["Enums"]["club_status"]
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          is_active?: boolean
          layout_json?: Json
          location: Json
          name: string
          open_hours?: Json
          phone?: string | null
          slug: string
          status?: Database["public"]["Enums"]["club_status"]
        }
        Update: {
          address?: string
          created_at?: string
          id?: string
          is_active?: boolean
          layout_json?: Json
          location?: Json
          name?: string
          open_hours?: Json
          phone?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["club_status"]
        }
        Relationships: []
      }
      computers: {
        Row: {
          club_id: string
          grid_pos: Json | null
          id: string
          number: number
          price_per_hour: number
          remote_agent_id: string | null
          specs: Json
          status: Database["public"]["Enums"]["computer_status"]
          zone_type: Database["public"]["Enums"]["zone_type"]
        }
        Insert: {
          club_id: string
          grid_pos?: Json | null
          id?: string
          number: number
          price_per_hour?: number
          remote_agent_id?: string | null
          specs?: Json
          status?: Database["public"]["Enums"]["computer_status"]
          zone_type?: Database["public"]["Enums"]["zone_type"]
        }
        Update: {
          club_id?: string
          grid_pos?: Json | null
          id?: string
          number?: number
          price_per_hour?: number
          remote_agent_id?: string | null
          specs?: Json
          status?: Database["public"]["Enums"]["computer_status"]
          zone_type?: Database["public"]["Enums"]["zone_type"]
        }
        Relationships: [
          {
            foreignKeyName: "computers_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_levels: {
        Row: {
          cashback_percent: number
          color: string
          id: Database["public"]["Enums"]["loyalty_level"]
          min_hours: number
          sort_order: number
          title: string
        }
        Insert: {
          cashback_percent: number
          color?: string
          id: Database["public"]["Enums"]["loyalty_level"]
          min_hours: number
          sort_order: number
          title: string
        }
        Update: {
          cashback_percent?: number
          color?: string
          id?: Database["public"]["Enums"]["loyalty_level"]
          min_hours?: number
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          balance: number
          birth_date: string | null
          birthday_bonus_year: number | null
          bonus_balance: number
          created_at: string
          hours_3m: number
          id: string
          loyalty_level: Database["public"]["Enums"]["loyalty_level"]
          nickname: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          showcase_skin: string | null
          steam_id: string | null
          steam_profile: Json | null
          total_hours: number
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          balance?: number
          birth_date?: string | null
          birthday_bonus_year?: number | null
          bonus_balance?: number
          created_at?: string
          hours_3m?: number
          id: string
          loyalty_level?: Database["public"]["Enums"]["loyalty_level"]
          nickname: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          showcase_skin?: string | null
          steam_id?: string | null
          steam_profile?: Json | null
          total_hours?: number
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          balance?: number
          birth_date?: string | null
          birthday_bonus_year?: number | null
          bonus_balance?: number
          created_at?: string
          hours_3m?: number
          id?: string
          loyalty_level?: Database["public"]["Enums"]["loyalty_level"]
          nickname?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          showcase_skin?: string | null
          steam_id?: string | null
          steam_profile?: Json | null
          total_hours?: number
          updated_at?: string
        }
        Relationships: []
      }
      tournament_participants: {
        Row: {
          id: string
          place: number | null
          registered_at: string
          seed: number | null
          team_name: string | null
          tournament_id: string
          user_id: string
        }
        Insert: {
          id?: string
          place?: number | null
          registered_at?: string
          seed?: number | null
          team_name?: string | null
          tournament_id: string
          user_id: string
        }
        Update: {
          id?: string
          place?: number | null
          registered_at?: string
          seed?: number | null
          team_name?: string | null
          tournament_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournament_participants_tournament_id_fkey"
            columns: ["tournament_id"]
            isOneToOne: false
            referencedRelation: "tournaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tournament_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tournaments: {
        Row: {
          bracket_json: Json
          club_id: string | null
          cover_url: string | null
          created_at: string
          description: string | null
          discipline: string | null
          entry_fee: number
          game: string
          id: string
          max_teams: number
          prize_pool: number
          starts_at: string
          status: Database["public"]["Enums"]["tournament_status"]
          stream_url: string | null
          team_size: number
          title: string
        }
        Insert: {
          bracket_json?: Json
          club_id?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          discipline?: string | null
          entry_fee?: number
          game: string
          id?: string
          max_teams?: number
          prize_pool?: number
          starts_at: string
          status?: Database["public"]["Enums"]["tournament_status"]
          stream_url?: string | null
          team_size?: number
          title: string
        }
        Update: {
          bracket_json?: Json
          club_id?: string | null
          cover_url?: string | null
          created_at?: string
          description?: string | null
          discipline?: string | null
          entry_fee?: number
          game?: string
          id?: string
          max_teams?: number
          prize_pool?: number
          starts_at?: string
          status?: Database["public"]["Enums"]["tournament_status"]
          stream_url?: string | null
          team_size?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "tournaments_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          bonus_amount: number
          booking_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          amount: number
          bonus_amount?: number
          booking_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          amount?: number
          bonus_amount?: number
          booking_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_endpoints: {
        Row: {
          created_at: string
          events: string[]
          id: string
          is_active: boolean
          name: string
          secret: string
          url: string
        }
        Insert: {
          created_at?: string
          events?: string[]
          id?: string
          is_active?: boolean
          name: string
          secret?: string
          url: string
        }
        Update: {
          created_at?: string
          events?: string[]
          id?: string
          is_active?: boolean
          name?: string
          secret?: string
          url?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          attempts: number
          created_at: string
          endpoint_id: string | null
          event_type: string
          id: string
          is_delivered: boolean
          payload: Json
          status_code: number | null
        }
        Insert: {
          attempts?: number
          created_at?: string
          endpoint_id?: string | null
          event_type: string
          id?: string
          is_delivered?: boolean
          payload: Json
          status_code?: number | null
        }
        Update: {
          attempts?: number
          created_at?: string
          endpoint_id?: string | null
          event_type?: string
          id?: string
          is_delivered?: boolean
          payload?: Json
          status_code?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_logs_endpoint_id_fkey"
            columns: ["endpoint_id"]
            isOneToOne: false
            referencedRelation: "webhook_endpoints"
            referencedColumns: ["id"]
          },
        ]
      }
      user_prefixes: {
        Row: {
          color: string
          created_at: string
          id: string
          is_active: boolean
          prefix: string
          role: Database["public"]["Enums"]["user_role"]
          sort_order: number
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          is_active?: boolean
          prefix: string
          role: Database["public"]["Enums"]["user_role"]
          sort_order?: number
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          is_active?: boolean
          prefix?: string
          role?: Database["public"]["Enums"]["user_role"]
          sort_order?: number
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_deleted: boolean
          is_muted: boolean
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_deleted?: boolean
          is_muted?: boolean
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_deleted?: boolean
          is_muted?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_bans: {
        Row: {
          banned_by: string
          created_at: string
          expires_at: string | null
          id: string
          reason: string | null
          user_id: string
        }
        Insert: {
          banned_by: string
          created_at?: string
          expires_at?: string | null
          id?: string
          reason?: string | null
          user_id: string
        }
        Update: {
          banned_by?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_bans_banned_by_fkey"
            columns: ["banned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_bans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_warnings: {
        Row: {
          created_at: string
          id: string
          reason: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_warnings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_birthday_bonuses: { Args: never; Returns: number }
      calc_loyalty_level: {
        Args: { p_hours: number }
        Returns: Database["public"]["Enums"]["loyalty_level"]
      }
      get_available_pcs: {
        Args: { p_club_id: string; p_end: string; p_start: string }
        Returns: {
          club_id: string
          grid_pos: Json | null
          id: string
          number: number
          price_per_hour: number
          remote_agent_id: string | null
          specs: Json
          status: Database["public"]["Enums"]["computer_status"]
          zone_type: Database["public"]["Enums"]["zone_type"]
        }[]
        SetofOptions: {
          from: "*"
          to: "computers"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      is_admin: { Args: never; Returns: boolean }
      refresh_loyalty: { Args: { p_user_id: string }; Returns: undefined }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      is_chat_banned: { Args: { p_user_id: string }; Returns: boolean }
      get_user_prefix: { Args: { p_role: Database["public"]["Enums"]["user_role"] }; Returns: string }
    }
    Enums: {
      booking_status:
        | "pending"
        | "confirmed"
        | "active"
        | "completed"
        | "cancelled"
        | "no_show"
      club_status: "open" | "closed" | "special"
      computer_status:
        | "available"
        | "busy"
        | "reserved"
        | "maintenance"
        | "offline"
      loyalty_level: "rookie" | "bronze" | "silver" | "gold" | "legend"
      payment_method: "money" | "bonuses" | "mixed"
      tournament_status:
        | "draft"
        | "registration"
        | "ongoing"
        | "finished"
        | "cancelled"
      transaction_type:
        | "topup"
        | "payment"
        | "bonus_accrual"
        | "bonus_spend"
        | "refund"
        | "admin_adjustment"
      user_role: "user" | "manager" | "admin"
      zone_type: "standart" | "vip" | "duo"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      booking_status: [
        "pending",
        "confirmed",
        "active",
        "completed",
        "cancelled",
        "no_show",
      ],
      club_status: ["open", "closed", "special"],
      computer_status: [
        "available",
        "busy",
        "reserved",
        "maintenance",
        "offline",
      ],
      loyalty_level: ["rookie", "bronze", "silver", "gold", "legend"],
      payment_method: ["money", "bonuses", "mixed"],
      tournament_status: [
        "draft",
        "registration",
        "ongoing",
        "finished",
        "cancelled",
      ],
      transaction_type: [
        "topup",
        "payment",
        "bonus_accrual",
        "bonus_spend",
        "refund",
        "admin_adjustment",
      ],
      user_role: ["user", "manager", "admin", "developer", "owner", "director", "head_admin"],
      zone_type: ["standart", "vip", "duo"],
    },
  },
} as const

