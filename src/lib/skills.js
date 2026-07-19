import { db } from '../firebaseClient'
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, writeBatch } from 'firebase/firestore'
import { mapSkillCategory, skillCategoryToDb, mapSkill, skillToDb } from './mappers'

const CATEGORIES_COLLECTION = 'skill_categories'
const SKILLS_COLLECTION = 'skills'

// ─── Skill Categories ───

export async function fetchSkillCategories() {
  const catQuery = query(collection(db, CATEGORIES_COLLECTION), orderBy('sort_order', 'asc'))
  const skillsQuery = query(collection(db, SKILLS_COLLECTION), orderBy('sort_order', 'asc'))

  const [catSnapshot, skillsSnapshot] = await Promise.all([
    getDocs(catQuery),
    getDocs(skillsQuery)
  ])

  const categories = catSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  const skills = skillsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))

  // دمج المهارات داخل فئاتها
  const categoriesWithSkills = categories.map(cat => ({
    ...cat,
    skills: skills.filter(s => s.category_id === cat.id)
  }))

  return categoriesWithSkills.map(mapSkillCategory)
}

export async function createSkillCategory(form) {
  const newCat = skillCategoryToDb(form)
  const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), newCat)
  return mapSkillCategory({ id: docRef.id, ...newCat, skills: [] })
}

export async function updateSkillCategory(id, form) {
  const docRef = doc(db, CATEGORIES_COLLECTION, id)
  const updatedData = skillCategoryToDb(form)
  await updateDoc(docRef, updatedData)
  return mapSkillCategory({ id, ...updatedData, skills: [] })
}

export async function deleteSkillCategory(id) {
  const docRef = doc(db, CATEGORIES_COLLECTION, id)
  await deleteDoc(docRef)
}

export async function updateSkillCategoriesBulk(categories) {
  const batch = writeBatch(db)
  
  categories.forEach((cat) => {
    const data = skillCategoryToDb(cat)
    if (cat.id) {
      const docRef = doc(db, CATEGORIES_COLLECTION, cat.id)
      batch.update(docRef, data)
    }
  })

  await batch.commit()
}

// ─── Skills ───

export async function createSkill(form) {
  const newSkill = skillToDb(form)
  const docRef = await addDoc(collection(db, SKILLS_COLLECTION), newSkill)
  return mapSkill({ id: docRef.id, ...newSkill })
}

export async function updateSkill(id, form) {
  const docRef = doc(db, SKILLS_COLLECTION, id)
  const updatedData = skillToDb(form)
  await updateDoc(docRef, updatedData)
  return mapSkill({ id, ...updatedData })
}

export async function deleteSkill(id) {
  const docRef = doc(db, SKILLS_COLLECTION, id)
  await deleteDoc(docRef)
}

export async function updateSkillsBulk(skills) {
  const batch = writeBatch(db)
  
  const updatedSkills = []
  
  skills.forEach((skill) => {
    const skillData = skillToDb(skill)
    if (skill.id) {
      const docRef = doc(db, SKILLS_COLLECTION, skill.id)
      batch.update(docRef, skillData)
      updatedSkills.push({ id: skill.id, ...skillData })
    }
  })

  await batch.commit()
  return updatedSkills.map(mapSkill)
}
