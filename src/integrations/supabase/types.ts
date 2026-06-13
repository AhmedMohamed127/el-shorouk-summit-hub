export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          label_ar: string
          label_en: string
          order_index: number
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id?: string
          label_ar: string
          label_en: string
          order_index?: number
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          label_ar?: string
          label_en?: string
          order_index?: number
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      careers: {
        Row: {
          after_ai_ar: string | null
          after_ai_en: string | null
          before_ai_ar: string | null
          before_ai_en: string | null
          created_at: string
          id: string
          name_ar: string
          name_en: string | null
          order_index: number
          skills_ar: string[] | null
          skills_en: string[] | null
          updated_at: string
        }
        Insert: {
          after_ai_ar?: string | null
          after_ai_en?: string | null
          before_ai_ar?: string | null
          before_ai_en?: string | null
          created_at?: string
          id?: string
          name_ar: string
          name_en?: string | null
          order_index?: number
          skills_ar?: string[] | null
          skills_en?: string[] | null
          updated_at?: string
        }
        Update: {
          after_ai_ar?: string | null
          after_ai_en?: string | null
          before_ai_ar?: string | null
          before_ai_en?: string | null
          created_at?: string
          id?: string
          name_ar?: string
          name_en?: string | null
          order_index?: number
          skills_ar?: string[] | null
          skills_en?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          caption_ar: string | null
          caption_en: string | null
          created_at: string
          id: string
          order_index: number
          url: string
        }
        Insert: {
          caption_ar?: string | null
          caption_en?: string | null
          created_at?: string
          id?: string
          order_index?: number
          url: string
        }
        Update: {
          caption_ar?: string | null
          caption_en?: string | null
          created_at?: string
          id?: string
          order_index?: number
          url?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          academic_year: string | null
          created_at: string
          department: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
        }
        Insert: {
          academic_year?: string | null
          created_at?: string
          department?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
        }
        Update: {
          academic_year?: string | null
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          created_at: string
          description_ar: string | null
          description_en: string | null
          id: string
          order_index: number
          speaker: string | null
          time_label: string
          title_ar: string
          title_en: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          order_index?: number
          speaker?: string | null
          time_label: string
          title_ar: string
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_ar?: string | null
          description_en?: string | null
          id?: string
          order_index?: number
          speaker?: string | null
          time_label?: string
          title_ar?: string
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          content: Json
          id: number
          updated_at: string
        }
        Insert: {
          content?: Json
          id?: number
          updated_at?: string
        }
        Update: {
          content?: Json
          id?: number
          updated_at?: string
        }
        Relationships: []
      }
      speakers: {
        Row: {
          bio_ar: string | null
          bio_en: string | null
          created_at: string
          id: string
          name_ar: string
          name_en: string | null
          order_index: number
          photo_url: string | null
          position_ar: string | null
          position_en: string | null
          socials: Json | null
          updated_at: string
        }
        Insert: {
          bio_ar?: string | null
          bio_en?: string | null
          created_at?: string
          id?: string
          name_ar: string
          name_en?: string | null
          order_index?: number
          photo_url?: string | null
          position_ar?: string | null
          position_en?: string | null
          socials?: Json | null
          updated_at?: string
        }
        Update: {
          bio_ar?: string | null
          bio_en?: string | null
          created_at?: string
          id?: string
          name_ar?: string
          name_en?: string | null
          order_index?: number
          photo_url?: string | null
          position_ar?: string | null
          position_en?: string | null
          socials?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      sponsors: {
        Row: {
          created_at: string
          id: string
          logo_url: string | null
          name: string
          order_index: number
          website: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          order_index?: number
          website?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          order_index?: number
          website?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "event_manager" | "content_editor"
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
  public: {
    Enums: {
      app_role: ["super_admin", "event_manager", "content_editor"],
    },
  },
} as const
