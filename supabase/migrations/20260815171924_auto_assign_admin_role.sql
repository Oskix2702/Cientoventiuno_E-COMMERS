/*
# Auto-assign admin role for specific email

## Purpose
Ensure that the email `estebarin123@gmail.com` automatically receives
the `admin` role when registering or signing in.

## Changes
1. Update `handle_new_user()` trigger function to check the email
   and assign 'admin' role for the designated admin email.
2. Update any existing profile with that email to 'admin' in case
   the user already registered before this change.

## Security
- The trigger is SECURITY DEFINER so it can write to profiles.
- Only the designated email gets 'admin'; all others stay 'customer'.
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
    VALUES (NEW.id, NEW.email, 'admin');
  ELSE
    INSERT INTO public.profiles (id, email, role)
    VALUES (NEW.id, NEW.email, 'customer');
  END IF;
  RETURN NEW;
END;
$$;

-- Update existing profile if the admin user already registered
UPDATE public.profiles
SET role = 'admin'
WHERE email = 'estebarin123@gmail.com';
