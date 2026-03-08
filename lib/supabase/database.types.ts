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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      categories: {
        Row: {
          category_name: string
          id: number
        }
        Insert: {
          category_name: string
          id?: number
        }
        Update: {
          category_name?: string
          id?: number
        }
        Relationships: []
      }
      conversation_members: {
        Row: {
          conversation_id: number
          created_at: string
          id: number
          user_id: string
        }
        Insert: {
          conversation_id: number
          created_at?: string
          id?: number
          user_id: string
        }
        Update: {
          conversation_id?: number
          created_at?: string
          id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversation_members_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: number
          id: number
          recipient_id: string
          sender_id: string
          sent_at: string
        }
        Insert: {
          content: string
          conversation_id: number
          id?: number
          recipient_id: string
          sender_id: string
          sent_at?: string
        }
        Update: {
          content?: string
          conversation_id?: number
          id?: number
          recipient_id?: string
          sender_id?: string
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      replies_upvotes_downvotes: {
        Row: {
          downvotes: number | null
          id: number
          reply_id: number | null
          upvotes: number
        }
        Insert: {
          downvotes?: number | null
          id?: number
          reply_id?: number | null
          upvotes: number
        }
        Update: {
          downvotes?: number | null
          id?: number
          reply_id?: number | null
          upvotes?: number
        }
        Relationships: [
          {
            foreignKeyName: "replies_upvotes_downvotes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "thread_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_topic_threads: {
        Row: {
          created_at: string
          id: number
          topic_thread_id: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          topic_thread_id: number
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          topic_thread_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_topic_threads_topic_thread_id_fkey"
            columns: ["topic_thread_id"]
            isOneToOne: false
            referencedRelation: "topic_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      thread_replies: {
        Row: {
          content: string | null
          created_at: string
          id: number
          is_deleted: boolean
          parent_comment_id: number | null
          thread_id: number
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: number
          is_deleted?: boolean
          parent_comment_id?: number | null
          thread_id: number
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: number
          is_deleted?: boolean
          parent_comment_id?: number | null
          thread_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "thread_replies_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "thread_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thread_replies_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "topic_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_threads: {
        Row: {
          category_id: number
          content: string
          created_at: string
          created_by: string
          id: number
          is_full: boolean
          member_count: number
          member_max: number
          title: string
        }
        Insert: {
          category_id: number
          content: string
          created_at?: string
          created_by: string
          id?: number
          is_full?: boolean
          member_count?: number
          member_max: number
          title: string
        }
        Update: {
          category_id?: number
          content?: string
          created_at?: string
          created_by?: string
          id?: number
          is_full?: boolean
          member_count?: number
          member_max?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_threads_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profile: {
        Row: {
          avatar_s3_key: string | null
          bio: string | null
          birthday_date: string | null
          display_name: string
          first_name: string | null
          first_time: boolean
          is_profile_public: boolean | null
          last_name: string | null
          user_id: string
        }
        Insert: {
          avatar_s3_key?: string | null
          bio?: string | null
          birthday_date?: string | null
          display_name: string
          first_name?: string | null
          first_time: boolean
          is_profile_public?: boolean | null
          last_name?: string | null
          user_id: string
        }
        Update: {
          avatar_s3_key?: string | null
          bio?: string | null
          birthday_date?: string | null
          display_name?: string
          first_name?: string | null
          first_time?: boolean
          is_profile_public?: boolean | null
          last_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_to_topics: {
        Row: {
          id: number
          joined_at: string
          topic_id: number
          user_id: string
        }
        Insert: {
          id?: number
          joined_at?: string
          topic_id: number
          user_id: string
        }
        Update: {
          id?: number
          joined_at?: string
          topic_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_to_topics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topic_threads"
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
    Enums: {},
  },
} as const
