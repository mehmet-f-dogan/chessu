export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      chapter: {
        Row: {
          created_at: string | null;
          id: number;
          title: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          title?: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          title?: string;
        };
      };
      completion: {
        Row: {
          mapping_ids: number[];
          user_id: string;
        };
        Insert: {
          mapping_ids: number[];
          user_id?: string;
        };
        Update: {
          mapping_ids?: number[];
          user_id?: string;
        };
      };
      content: {
        Row: {
          created_at: string | null;
          data: Json;
          id: number;
          title: string;
          type: string;
        };
        Insert: {
          created_at?: string | null;
          data?: Json;
          id?: number;
          title?: string;
          type?: string;
        };
        Update: {
          created_at?: string | null;
          data?: Json;
          id?: number;
          title?: string;
          type?: string;
        };
      };
      course: {
        Row: {
          created_at: string | null;
          description: string;
          id: number;
          image_url: string;
          price: number;
          subtitle: string;
          tags: string[];
          title: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string;
          id?: number;
          image_url?: string;
          price?: number;
          subtitle?: string;
          tags?: string[];
          title?: string;
        };
        Update: {
          created_at?: string | null;
          description?: string;
          id?: number;
          image_url?: string;
          price?: number;
          subtitle?: string;
          tags?: string[];
          title?: string;
        };
      };
      course_chapter_content_mapping: {
        Row: {
          chapter_id: number;
          content_id: number;
          course_id: number;
          id: number;
        };
        Insert: {
          chapter_id: number;
          content_id: number;
          course_id: number;
          id?: number;
        };
        Update: {
          chapter_id?: number;
          content_id?: number;
          course_id?: number;
          id?: number;
        };
      };
      course_purchase: {
        Row: {
          course_id: number;
          created_at: string | null;
          id: string;
          user_id: string;
        };
        Insert: {
          course_id: number;
          created_at?: string | null;
          id?: string;
          user_id: string;
        };
        Update: {
          course_id?: number;
          created_at?: string | null;
          id?: string;
          user_id?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      requesting_user_id: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
