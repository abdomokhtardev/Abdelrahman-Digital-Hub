import { supabase } from '../supabaseClient'
import { mapCuratedItem, curatedItemToDb } from './mappers'

export async function fetchCuratedContent() {
  const { data, error } = await supabase
    .from('curated_content')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []).map(mapCuratedItem)
}

export async function createCuratedItem(form) {
  const { data, error } = await supabase
    .from('curated_content')
    .insert(curatedItemToDb(form))
    .select()
    .single()

  if (error) throw error
  return mapCuratedItem(data)
}

export async function updateCuratedItem(id, form) {
  const { data, error } = await supabase
    .from('curated_content')
    .update(curatedItemToDb(form))
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapCuratedItem(data)
}

export async function deleteCuratedItem(id) {
  const { error } = await supabase.from('curated_content').delete().eq('id', id)
  if (error) throw error
}
