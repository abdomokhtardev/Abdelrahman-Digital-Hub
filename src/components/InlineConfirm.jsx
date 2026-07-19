import { useState } from 'react'

export function InlineConfirm({ onConfirm, buttonClass, children, confirmText = 'تأكيد الحذف؟' }) {
  const [confirming, setConfirming] = useState(false)

  if (confirming) {
    return (
      <>
        <button 
          type="button" 
          onClick={() => {
            setConfirming(false)
            onConfirm()
          }} 
          className="rounded px-2 py-1 text-xs bg-terracotta text-white font-bold hover:bg-terracotta-dark"
        >
          {confirmText}
        </button>
        <button 
          type="button" 
          onClick={() => setConfirming(false)} 
          className="rounded px-2 py-1 text-xs bg-sand-200 dark:bg-sand-800 hover:bg-sand-300 dark:hover:bg-sand-700"
        >
          إلغاء
        </button>
      </>
    )
  }

  return (
    <button 
      type="button" 
      onClick={() => setConfirming(true)} 
      className={buttonClass || "rounded px-2 py-1 text-xs text-terracotta hover:bg-terracotta/10"}
    >
      {children || 'حذف'}
    </button>
  )
}
