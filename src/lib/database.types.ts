export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
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
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
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
      chapter: {
        Row: {
          created_at: string | null
          id: number
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          title?: string
        }
        Update: {
          created_at?: string | null
          id?: number
          title?: string
        }
        Relationships: []
      }
      completion: {
        Row: {
          mapping_ids: number[]
          user_id: string
        }
        Insert: {
          mapping_ids: number[]
          user_id?: string
        }
        Update: {
          mapping_ids?: number[]
          user_id?: string
        }
        Relationships: []
      }
      content: {
        Row: {
          created_at: string | null
          data: Json
          id: number
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          data?: Json
          id?: number
          title?: string
          type?: string
        }
        Update: {
          created_at?: string | null
          data?: Json
          id?: number
          title?: string
          type?: string
        }
        Relationships: []
      }
      course: {
        Row: {
          created_at: string | null
          description: string
          id: number
          image_url: string
          price: number
          subtitle: string
          tags: string[]
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string
          id?: number
          image_url?: string
          price?: number
          subtitle?: string
          tags?: string[]
          title?: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: number
          image_url?: string
          price?: number
          subtitle?: string
          tags?: string[]
          title?: string
        }
        Relationships: []
      }
      course_chapter_content_mapping: {
        Row: {
          chapter_id: number
          content_id: number
          course_id: number
          id: number
        }
        Insert: {
          chapter_id: number
          content_id: number
          course_id: number
          id?: number
        }
        Update: {
          chapter_id?: number
          content_id?: number
          course_id?: number
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "course_chapter_content_mapping_chapter_id_fkey"
            columns: ["chapter_id"]
            referencedRelation: "chapter"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_chapter_content_mapping_content_id_fkey"
            columns: ["content_id"]
            referencedRelation: "content"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_chapter_content_mapping_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "course"
            referencedColumns: ["id"]
          }
        ]
      }
      course_purchase: {
        Row: {
          course_id: number
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          course_id: number
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          course_id?: number
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_purchase_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "course"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      requesting_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

