CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'customer');
CREATE TYPE public.customer_type AS ENUM ('retail', 'wholesale');
CREATE TYPE public.wholesale_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE public.order_channel AS ENUM ('retail', 'wholesale');
CREATE TYPE public.order_status AS ENUM ('recebido', 'confirmado', 'em_preparacao', 'saiu_entrega', 'entregue', 'cancelado');
CREATE TYPE public.lj_sync_status AS ENUM ('not_sent', 'pending', 'sent', 'error');
CREATE TYPE public.sync_entity AS ENUM ('products', 'stock', 'sales');
CREATE TYPE public.integration_name AS ENUM ('lj', 'n8n', 'whatsapp');
CREATE TYPE public.integration_direction AS ENUM ('outbound', 'inbound');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT user_roles_user_role_key UNIQUE (user_id, role)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text,
  phone text,
  email text,
  customer_type public.customer_type NOT NULL DEFAULT 'retail',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  document text UNIQUE,
  document_type text,
  company_name text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.customers TO authenticated;
GRANT ALL ON public.customers TO service_role;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.wholesale_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL UNIQUE REFERENCES public.customers(id) ON DELETE CASCADE,
  cnpj text NOT NULL UNIQUE,
  company_name text NOT NULL,
  state_registration text,
  status public.wholesale_status NOT NULL DEFAULT 'pending',
  reviewed_by uuid,
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.wholesale_customers TO authenticated;
GRANT ALL ON public.wholesale_customers TO service_role;
ALTER TABLE public.wholesale_customers ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cod_produto text NOT NULL UNIQUE,
  nome text NOT NULL,
  unidade text NOT NULL,
  codigo_barras text,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  preco_varejo numeric(12,2),
  preco_atacado numeric(12,2),
  estoque numeric(12,3) NOT NULL DEFAULT 0,
  ativo boolean NOT NULL DEFAULT true,
  ultima_sincronizacao timestamptz,
  imagem_url text,
  payload_bruto jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT products_preco_varejo_nonnegative CHECK (preco_varejo IS NULL OR preco_varejo >= 0),
  CONSTRAINT products_preco_atacado_nonnegative CHECK (preco_atacado IS NULL OR preco_atacado >= 0)
);
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT, UPDATE, DELETE ON public.product_images TO authenticated;
GRANT ALL ON public.product_images TO service_role;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  cep text NOT NULL,
  logradouro text NOT NULL,
  numero text NOT NULL,
  complemento text,
  bairro text NOT NULL,
  cidade text NOT NULL,
  uf text NOT NULL,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.addresses TO authenticated;
GRANT ALL ON public.addresses TO service_role;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text NOT NULL UNIQUE,
  customer_id uuid NOT NULL REFERENCES public.customers(id),
  channel public.order_channel NOT NULL,
  status public.order_status NOT NULL DEFAULT 'recebido',
  subtotal numeric(12,2) NOT NULL,
  discount numeric(12,2) NOT NULL DEFAULT 0,
  shipping numeric(12,2),
  payment_method text,
  address_id uuid REFERENCES public.addresses(id) ON DELETE SET NULL,
  customer_notes text,
  lj_sync_status public.lj_sync_status NOT NULL DEFAULT 'not_sent',
  lj_sale_id text,
  lj_synced_at timestamptz,
  idempotency_key text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT orders_subtotal_nonnegative CHECK (subtotal >= 0),
  CONSTRAINT orders_discount_nonnegative CHECK (discount >= 0),
  CONSTRAINT orders_shipping_nonnegative CHECK (shipping IS NULL OR shipping >= 0)
);
GRANT SELECT, UPDATE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  cod_produto_snapshot text NOT NULL,
  nome_snapshot text NOT NULL,
  unidade_snapshot text NOT NULL,
  quantidade numeric(12,3) NOT NULL,
  unit_price numeric(12,2) NOT NULL,
  line_total numeric(12,2) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT order_items_positive_quantity CHECK (quantidade > 0),
  CONSTRAINT order_items_nonnegative_unit_price CHECK (unit_price >= 0),
  CONSTRAINT order_items_line_total_matches CHECK (line_total = round(quantidade * unit_price, 2))
);
GRANT SELECT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  from_status public.order_status,
  to_status public.order_status NOT NULL,
  changed_by uuid,
  changed_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.order_status_history TO authenticated;
