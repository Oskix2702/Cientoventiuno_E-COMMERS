/*
# Fix admin profile and make trigger idempotent

## Purpose
1. Ensure estebarin123@gmail.com has admin role in profiles table.
2. Make the handle_new_user() trigger function idempotent using
   INSERT ... ON CONFLICT so re-registration or re-triggering doesn't fail.

## Changes
1. Update handle_new_user() to use ON CONFLICT (id) DO UPDATE so it
   won't error if a profile row already exists for that user.
2. Upsert the admin profile row for estebarin123@gmail.com as a safety net.
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'estebarin123@gmail.com' THEN
    INSERT INTO public.profiles (id, email, role)
    VALUES (NEW.id, NEW.email, 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin', email = NEW.email;
  ELSE
    INSERT INTO public.profiles (id, email, role)
    VALUES (NEW.id, NEW.email, 'customer')
    ON CONFLICT (id) DO UPDATE SET email = NEW.email;
  END IF;
  RETURN NEW;
END;
$$;

-- Safety net: ensure admin profile exists and has admin role
INSERT INTO public.profiles (id, email, role)
SELECT au.id, au.email, 'admin'
FROM auth.users au
WHERE au.email = 'estebarin123@gmail.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';
