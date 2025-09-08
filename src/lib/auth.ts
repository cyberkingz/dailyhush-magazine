import { supabase } from './supabase'

export async function requireEditor() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, reason: 'unauth' as const }

  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  if (error || !data || !['admin','editor'].includes(data.role)) {
    return { ok: false as const, reason: 'forbidden' as const }
  }
  return { ok: true as const }
}

