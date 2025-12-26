import { createClient } from "@/utils/supabase/client";

export interface AuthUserData {
  id: string;
  email: string;
  aud: string;
  role: string;
  created_at: string;
  updated_at: string;
  raw_user_meta_data: Record<string, unknown> | null;
  user_metadata: Record<string, unknown> | null;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Busca dados seguros do usuário da view safe_auth_users ou diretamente da sessão
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const supabase = createClient();
    
    // Primeiro, pega o usuário atual da sessão
    const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
    
    if (sessionError || !sessionData.user) {
      console.error("Erro ao obter sessão:", sessionError);
      return null;
    }

    const user = sessionData.user;

    // Tenta buscar dados da view segura primeiro
    let userData = null;
    try {
      const { data: viewData, error: viewError } = await supabase
        .from('safe_auth_users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!viewError && viewData) {
        userData = viewData;
      }
    } catch (viewError) {
      console.warn("View safe_auth_users não disponível, usando dados da sessão:", viewError);
    }

    // Se a view não funcionar, usa dados da sessão atual
    if (!userData) {
      userData = {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
        raw_user_meta_data: (user as unknown as { raw_user_meta_data: Record<string, unknown> }).raw_user_meta_data,
        created_at: user.created_at,
        updated_at: user.updated_at || user.created_at,
        aud: user.aud,
        role: user.role,
      };
    }

    // Processa os metadados para extrair informações do perfil
    const metadata = userData.user_metadata || userData.raw_user_meta_data || {};
    
    // Prioridade: dados customizados > dados OAuth > dados extraídos
    const userMetadata = userData.user_metadata || {};
    const rawMetadata = userData.raw_user_meta_data || {};
    
    const name = userMetadata?.custom_full_name || // Nome editado pelo usuário (prioridade)
                 userMetadata?.full_name || 
                 userMetadata?.name || 
                 rawMetadata?.full_name ||
                 rawMetadata?.name || 
                 rawMetadata?.display_name ||
                 (userData.email ? userData.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : "") ||
                 "Usuário";
    
    const avatarUrl = userMetadata?.custom_avatar_url || // Avatar personalizado (prioridade)
                     userMetadata?.avatar_url || 
                     rawMetadata?.avatar_url || 
                     rawMetadata?.picture || "";
    
    // Determina o provider baseado nos metadados
    const provider = metadata?.provider || 
                    (metadata?.iss?.includes('google') ? 'google' : 'email');

    return {
      id: userData.id,
      name,
      email: userData.email || "",
      avatarUrl,
      provider,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at,
    };
  } catch (error) {
    console.error("Erro inesperado ao buscar perfil do usuário:", error);
    return null;
  }
}

/**
 * Busca dados brutos do auth.users (para casos específicos)
 */
export async function getCurrentUserAuthData(): Promise<AuthUserData | null> {
  try {
    const supabase = createClient();
    
    const { data: sessionData, error: sessionError } = await supabase.auth.getUser();
    
    if (sessionError || !sessionData.user) {
      return null;
    }

    const user = sessionData.user;

    // Tenta buscar dados da view segura primeiro
    try {
      const { data: userData, error: userError } = await supabase
        .from('safe_auth_users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!userError && userData) {
        return userData as AuthUserData;
      }
    } catch {
      console.warn("View safe_auth_users não disponível, usando dados da sessão");
    }

    // Fallback para dados da sessão
    return {
      id: user.id,
      email: user.email || "",
      aud: user.aud,
      role: user.role || "",
      created_at: user.created_at,
      updated_at: user.updated_at || user.created_at,
      raw_user_meta_data: (user as unknown as { raw_user_meta_data: Record<string, unknown> }).raw_user_meta_data || null,
      user_metadata: user.user_metadata || null,
    };
  } catch (error) {
    console.error("Erro ao buscar dados auth do usuário:", error);
    return null;
  }
}