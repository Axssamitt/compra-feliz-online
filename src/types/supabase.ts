
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: number
          name: string
          price: number
          description: string | null
          image_url: string | null
          category_id: number | null
          created_at: string | null
        }
        Insert: {
          id?: number
          name: string
          price: number
          description?: string | null
          image_url?: string | null
          category_id?: number | null
          created_at?: string | null
        }
        Update: {
          id?: number
          name?: string
          price?: number
          description?: string | null
          image_url?: string | null
          category_id?: number | null
          created_at?: string | null
        }
      }
      categories: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
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
  }
}

// Define user type separately since it's not in the Supabase schema
export type User = {
  id: number;
  username: string;
  password_hash: string;
};

export type Product = Database['public']['Tables']['products']['Row'] & {
  purchase_link: string; // Add this field to maintain compatibility with existing code
};

export type NewProduct = Database['public']['Tables']['products']['Insert'] & {
  purchase_link: string; // Add this field to maintain compatibility with existing code
};

export type UpdateProduct = Database['public']['Tables']['products']['Update'] & {
  purchase_link?: string; // Add this field to maintain compatibility with existing code
};
