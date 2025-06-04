"use client"

import type React from "react"
import { useRef, useCallback, useState } from "react"
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
  const [isDragging, setIsDragging] = useState(false)

  const [{ isDragging: isDndDragging }, drag] = useDrag({
    type: "element",
    item: () => {
      setIsDragging(true)
      return { id: element.id, type: element.type }
    },
    end: () => {
      setIsDragging(false)
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(ref)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()

      if (!isDragging) {
        onSelect()
      }
    },
    [onSelect, isDragging],
  )

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()

      const startX = e.clientX
      const startY = e.clientY
      const startWidth = element.size.width
      const startHeight = element.size.height

      const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault()
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
      case "input":
        return (
          <input
            type="text"
            className="w-full h-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              fontSize: element.styles.fontSize,
              backgroundColor: element.styles.backgroundColor || "white",
              borderRadius: element.styles.borderRadius,
            }}
            placeholder={element.content}
            defaultValue={element.content}
          />
        )
      case "checkbox":
        return (
          <div className="w-full h-full flex items-center gap-2">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label className="text-sm text-gray-700">{element.content}</label>
          </div>
        )
      case "select":
        return (
          <select
            className="w-full h-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            style={{
              fontSize: element.styles.fontSize,
              borderRadius: element.styles.borderRadius,
            }}
          >
            <option value="">{element.content}</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
            <option value="option3">Option 3</option>
          </select>
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
      className={`absolute cursor-move select-none ${
        isDndDragging ? "opacity-50" : ""
      } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: element.size.width,
        height: element.size.height,
        backgroundColor: element.type === "container" ? element.styles.backgroundColor : "transparent",
        padding: element.styles.padding,
        margin: element.styles.margin,
        borderRadius: element.styles.borderRadius,
        transform: isDndDragging ? "translate(0, 0)" : "none",
        touchAction: "none",
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
