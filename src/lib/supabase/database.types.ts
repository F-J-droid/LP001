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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      banners: {
        Row: {
          created_at: string | null
          cta_label: string | null
          cta_url: string | null
          ends_at: string | null
          headline: string | null
          id: string
          image_url: string
          internal_name: string
          is_active: boolean | null
          position: string
          priority: number | null
          starts_at: string | null
          subheadline: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          cta_label?: string | null
          cta_url?: string | null
          ends_at?: string | null
          headline?: string | null
          id?: string
          image_url: string
          internal_name: string
          is_active?: boolean | null
          position: string
          priority?: number | null
          starts_at?: string | null
          subheadline?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          cta_label?: string | null
          cta_url?: string | null
          ends_at?: string | null
          headline?: string | null
          id?: string
          image_url?: string
          internal_name?: string
          is_active?: boolean | null
          position?: string
          priority?: number | null
          starts_at?: string | null
          subheadline?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      checkout_idempotency: {
        Row: {
          created_at: string
          expires_at: string
          idempotency_key: string
          order_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          idempotency_key: string
          order_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          idempotency_key?: string
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_idempotency_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          id: string
          low_stock_threshold: number | null
          quantity: number | null
          reserved_quantity: number | null
          tire_variant_id: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          low_stock_threshold?: number | null
          quantity?: number | null
          reserved_quantity?: number | null
          tire_variant_id: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          low_stock_threshold?: number | null
          quantity?: number | null
          reserved_quantity?: number | null
          tire_variant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_tire_variant_id_fkey"
            columns: ["tire_variant_id"]
            isOneToOne: true
            referencedRelation: "tire_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_addresses: {
        Row: {
          city: string
          complement: string | null
          created_at: string
          district: string
          id: string
          number: string
          order_id: string
          postal_code: string
          recipient_name: string
          state: string
          street: string
        }
        Insert: {
          city: string
          complement?: string | null
          created_at?: string
          district: string
          id?: string
          number: string
          order_id: string
          postal_code: string
          recipient_name: string
          state: string
          street: string
        }
        Update: {
          city?: string
          complement?: string | null
          created_at?: string
          district?: string
          id?: string
          number?: string
          order_id?: string
          postal_code?: string
          recipient_name?: string
          state?: string
          street?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_addresses_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          product_name: string
          quantity: number
          size_label: string | null
          sku: string
          subtotal_cents: number
          tire_variant_id: string
          unit_price_cents: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          product_name: string
          quantity: number
          size_label?: string | null
          sku: string
          subtotal_cents: number
          tire_variant_id: string
          unit_price_cents: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          product_name?: string
          quantity?: number
          size_label?: string | null
          sku?: string
          subtotal_cents?: number
          tire_variant_id?: string
          unit_price_cents?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_tire_variant_id_fkey"
            columns: ["tire_variant_id"]
            isOneToOne: false
            referencedRelation: "tire_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          created_at: string
          created_by: string | null
          from_status: string | null
          id: string
          note: string | null
          order_id: string
          to_status: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          from_status?: string | null
          id?: string
          note?: string | null
          order_id: string
          to_status: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          from_status?: string | null
          id?: string
          note?: string | null
          order_id?: string
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          currency: string
          customer_cpf: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          discount_cents: number
          external_customer_id: string | null
          external_payment_id: string | null
          id: string
          payment_method: string | null
          payment_status: string
          payment_url: string | null
          public_id: string
          reservation_expires_at: string | null
          shipping_cents: number
          shipping_estimated_max_days: number | null
          shipping_estimated_min_days: number | null
          shipping_method_id: string | null
          shipping_method_name: string | null
          status: string
          subtotal_cents: number
          total_cents: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          customer_cpf?: string | null
          customer_email: string
          customer_name: string
          customer_phone: string
          discount_cents?: number
          external_customer_id?: string | null
          external_payment_id?: string | null
          id?: string
          payment_method?: string | null
          payment_status: string
          payment_url?: string | null
          public_id: string
          reservation_expires_at?: string | null
          shipping_cents?: number
          shipping_estimated_max_days?: number | null
          shipping_estimated_min_days?: number | null
          shipping_method_id?: string | null
          shipping_method_name?: string | null
          status: string
          subtotal_cents: number
          total_cents: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          customer_cpf?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          discount_cents?: number
          external_customer_id?: string | null
          external_payment_id?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string
          payment_url?: string | null
          public_id?: string
          reservation_expires_at?: string | null
          shipping_cents?: number
          shipping_estimated_max_days?: number | null
          shipping_estimated_min_days?: number | null
          shipping_method_id?: string | null
          shipping_method_name?: string | null
          status?: string
          subtotal_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Relationships: []
      }
      prices: {
        Row: {
          created_at: string | null
          currency: string | null
          ends_at: string | null
          id: string
          is_active: boolean | null
          pix_price_cents: number | null
          regular_price_cents: number
          sale_price_cents: number | null
          starts_at: string | null
          tire_variant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          pix_price_cents?: number | null
          regular_price_cents: number
          sale_price_cents?: number | null
          starts_at?: string | null
          tire_variant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          pix_price_cents?: number | null
          regular_price_cents?: number
          sale_price_cents?: number | null
          starts_at?: string | null
          tire_variant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_tire_variant_id_fkey"
            columns: ["tire_variant_id"]
            isOneToOne: false
            referencedRelation: "tire_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          category_id: string
          tire_variant_id: string
        }
        Insert: {
          category_id: string
          tire_variant_id: string
        }
        Update: {
          category_id?: string
          tire_variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_tire_variant_id_fkey"
            columns: ["tire_variant_id"]
            isOneToOne: false
            referencedRelation: "tire_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          position: number | null
          tire_variant_id: string
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          position?: number | null
          tire_variant_id: string
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          position?: number | null
          tire_variant_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_tire_variant_id_fkey"
            columns: ["tire_variant_id"]
            isOneToOne: false
            referencedRelation: "tire_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      promotion_products: {
        Row: {
          promotion_id: string
          tire_variant_id: string
        }
        Insert: {
          promotion_id: string
          tire_variant_id: string
        }
        Update: {
          promotion_id?: string
          tire_variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotion_products_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotion_products_tire_variant_id_fkey"
            columns: ["tire_variant_id"]
            isOneToOne: false
            referencedRelation: "tire_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          created_at: string | null
          ends_at: string
          id: string
          is_active: boolean | null
          name: string
          slug: string
          starts_at: string
          type: string
          updated_at: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          ends_at: string
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          starts_at: string
          type: string
          updated_at?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          ends_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          starts_at?: string
          type?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      tire_brands: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tire_models: {
        Row: {
          brand_id: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          updated_at: string | null
          vehicle_type: string | null
        }
        Insert: {
          brand_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          updated_at?: string | null
          vehicle_type?: string | null
        }
        Update: {
          brand_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          updated_at?: string | null
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tire_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "tire_brands"
            referencedColumns: ["id"]
          },
        ]
      }
      tire_sizes: {
        Row: {
          created_at: string | null
          id: string
          profile: number
          rim: number
          width: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          profile: number
          rim: number
          width: number
        }
        Update: {
          created_at?: string | null
          id?: string
          profile?: number
          rim?: number
          width?: number
        }
        Relationships: []
      }
      tire_variants: {
        Row: {
          created_at: string | null
          ean: string | null
          efficiency: string | null
          external_noise_db: number | null
          free_shipping: boolean | null
          id: string
          inmetro_code: string | null
          is_active: boolean | null
          is_best_seller: boolean | null
          is_featured: boolean | null
          is_new: boolean | null
          load_index: string | null
          reinforced: boolean | null
          run_flat: boolean | null
          sku: string
          speed_index: string | null
          tire_model_id: string
          tire_size_id: string
          updated_at: string | null
          warranty_months: number | null
          wet_grip: string | null
        }
        Insert: {
          created_at?: string | null
          ean?: string | null
          efficiency?: string | null
          external_noise_db?: number | null
          free_shipping?: boolean | null
          id?: string
          inmetro_code?: string | null
          is_active?: boolean | null
          is_best_seller?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          load_index?: string | null
          reinforced?: boolean | null
          run_flat?: boolean | null
          sku: string
          speed_index?: string | null
          tire_model_id: string
          tire_size_id: string
          updated_at?: string | null
          warranty_months?: number | null
          wet_grip?: string | null
        }
        Update: {
          created_at?: string | null
          ean?: string | null
          efficiency?: string | null
          external_noise_db?: number | null
          free_shipping?: boolean | null
          id?: string
          inmetro_code?: string | null
          is_active?: boolean | null
          is_best_seller?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          load_index?: string | null
          reinforced?: boolean | null
          run_flat?: boolean | null
          sku?: string
          speed_index?: string | null
          tire_model_id?: string
          tire_size_id?: string
          updated_at?: string | null
          warranty_months?: number | null
          wet_grip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tire_variants_tire_model_id_fkey"
            columns: ["tire_model_id"]
            isOneToOne: false
            referencedRelation: "tire_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tire_variants_tire_size_id_fkey"
            columns: ["tire_size_id"]
            isOneToOne: false
            referencedRelation: "tire_sizes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cancel_pending_order: { Args: { p_order_id: string }; Returns: Json }
      create_pending_order: { Args: { payload: Json }; Returns: Json }
      expire_pending_orders: { Args: never; Returns: number }
      is_admin: { Args: never; Returns: boolean }
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
