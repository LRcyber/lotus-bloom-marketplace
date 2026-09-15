REVOKE ALL ON TABLE public.user_roles FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.user_roles TO authenticated;

REVOKE ALL ON TABLE public.profiles FROM anon, authenticated;
GRANT SELECT, UPDATE ON TABLE public.profiles TO authenticated;

REVOKE ALL ON TABLE public.customers FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.customers TO authenticated;

REVOKE ALL ON TABLE public.wholesale_customers FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.wholesale_customers TO authenticated;

REVOKE ALL ON TABLE public.categories FROM anon, authenticated;
GRANT SELECT ON TABLE public.categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.categories TO authenticated;

REVOKE ALL ON TABLE public.products FROM anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.products TO authenticated;

REVOKE ALL ON TABLE public.product_images FROM anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.product_images TO authenticated;

REVOKE ALL ON TABLE public.addresses FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.addresses TO authenticated;

REVOKE ALL ON TABLE public.orders FROM anon, authenticated;
GRANT SELECT, UPDATE ON TABLE public.orders TO authenticated;

REVOKE ALL ON TABLE public.order_items FROM anon, authenticated;
GRANT SELECT ON TABLE public.order_items TO authenticated;

REVOKE ALL ON TABLE public.order_status_history FROM anon, authenticated;
GRANT SELECT ON TABLE public.order_status_history TO authenticated;

REVOKE ALL ON TABLE public.sync_control FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.sync_control TO authenticated;

REVOKE ALL ON TABLE public.integration_logs FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.integration_logs TO authenticated;

REVOKE ALL ON TABLE public.catalog_products FROM anon, authenticated;
GRANT SELECT ON TABLE public.catalog_products TO anon, authenticated;