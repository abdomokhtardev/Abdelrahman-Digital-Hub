import { supabase } from '../supabaseClient'
import { mapArticle, articleToDb } from './mappers'

export async function fetchArticles() {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('published_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(mapArticle)
}

export async function fetchArticleById(id) {
  const { data, error } = await supabase.from('articles').select('*').eq('id', id).single()
  if (error) throw error
  return mapArticle(data)
}

export async function createArticle(form) {
  const { data, error } = await supabase
    .from('articles')
    .insert({ ...articleToDb(form), published_at: new Date().toISOString() })
    .select()
    .single()

  if (error) throw error
  return mapArticle(data)
}

export async function updateArticle(id, form) {
  const { data, error } = await supabase
    .from('articles')
    .update(articleToDb(form))
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapArticle(data)
}

export async function deleteArticle(id) {
  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) throw error
}
