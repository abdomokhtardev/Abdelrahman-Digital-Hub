import { supabase } from '../supabaseClient'
import { mapProfile, profileToDb } from './mappers'

export async function fetchProfile() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1).maybeSingle()
  if (error) throw error
  return data ? mapProfile(data) : null
}

export async function saveProfile({ id, ...form }) {
  const payload = profileToDb(form)

  if (id) {
    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return mapProfile(data)
  }

  const { data, error } = await supabase.from('profiles').insert(payload).select().single()
  if (error) throw error
  return mapProfile(data)
}
