import { useState } from 'react'

export function useDragAndDrop({ items, onReorder }) {
  const [draggedId, setDraggedId] = useState(null)
  const [dragOverId, setDragOverId] = useState(null)

  const handleDragStart = (e, id) => {
    e.stopPropagation()
    setDraggedId(id)
    e.dataTransfer.effectAllowed = 'move'
    setTimeout(() => { e.target.style.opacity = '0.5' }, 0)
  }

  const handleDragEnd = (e) => {
    e.stopPropagation()
    e.target.style.opacity = '1'
    setDraggedId(null)
    setDragOverId(null)
  }

  const handleDragOver = (e, id) => {
    e.preventDefault()
    e.stopPropagation()
    if (draggedId === id) return
    setDragOverId(id)
  }

  const handleDrop = async (e, targetId) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!draggedId || draggedId === targetId) {
      setDragOverId(null)
      return
    }

    const newItems = [...items]
    const draggedIdx = newItems.findIndex(i => i.id === draggedId)
    const targetIdx = newItems.findIndex(i => i.id === targetId)

    if (draggedIdx === -1 || targetIdx === -1) {
      setDraggedId(null)
      setDragOverId(null)
      return
    }

    const [draggedItem] = newItems.splice(draggedIdx, 1)
    newItems.splice(targetIdx, 0, draggedItem)

    // Update sortOrder based on new positions
    const updatedItems = newItems.map((item, idx) => ({ ...item, sortOrder: idx }))
    
    setDraggedId(null)
    setDragOverId(null)

    if (onReorder) {
      await onReorder(updatedItems)
    }
  }

  return {
    draggedId,
    dragOverId,
    handlers: {
      onDragStart: handleDragStart,
      onDragEnd: handleDragEnd,
      onDragOver: handleDragOver,
      onDrop: handleDrop
    }
  }
}
