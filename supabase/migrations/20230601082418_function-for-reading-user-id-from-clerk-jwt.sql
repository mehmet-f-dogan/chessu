set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.requesting_user_id()
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$function$
;


