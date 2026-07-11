import { supabase } from '../supabaseClient'
import { mapSkillCategory, skillCategoryToDb, mapSkill, skillToDb } from './mappers'

// ─── Skill Categories ───

export async function fetchSkillCategories() {
  const { data, error } = await supabase
    .from('skill_categories')
    .select('*, skills(*)')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return (data ?? []).map(mapSkillCategory)
}

export async function createSkillCategory(form) {
  const { data, error } = await supabase
    .from('skill_categories')
    .insert(skillCategoryToDb(form))
    .select()
    .single()

  if (error) throw error
  return mapSkillCategory({ ...data, skills: [] })
}

export async function updateSkillCategory(id, form) {
  const { data, error } = await supabase
    .from('skill_categories')
    .update(skillCategoryToDb(form))
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapSkillCategory({ ...data, skills: [] })
}

export async function deleteSkillCategory(id) {
  const { error } = await supabase.from('skill_categories').delete().eq('id', id)
  if (error) throw error
}

// ─── Skills ───

export async function createSkill(form) {
  const { data, error } = await supabase
    .from('skills')
    .insert(skillToDb(form))
    .select()
    .single()

  if (error) throw error
  return mapSkill(data)
}

export async function updateSkill(id, form) {
  const { data, error } = await supabase
    .from('skills')
    .update(skillToDb(form))
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return mapSkill(data)
}

export async function deleteSkill(id) {
  const { error } = await supabase.from('skills').delete().eq('id', id)
  if (error) throw error
}

export async function updateSkillsBulk(skills) {
  const { data, error } = await supabase
    .from('skills')
    .upsert(skills.map(skillToDb))
    .select()

  if (error) throw error
  return data.map(mapSkill)
}
