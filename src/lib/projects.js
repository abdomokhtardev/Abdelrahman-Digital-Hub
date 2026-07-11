import { supabase } from '../supabaseClient'
import { mapProject, projectToDb } from './mappers'

export async function fetchProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []).map(mapProject)
}

export async function fetchProjectById(id) {
  const { data, error } = await supabase.from('projects').select('*').eq('id', id).single()
  if (error) throw error
  return mapProject(data)
}

export async function createProject(form) {
  const { data, error } = await supabase
    .from('projects')
    .insert(projectToDb(form))
    .select()
    .single()

  if (error) throw error
  return mapProject(data)
}

export async function updateProject(id, form) {
  const { data, error } = await supabase
    .from('projects')
    .update(projectToDb(form))
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapProject(data)
}

export async function deleteProject(id) {
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}
