DROP POLICY "Customers can update own wholesale request" ON public.wholesale_customers;

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
      IF NEW.customer_id IS DISTINCT FROM OLD.customer_id
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

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT (_user_id = auth.uid() OR auth.role() = 'service_role')
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = _user_id AND role = _role
    );
$$;

REVOKE ALL ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.guard_profile_update() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.guard_customer_ownership() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.guard_address_ownership() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.guard_wholesale_request() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.record_order_status_change() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.current_price_channel() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.current_price_channel() TO service_role;