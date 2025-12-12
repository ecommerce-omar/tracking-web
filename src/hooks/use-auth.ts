"use client"

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const getUserName = () => {
    if (!user) return "Usuário"
    
    const metadata = user.user_metadata || {}
    return metadata?.name || 
           metadata?.full_name || 
           metadata?.display_name ||
           (user.email ? user.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "") ||
           "Usuário"
  }

  const getUserAvatar = () => {
    if (!user) return ""
    
    const metadata = user.user_metadata || {}
    return metadata?.avatar_url || metadata?.picture || ""
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isLoggedIn: !!user,
    userName: getUserName(),
    userEmail: user?.email || "",
    userAvatar: getUserAvatar()
  }
}