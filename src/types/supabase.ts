
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
          purchase_link: string | null
        }
        Insert: {
          id?: number
          name: string
          price: number
          description?: string | null
          image_url?: string | null
          category_id?: number | null
          created_at?: string | null
          purchase_link?: string | null
        }
        Update: {
          id?: number
          name?: string
          price?: number
          description?: string | null
          image_url?: string | null
          category_id?: number | null
          created_at?: string | null
          purchase_link?: string | null
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
      product_images: {
        Row: {
          id: string
          product_id: number
          image_url: string
          image_path: string | null
          is_main: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: number
          image_url: string
          image_path?: string | null
          is_main?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: number
          image_url?: string
          image_path?: string | null
          is_main?: boolean | null
          created_at?: string
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

export type Product = Database['public']['Tables']['products']['Row'];

export type NewProduct = Database['public']['Tables']['products']['Insert'];

export type UpdateProduct = Database['public']['Tables']['products']['Update'];

export type Category = Database['public']['Tables']['categories']['Row'];

export type ProductImage = Database['public']['Tables']['product_images']['Row'];
