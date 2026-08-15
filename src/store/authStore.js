import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuth = create((set) => ({
  user: null,
  profile: null,
  loading: true,

  init: () => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        set({ user: session.user, loading: false })
        loadProfile(session.user.id, set)
      } else {
        set({ user: null, loading: false })
      }
    })

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        set({ user: null, profile: null })
      } else if (session?.user) {
        set({ user: session.user })
        loadProfile(session.user.id, set)
      }
    })
  },

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  },

  signUp: async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, profile: null })
  },
}))

async function loadProfile(userId, set) {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
  set({ profile: data })
}
