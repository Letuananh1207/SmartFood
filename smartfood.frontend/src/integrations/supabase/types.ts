export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      dishes: {
        Row: {
          category: string
          cook_time: number
          created_at: string
          description: string | null
          difficulty: string
          id: string
          image_emoji: string | null
          ingredients: Json
          instructions: string | null
          name: string
          rating: number | null
          servings: number
          updated_at: string
        }
        Insert: {
          category?: string
          cook_time: number
          created_at?: string
          description?: string | null
          difficulty?: string
          id?: string
          image_emoji?: string | null
          ingredients?: Json
          instructions?: string | null
          name: string
          rating?: number | null
          servings?: number
          updated_at?: string
        }
        Update: {
          category?: string
          cook_time?: number
          created_at?: string
          description?: string | null
          difficulty?: string
          id?: string
          image_emoji?: string | null
          ingredients?: Json
          instructions?: string | null
          name?: string
          rating?: number | null
          servings?: number
          updated_at?: string
        }
        Relationships: []
      }
      family_members: {
        Row: {
          avatar_initials: string | null
          contributions: number
          created_at: string
          email: string
          id: string
          join_date: string
          last_active: string
          name: string
          phone: string | null
          role: string
          updated_at: string
        }
        Insert: {
          avatar_initials?: string | null
          contributions?: number
          created_at?: string
          email: string
          id?: string
          join_date?: string
          last_active?: string
          name: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Update: {
          avatar_initials?: string | null
          contributions?: number
          created_at?: string
          email?: string
          id?: string
          join_date?: string
          last_active?: string
          name?: string
          phone?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      fridge_items: {
        Row: {
          added_date: string
          category: string
          created_at: string
          expiry_date: string
          id: string
          location: string
          name: string
          quantity: string
          updated_at: string
        }
        Insert: {
          added_date?: string
          category: string
          created_at?: string
          expiry_date: string
          id?: string
          location: string
          name: string
          quantity: string
          updated_at?: string
        }
        Update: {
          added_date?: string
          category?: string
          created_at?: string
          expiry_date?: string
          id?: string
          location?: string
          name?: string
          quantity?: string
          updated_at?: string
        }
        Relationships: []
      }
      grocery_items: {
        Row: {
          added_by: string | null
          amount: string
          completed: boolean | null
          created_at: string | null
          family_member_id: string | null
          id: number
          item_name: string
          item_type: string
          price: number | null
          updated_at: string | null
        }
        Insert: {
          added_by?: string | null
          amount: string
          completed?: boolean | null
          created_at?: string | null
          family_member_id?: string | null
          id?: number
          item_name: string
          item_type: string
          price?: number | null
          updated_at?: string | null
        }
        Update: {
          added_by?: string | null
          amount?: string
          completed?: boolean | null
          created_at?: string | null
          family_member_id?: string | null
          id?: number
          item_name?: string
          item_type?: string
          price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grocery_items_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_plans: {
        Row: {
          created_at: string
          created_by: string | null
          dish_id: string
          family_member_id: string | null
          id: string
          meal_date: string
          notes: string | null
          planned_servings: number
          time_of_day: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          dish_id: string
          family_member_id?: string | null
          id?: string
          meal_date: string
          notes?: string | null
          planned_servings?: number
          time_of_day: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          dish_id?: string
          family_member_id?: string | null
          id?: string
          meal_date?: string
          notes?: string | null
          planned_servings?: number
          time_of_day?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "dishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_plans_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_history: {
        Row: {
          amount: string
          created_at: string | null
          family_member_id: string | null
          id: number
          item_name: string
          item_type: string
          price: number | null
          purchased_at: string | null
          purchased_by: string | null
        }
        Insert: {
          amount: string
          created_at?: string | null
          family_member_id?: string | null
          id?: number
          item_name: string
          item_type: string
          price?: number | null
          purchased_at?: string | null
          purchased_by?: string | null
        }
        Update: {
          amount?: string
          created_at?: string | null
          family_member_id?: string | null
          id?: number
          item_name?: string
          item_type?: string
          price?: number | null
          purchased_at?: string | null
          purchased_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_history_family_member_id_fkey"
            columns: ["family_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
