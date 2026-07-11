import { supabase } from '../supabaseClient'

const BUCKET = 'blog-images'
const MAX_MB = 5
const TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export async function uploadImage(file, folder = 'articles') {
  if (!TYPES.includes(file.type)) throw new Error('نوع الملف غير مدعوم')
  if (file.size > MAX_MB * 1024 * 1024) throw new Error(`الحد الأقصى ${MAX_MB} ميجابايت`)

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file)
  if (error) throw error

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

export async function deleteImage(publicUrl) {
  if (!publicUrl || !publicUrl.includes(BUCKET)) return
  
  const parts = publicUrl.split(`/${BUCKET}/`)
  if (parts.length < 2) return
  const path = parts[1]

  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) console.error("Failed to delete image:", error)
}
