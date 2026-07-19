import { db } from '../firebaseClient'
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, writeBatch } from 'firebase/firestore'
import { mapCuratedItem, curatedItemToDb } from './mappers'

const COLLECTION_NAME = 'curated_content'

export async function fetchCuratedContent() {
  const q = query(collection(db, COLLECTION_NAME), orderBy('sort_order', 'asc'))
  const snapshot = await getDocs(q)
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  return data.map(mapCuratedItem)
}

export async function createCuratedItem(form) {
  const newItem = curatedItemToDb(form)
  const docRef = await addDoc(collection(db, COLLECTION_NAME), newItem)
  return mapCuratedItem({ id: docRef.id, ...newItem })
}

export async function updateCuratedItem(id, form) {
  const docRef = doc(db, COLLECTION_NAME, id)
  const updatedData = curatedItemToDb(form)
  await updateDoc(docRef, updatedData)
  return mapCuratedItem({ id, ...updatedData })
}

export async function deleteCuratedItem(id) {
  const docRef = doc(db, COLLECTION_NAME, id)
  await deleteDoc(docRef)
}

export async function updateCuratedBulk(items) {
  const batch = writeBatch(db)
  const updatedItems = []
  
  items.forEach((item) => {
    const data = curatedItemToDb(item)
    if (item.id) {
      const docRef = doc(db, COLLECTION_NAME, item.id)
      batch.update(docRef, data)
      updatedItems.push({ id: item.id, ...data })
    }
  })

  await batch.commit()
  return updatedItems.map(mapCuratedItem)
}