GRANT ALL ON public.order_status_history TO service_role;
ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.sync_control (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity public.sync_entity NOT NULL UNIQUE,
  last_run_at timestamptz,
  last_success_at timestamptz,
  cursor text,
  status text,
  error_message text,
  running boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON COLUMN public.sync_control.cursor IS 'Não utilizado para paginação do LJ Sistemas.';
GRANT SELECT, INSERT, UPDATE, DELETE ON public.sync_control TO authenticated;
GRANT ALL ON public.sync_control TO service_role;
ALTER TABLE public.sync_control ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.integration_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integration public.integration_name NOT NULL,
  direction public.integration_direction NOT NULL,
  operation text NOT NULL,
  reference_id text,
  request_payload jsonb,
  response_payload jsonb,
  http_status integer,
  success boolean NOT NULL DEFAULT false,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.integration_logs IS 'Metadados operacionais de integrações futuras; senhas, tokens e credenciais são proibidos.';
GRANT SELECT, INSERT, UPDATE, DELETE ON public.integration_logs TO authenticated;
GRANT ALL ON public.integration_logs TO service_role;
ALTER TABLE public.integration_logs ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin') OR public.has_role(_user_id, 'staff');
$$;

CREATE OR REPLACE FUNCTION public.current_customer_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.id
  FROM public.customers c
  WHERE c.profile_id = auth.uid()
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.current_price_channel()
RETURNS public.order_channel
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE
    WHEN EXISTS (
      SELECT 1
      FROM public.customers c
      JOIN public.wholesale_customers wc ON wc.customer_id = c.id
      WHERE c.profile_id = auth.uid() AND wc.status = 'approved'
    ) THEN 'wholesale'::public.order_channel
    ELSE 'retail'::public.order_channel
  END;
$$;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_staff(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.current_customer_id() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.current_price_channel() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.current_customer_id() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.current_price_channel() TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, customer_type)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name', NEW.email, 'retail')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'customer')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.guard_profile_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() <> 'service_role' AND NOT public.has_role(auth.uid(), 'admin') THEN
    IF NEW.id IS DISTINCT FROM OLD.id
      OR NEW.email IS DISTINCT FROM OLD.email
      OR NEW.customer_type IS DISTINCT FROM OLD.customer_type
      OR NEW.created_at IS DISTINCT FROM OLD.created_at THEN
      RAISE EXCEPTION 'Only full_name and phone may be changed by the profile owner';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.guard_customer_ownership()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() <> 'service_role' AND NOT public.has_role(auth.uid(), 'admin') THEN
    IF TG_OP = 'INSERT' AND NEW.profile_id IS DISTINCT FROM auth.uid() THEN
      RAISE EXCEPTION 'Cannot create customer data for another profile';
    ELSIF TG_OP = 'UPDATE' AND NEW.profile_id IS DISTINCT FROM OLD.profile_id THEN
      RAISE EXCEPTION 'profile_id cannot be changed';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.guard_address_ownership()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() <> 'service_role' AND NOT public.is_staff(auth.uid()) THEN
    IF NEW.customer_id IS DISTINCT FROM public.current_customer_id() THEN
      RAISE EXCEPTION 'Cannot write an address for another customer';
    END IF;
    IF TG_OP = 'UPDATE' AND NEW.customer_id IS DISTINCT FROM OLD.customer_id THEN
      RAISE EXCEPTION 'customer_id cannot be changed';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.guard_wholesale_request()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.role() <> 'service_role' AND NOT public.has_role(auth.uid(), 'admin') THEN
    IF TG_OP = 'INSERT' THEN
      IF NEW.customer_id IS DISTINCT FROM public.current_customer_id() THEN
        RAISE EXCEPTION 'Cannot create a wholesale request for another customer';
      END IF;
      NEW.status := 'pending';
      NEW.reviewed_by := NULL;
      NEW.reviewed_at := NULL;
      NEW.rejection_reason := NULL;
    ELSE
      IF NEW.customer_id IS DISTINCT FROM OLD.customer_id()
        OR NEW.status IS DISTINCT FROM OLD.status
        OR NEW.reviewed_by IS DISTINCT FROM OLD.reviewed_by
        OR NEW.reviewed_at IS DISTINCT FROM OLD.reviewed_at
        OR NEW.rejection_reason IS DISTINCT FROM OLD.rejection_reason THEN
        RAISE EXCEPTION 'Wholesale review fields are admin-only';
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_order_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.order_status_history (order_id, from_status, to_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, auth.uid());
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER profiles_guard_update BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.guard_profile_update();
CREATE TRIGGER customers_set_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER customers_guard_ownership BEFORE INSERT OR UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.guard_customer_ownership();
CREATE TRIGGER wholesale_customers_set_updated_at BEFORE UPDATE ON public.wholesale_customers FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER wholesale_customers_guard BEFORE INSERT OR UPDATE ON public.wholesale_customers FOR EACH ROW EXECUTE FUNCTION public.guard_wholesale_request();
CREATE TRIGGER categories_set_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER products_set_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER addresses_set_updated_at BEFORE UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER addresses_guard_ownership BEFORE INSERT OR UPDATE ON public.addresses FOR EACH ROW EXECUTE FUNCTION public.guard_address_ownership();
CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER orders_record_status AFTER UPDATE OF status ON public.orders FOR EACH ROW EXECUTE FUNCTION public.record_order_status_change();
CREATE TRIGGER sync_control_set_updated_at BEFORE UPDATE ON public.sync_control FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Staff can read profiles" ON public.profiles FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "Admins can update profiles" ON public.profiles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Customers can read own customer record" ON public.customers FOR SELECT TO authenticated USING (profile_id = auth.uid());
CREATE POLICY "Staff can read customer records" ON public.customers FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Customers can insert own customer record" ON public.customers FOR INSERT TO authenticated WITH CHECK (profile_id = auth.uid());
CREATE POLICY "Customers can update own customer record" ON public.customers FOR UPDATE TO authenticated USING (profile_id = auth.uid()) WITH CHECK (profile_id = auth.uid());
CREATE POLICY "Customers can delete own customer record" ON public.customers FOR DELETE TO authenticated USING (profile_id = auth.uid());
CREATE POLICY "Admins can manage customers" ON public.customers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Customers can read own wholesale request" ON public.wholesale_customers FOR SELECT TO authenticated USING (customer_id = public.current_customer_id());
CREATE POLICY "Staff can read wholesale requests" ON public.wholesale_customers FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Customers can create own wholesale request" ON public.wholesale_customers FOR INSERT TO authenticated WITH CHECK (customer_id = public.current_customer_id() AND status = 'pending');
CREATE POLICY "Customers can update own wholesale request" ON public.wholesale_customers FOR UPDATE TO authenticated USING (customer_id = public.current_customer_id()) WITH CHECK (customer_id = public.current_customer_id());
CREATE POLICY "Admins can manage wholesale requests" ON public.wholesale_customers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Public can read active categories" ON public.categories FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY "Staff can read all categories" ON public.categories FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can insert categories" ON public.categories FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update categories" ON public.categories FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can delete categories" ON public.categories FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can read products" ON public.products FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update products" ON public.products FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can delete products" ON public.products FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

CREATE POLICY "Staff can read product images" ON public.product_images FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can insert product images" ON public.product_images FOR INSERT TO authenticated WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update product images" ON public.product_images FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff can delete product images" ON public.product_images FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

CREATE POLICY "Customers can read own addresses" ON public.addresses FOR SELECT TO authenticated USING (customer_id = public.current_customer_id());
CREATE POLICY "Staff can read addresses" ON public.addresses FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Customers can insert own addresses" ON public.addresses FOR INSERT TO authenticated WITH CHECK (customer_id = public.current_customer_id());
CREATE POLICY "Customers can update own addresses" ON public.addresses FOR UPDATE TO authenticated USING (customer_id = public.current_customer_id()) WITH CHECK (customer_id = public.current_customer_id());
CREATE POLICY "Customers can delete own addresses" ON public.addresses FOR DELETE TO authenticated USING (customer_id = public.current_customer_id());
CREATE POLICY "Admins can manage addresses" ON public.addresses FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Customers can read own orders" ON public.orders FOR SELECT TO authenticated USING (customer_id = public.current_customer_id());
CREATE POLICY "Staff can read all orders" ON public.orders FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff can update orders" ON public.orders FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "Customers can read own order items" ON public.order_items FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.customer_id = public.current_customer_id()));
CREATE POLICY "Staff can read all order items" ON public.order_items FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE POLICY "Customers can read own order history" ON public.order_status_history FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.customer_id = public.current_customer_id()));
CREATE POLICY "Staff can read all order history" ON public.order_status_history FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE POLICY "Admins can read sync control" ON public.sync_control FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert sync control" ON public.sync_control FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update sync control" ON public.sync_control FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete sync control" ON public.sync_control FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can read integration logs" ON public.integration_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert integration logs" ON public.integration_logs FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update integration logs" ON public.integration_logs FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete integration logs" ON public.integration_logs FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.get_catalog_products()
RETURNS TABLE (
  id uuid,
  cod_produto text,
  nome text,
  unidade text,
  codigo_barras text,
  category_id uuid,
  imagem_url text,
  estoque numeric,
  preco numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id,
    p.cod_produto,
    p.nome,
    p.unidade,
    p.codigo_barras,
    p.category_id,
    p.imagem_url,
    p.estoque,
    CASE WHEN p.preco_varejo IS NULL OR p.preco_varejo = 0 THEN NULL ELSE p.preco_varejo END AS preco
  FROM public.products p
  WHERE p.ativo = true;
$$;
REVOKE ALL ON FUNCTION public.get_catalog_products() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_catalog_products() TO anon, authenticated, service_role;

CREATE VIEW public.catalog_products
WITH (security_invoker = true)
AS
SELECT
  cp.id,
  cp.cod_produto,
  cp.nome,
  cp.unidade,
  cp.codigo_barras,
  cp.category_id,
  cp.imagem_url,
  cp.estoque,
  cp.preco
FROM public.get_catalog_products() AS cp;
GRANT SELECT ON public.catalog_products TO anon, authenticated, service_role;

CREATE UNIQUE INDEX user_roles_user_id_role_idx ON public.user_roles(user_id, role);
CREATE INDEX wholesale_customers_status_idx ON public.wholesale_customers(status);
CREATE INDEX products_active_idx ON public.products(ativo);
CREATE INDEX products_category_id_idx ON public.products(category_id);
CREATE INDEX products_codigo_barras_idx ON public.products(codigo_barras);
CREATE INDEX products_nome_trgm_idx ON public.products USING gin (nome gin_trgm_ops);
CREATE INDEX product_images_product_id_idx ON public.product_images(product_id);
CREATE UNIQUE INDEX product_images_one_primary_idx ON public.product_images(product_id) WHERE is_primary = true;
CREATE INDEX addresses_customer_id_idx ON public.addresses(customer_id);
CREATE INDEX orders_customer_id_idx ON public.orders(customer_id);
CREATE INDEX orders_status_idx ON public.orders(status);
CREATE INDEX order_items_order_id_idx ON public.order_items(order_id);
CREATE INDEX order_items_product_id_idx ON public.order_items(product_id);
CREATE INDEX order_status_history_order_id_idx ON public.order_status_history(order_id);
CREATE INDEX integration_logs_integration_created_at_idx ON public.integration_logs(integration, created_at DESC);