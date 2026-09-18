import { useCallback, useEffect, useMemo, useState } from 'react';
import { env, hasSupabaseConfig } from '../config/env.js';
import { getSupabase } from '../lib/supabase.js';
import { AuthContext } from './AuthContext.js';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(hasSupabaseConfig && !env.useDemoData);

  const resolveSession = useCallback(async (nextSession) => {
    setSession(nextSession);
    if (!nextSession) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    const { data, error } = await getSupabase().rpc('is_current_user_admin');
    setIsAdmin(!error && data === true);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!hasSupabaseConfig || env.useDemoData) return undefined;
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data }) => resolveSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      resolveSession(nextSession);
    });
    return () => data.subscription.unsubscribe();
  }, [resolveSession]);

  const signIn = useCallback(
    async (email, password) => {
      const { data, error } = await getSupabase().auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      const { data: allowed, error: authorizationError } =
        await getSupabase().rpc('is_current_user_admin');
      if (authorizationError || allowed !== true) {
        await getSupabase().auth.signOut();
        const error = new Error(
          'Esta cuenta no está autorizada para administrar el sitio.',
        );
        error.code = 'not_authorized';
        throw error;
      }
      await resolveSession(data.session);
    },
    [resolveSession],
  );

  const signOut = useCallback(async () => {
    if (hasSupabaseConfig) await getSupabase().auth.signOut();
    await resolveSession(null);
  }, [resolveSession]);

  const value = useMemo(
    () => ({ session, isAdmin, loading, signIn, signOut }),
    [session, isAdmin, loading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
