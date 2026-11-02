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
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          bairro: string
          cep: string
          cidade: string
          complemento: string | null
          created_at: string
          customer_id: string
          id: string
          is_default: boolean
          logradouro: string
          numero: string
          uf: string
          updated_at: string
        }
        Insert: {
          bairro: string
          cep: string
          cidade: string
          complemento?: string | null
          created_at?: string
          customer_id: string
          id?: string
          is_default?: boolean
          logradouro: string
          numero: string
          uf: string
          updated_at?: string
        }
        Update: {
          bairro?: string
          cep?: string
          cidade?: string
          complemento?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          is_default?: boolean
          logradouro?: string
          numero?: string
          uf?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          company_name: string | null
          created_at: string
          document: string | null
          document_type: string | null
          id: string
          notes: string | null
          profile_id: string
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          document?: string | null
          document_type?: string | null
          id?: string
          notes?: string | null
          profile_id: string
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          document?: string | null
          document_type?: string | null
          id?: string
          notes?: string | null
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_logs: {
        Row: {
          created_at: string
          direction: Database["public"]["Enums"]["integration_direction"]
          error_message: string | null
          http_status: number | null
          id: string
          integration: Database["public"]["Enums"]["integration_name"]
          operation: string
          reference_id: string | null
          request_payload: Json | null
          response_payload: Json | null
          success: boolean
        }
        Insert: {
          created_at?: string
          direction: Database["public"]["Enums"]["integration_direction"]
          error_message?: string | null
          http_status?: number | null
          id?: string
          integration: Database["public"]["Enums"]["integration_name"]
          operation: string
          reference_id?: string | null
          request_payload?: Json | null
          response_payload?: Json | null
          success?: boolean
        }
        Update: {
          created_at?: string
          direction?: Database["public"]["Enums"]["integration_direction"]
          error_message?: string | null
          http_status?: number | null
          id?: string
          integration?: Database["public"]["Enums"]["integration_name"]
          operation?: string
          reference_id?: string | null
          request_payload?: Json | null
          response_payload?: Json | null
          success?: boolean
        }
        Relationships: []
      }
      order_items: {
        Row: {
          cod_produto_snapshot: string
          created_at: string
          id: string
          line_total: number
          nome_snapshot: string
          order_id: string
          product_id: string | null
          quantidade: number
          unidade_snapshot: string
          unit_price: number
        }
        Insert: {
          cod_produto_snapshot: string
          created_at?: string
          id?: string
          line_total: number
          nome_snapshot: string
          order_id: string
          product_id?: string | null
          quantidade: number
          unidade_snapshot: string
          unit_price: number
        }
        Update: {
          cod_produto_snapshot?: string
          created_at?: string
          id?: string
          line_total?: number
          nome_snapshot?: string
          order_id?: string
          product_id?: string | null
          quantidade?: number
          unidade_snapshot?: string
          unit_price?: number
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
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_at: string
          changed_by: string | null
          from_status: Database["public"]["Enums"]["order_status"] | null
          id: string
          order_id: string
          to_status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          from_status?: Database["public"]["Enums"]["order_status"] | null
          id?: string
          order_id: string
          to_status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          from_status?: Database["public"]["Enums"]["order_status"] | null
          id?: string
          order_id?: string
          to_status?: Database["public"]["Enums"]["order_status"]
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
          address_id: string | null
          channel: Database["public"]["Enums"]["order_channel"]
          created_at: string
          customer_id: string
          customer_notes: string | null
          discount: number
          id: string
          idempotency_key: string
          lj_sale_id: string | null
          lj_sync_status: Database["public"]["Enums"]["lj_sync_status"]
          lj_synced_at: string | null
          order_number: string
          payment_method: string | null
          shipping: number | null
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          updated_at: string
        }
        Insert: {
          address_id?: string | null
          channel: Database["public"]["Enums"]["order_channel"]
          created_at?: string
          customer_id: string
          customer_notes?: string | null
          discount?: number
          id?: string
          idempotency_key: string
          lj_sale_id?: string | null
          lj_sync_status?: Database["public"]["Enums"]["lj_sync_status"]
          lj_synced_at?: string | null
          order_number: string
          payment_method?: string | null
          shipping?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          updated_at?: string
        }
        Update: {
          address_id?: string | null
          channel?: Database["public"]["Enums"]["order_channel"]
          created_at?: string
          customer_id?: string
          customer_notes?: string | null
          discount?: number
          id?: string
          idempotency_key?: string
          lj_sale_id?: string | null
          lj_sync_status?: Database["public"]["Enums"]["lj_sync_status"]
          lj_synced_at?: string | null
          order_number?: string
          payment_method?: string | null
          shipping?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "addresses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean
          product_id: string
          sort_order: number
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean
          product_id: string
          sort_order?: number
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean
          product_id?: string
          sort_order?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          ativo: boolean
          category_id: string | null
          cod_produto: string
          codigo_barras: string | null
          created_at: string
          estoque: number
          id: string
          imagem_url: string | null
          nome: string
          payload_bruto: Json | null
          preco_atacado: number | null
          preco_varejo: number | null
          ultima_sincronizacao: string | null
          unidade: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          category_id?: string | null
          cod_produto: string
          codigo_barras?: string | null
          created_at?: string
          estoque?: number
          id?: string
          imagem_url?: string | null
          nome: string
          payload_bruto?: Json | null
          preco_atacado?: number | null
          preco_varejo?: number | null
          ultima_sincronizacao?: string | null
          unidade: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          category_id?: string | null
          cod_produto?: string
          codigo_barras?: string | null
          created_at?: string
          estoque?: number
          id?: string
          imagem_url?: string | null
          nome?: string
          payload_bruto?: Json | null
          preco_atacado?: number | null
          preco_varejo?: number | null
          ultima_sincronizacao?: string | null
          unidade?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          customer_type: Database["public"]["Enums"]["customer_type"]
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          customer_type?: Database["public"]["Enums"]["customer_type"]
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          customer_type?: Database["public"]["Enums"]["customer_type"]
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      sync_control: {
        Row: {
          created_at: string
          cursor: string | null
          entity: Database["public"]["Enums"]["sync_entity"]
          error_message: string | null
          id: string
          last_run_at: string | null
          last_success_at: string | null
          running: boolean
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          cursor?: string | null
          entity: Database["public"]["Enums"]["sync_entity"]
          error_message?: string | null
          id?: string
          last_run_at?: string | null
          last_success_at?: string | null
          running?: boolean
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          cursor?: string | null
          entity?: Database["public"]["Enums"]["sync_entity"]
          error_message?: string | null
          id?: string
          last_run_at?: string | null
          last_success_at?: string | null
          running?: boolean
          status?: string | null
          updated_at?: string
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
      wholesale_customers: {
        Row: {
          cnpj: string
          company_name: string
          created_at: string
          customer_id: string
          id: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          state_registration: string | null
          status: Database["public"]["Enums"]["wholesale_status"]
          updated_at: string
        }
        Insert: {
          cnpj: string
          company_name: string
          created_at?: string
          customer_id: string
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          state_registration?: string | null
          status?: Database["public"]["Enums"]["wholesale_status"]
          updated_at?: string
        }
        Update: {
          cnpj?: string
          company_name?: string
          created_at?: string
          customer_id?: string
          id?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          state_registration?: string | null
          status?: Database["public"]["Enums"]["wholesale_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wholesale_customers_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: true
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      catalog_products: {
        Row: {
          category_id: string | null
          cod_produto: string | null
          codigo_barras: string | null
          estoque: number | null
          id: string | null
          imagem_url: string | null
          nome: string | null
          preco: number | null
          unidade: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      current_customer_id: { Args: never; Returns: string }
      current_price_channel: {
        Args: never
        Returns: Database["public"]["Enums"]["order_channel"]
      }
      get_catalog_products: {
        Args: never
        Returns: {
          category_id: string
          cod_produto: string
          codigo_barras: string
          estoque: number
          id: string
          imagem_url: string
          nome: string
          preco: number
          unidade: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      app_role: "admin" | "staff" | "customer"
      customer_type: "retail" | "wholesale"
      integration_direction: "outbound" | "inbound"
      integration_name: "lj" | "n8n" | "whatsapp"
      lj_sync_status: "not_sent" | "pending" | "sent" | "error"
      order_channel: "retail" | "wholesale"
      order_status:
        | "recebido"
        | "confirmado"
        | "em_preparacao"
        | "saiu_entrega"
        | "entregue"
        | "cancelado"
      sync_entity: "products" | "stock" | "sales"
      wholesale_status: "pending" | "approved" | "rejected"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "staff", "customer"],
      customer_type: ["retail", "wholesale"],
      integration_direction: ["outbound", "inbound"],
      integration_name: ["lj", "n8n", "whatsapp"],
      lj_sync_status: ["not_sent", "pending", "sent", "error"],
      order_channel: ["retail", "wholesale"],
      order_status: [
        "recebido",
        "confirmado",
        "em_preparacao",
        "saiu_entrega",
        "entregue",
        "cancelado",
      ],
      sync_entity: ["products", "stock", "sales"],
      wholesale_status: ["pending", "approved", "rejected"],
    },
  },
} as const
