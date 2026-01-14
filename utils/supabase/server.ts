import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates and returns a Supabase server client instance.
 * This function initializes a Supabase client configured for use in Next.js server components and API routes.
 * It handles cookie management for session persistence across requests.
 *
 * @async
 * @returns {Promise<ReturnType<typeof createServerClient>>} A Supabase client instance for server operations
 *
 * @example
 * const supabase = await createClient();
 * const { data: { user } } = await supabase.auth.getUser();
 *
 * @throws {Error} If NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables are not set
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignoredSJ if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
