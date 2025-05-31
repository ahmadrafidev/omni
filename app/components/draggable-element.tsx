"use client"

import type React from "react"
import { useRef, useCallback } from "react"
import { useDrag } from "react-dnd"
import type { GridElement } from "../page"

interface DraggableElementProps {
  element: GridElement
  isSelected: boolean
  onSelect: () => void
  onResize: (id: string, size: { width: number; height: number }) => void
}

export function DraggableElement({ element, isSelected, onSelect, onResize }: DraggableElementProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: "element",
    item: { id: element.id, type: element.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(ref)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onSelect()
    },
    [onSelect],
  )

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()

      const startX = e.clientX
      const startY = e.clientY
      const startWidth = element.size.width
      const startHeight = element.size.height

      const handleMouseMove = (e: MouseEvent) => {
        const newWidth = Math.max(50, startWidth + (e.clientX - startX))
        const newHeight = Math.max(30, startHeight + (e.clientY - startY))
        onResize(element.id, { width: newWidth, height: newHeight })
      }

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    },
    [element.id, element.size, onResize],
  )

  const renderContent = () => {
    switch (element.type) {
      case "text":
        return (
          <div
            style={{
              fontSize: element.styles.fontSize,
              fontWeight: element.styles.fontWeight,
              textAlign: element.styles.textAlign as "left" | "center" | "right",
              color: "black",
            }}
          >
            {element.content}
          </div>
        )
      case "image":
        return (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            📷 {element.content}
          </div>
        )
      case "button":
        return (
          <button
            className="w-full h-full text-white font-medium"
            style={{
              backgroundColor: element.styles.backgroundColor,
              borderRadius: element.styles.borderRadius,
              fontSize: element.styles.fontSize,
            }}
          >
            {element.content}
          </button>
        )
      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">{element.content}</div>
        )
    }
  }

  return (
    <div
      ref={ref}
      className={`absolute cursor-move ${isDragging ? "opacity-50" : ""} ${isSelected ? "ring-2 ring-blue-500" : ""}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        backgroundColor: element.type === "container" ? element.styles.backgroundColor : "transparent",
        padding: element.styles.padding,
        margin: element.styles.margin,
        borderRadius: element.styles.borderRadius,
      }}
      onMouseDown={handleMouseDown}
    >
      {renderContent()}

      {isSelected && (
        <div
          className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize"
          onMouseDown={handleResizeStart}
        />
      )}
    </div>
  )
}
