import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates and returns a Supabase browser client instance.
 * This function initializes a Supabase client configured for use in the browser environment.
 *
 * @returns {ReturnType<typeof createBrowserClient>} A Supabase client instance for browser operations
 *
 * @example
 * const supabase = createClient();
 * const { data, error } = await supabase.auth.getUser();
 *
 * @throws {Error} If NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables are not set
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
