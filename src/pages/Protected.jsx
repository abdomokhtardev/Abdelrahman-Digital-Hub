import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { auth } from '../firebaseClient'
import { onAuthStateChanged } from 'firebase/auth'

function Protected({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user)
    })
    return () => unsubscribe()
  }, [])

  if (isLoggedIn === null) {
    return <p className="text-center text-sm text-muted">جاري التحقق...</p>
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />
}

export default Protected
