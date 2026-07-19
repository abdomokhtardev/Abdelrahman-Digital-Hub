import { db } from '../firebaseClient'
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, writeBatch } from 'firebase/firestore'
import { mapArticle, articleToDb } from './mappers'

const COLLECTION_NAME = 'articles'

export async function fetchArticles() {
  const q = query(collection(db, COLLECTION_NAME), orderBy('sort_order', 'asc'))
  const snapshot = await getDocs(q)
  const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  return data.map(mapArticle)
}

export async function fetchArticleById(id) {
  const docRef = doc(db, COLLECTION_NAME, id)
  const snapshot = await getDoc(docRef)
  if (!snapshot.exists()) throw new Error('المقال غير موجود')
  return mapArticle({ id: snapshot.id, ...snapshot.data() })
}

export async function createArticle(form) {
  const newArticle = { ...articleToDb(form), published_at: new Date().toISOString() }
  const docRef = await addDoc(collection(db, COLLECTION_NAME), newArticle)
  return mapArticle({ id: docRef.id, ...newArticle })
}

export async function updateArticle(id, form) {
  const docRef = doc(db, COLLECTION_NAME, id)
  const updatedData = articleToDb(form)
  await updateDoc(docRef, updatedData)
  
  // لجلب البيانات المحدثة (أو يمكن إرجاع البيانات المحدثة مع الـ id مباشرة)
  return mapArticle({ id, ...updatedData })
}

export async function deleteArticle(id) {
  const docRef = doc(db, COLLECTION_NAME, id)
  await deleteDoc(docRef)
}

export async function updateArticlesBulk(articles) {
  const batch = writeBatch(db)
  const updatedArticles = []
  
  articles.forEach((article) => {
    const data = articleToDb(article)
    if (article.id) {
      const docRef = doc(db, COLLECTION_NAME, article.id)
      batch.update(docRef, data)
      updatedArticles.push({ id: article.id, ...data })
    }
  })

  await batch.commit()
  return updatedArticles.map(mapArticle)
}
