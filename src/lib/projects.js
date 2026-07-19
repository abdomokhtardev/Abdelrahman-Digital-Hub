import { db } from '../firebaseClient'
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, writeBatch } from 'firebase/firestore'
import { mapProject, projectToDb } from './mappers'

const COLLECTION_NAME = 'projects'

export async function fetchProjects() {
  const q = query(collection(db, COLLECTION_NAME), orderBy('sort_order', 'asc'))
  const snapshot = await getDocs(q)
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  return data.map(mapProject)
}

export async function fetchProjectById(id) {
  const docRef = doc(db, COLLECTION_NAME, id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) throw new Error('المشروع غير موجود')
  return mapProject({ id: snapshot.id, ...snapshot.data() })
}

export async function createProject(form) {
  const newProject = projectToDb(form)
  const docRef = await addDoc(collection(db, COLLECTION_NAME), newProject)
  return mapProject({ id: docRef.id, ...newProject })
}

export async function updateProject(id, form) {
  const docRef = doc(db, COLLECTION_NAME, id)
  const updatedData = projectToDb(form)
  await updateDoc(docRef, updatedData)
  return mapProject({ id, ...updatedData })
}

export async function deleteProject(id) {
  const docRef = doc(db, COLLECTION_NAME, id)
  await deleteDoc(docRef)
}

export async function updateProjectsBulk(projects) {
  const batch = writeBatch(db)
  const updatedProjects = []
  
  projects.forEach((proj) => {
    const data = projectToDb(proj)
    if (proj.id) {
      const docRef = doc(db, COLLECTION_NAME, proj.id)
      batch.update(docRef, data)
      updatedProjects.push({ id: proj.id, ...data })
    }
  })

  await batch.commit()
  return updatedProjects.map(mapProject)
}
