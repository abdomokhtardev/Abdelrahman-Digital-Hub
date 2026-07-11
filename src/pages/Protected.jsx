import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function Protected({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setIsLoggedIn(!!data.session))
  }, [])

  if (isLoggedIn === null) {
    return <p className="text-center text-sm text-muted">جاري التحقق...</p>
  }

  return isLoggedIn ? children : <Navigate to="/login" replace />
}

export default Protected
