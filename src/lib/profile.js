import { db } from '../firebaseClient'
import { collection, doc, getDocs, setDoc, addDoc, query, limit } from 'firebase/firestore'
import { mapProfile, profileToDb } from './mappers'

const COLLECTION_NAME = 'profiles'

export async function fetchProfile() {
  const q = query(collection(db, COLLECTION_NAME), limit(1))
  const snapshot = await getDocs(q)
  if (snapshot.empty) return null
  const firstDoc = snapshot.docs[0]
  return mapProfile({ id: firstDoc.id, ...firstDoc.data() })
}

export async function saveProfile({ id, ...form }) {
  const payload = profileToDb(form)

  if (id) {
    const docRef = doc(db, COLLECTION_NAME, id)
    await setDoc(docRef, payload, { merge: true })
    return mapProfile({ id, ...payload })
  }

  const docRef = await addDoc(collection(db, COLLECTION_NAME), payload)
  return mapProfile({ id: docRef.id, ...payload })
}
