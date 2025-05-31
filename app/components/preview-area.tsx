"use client"

import { useCallback } from "react"
import { useDrop } from "react-dnd"
import { DraggableElement } from "./draggable-element"
import type { DeviceSize, GridElement } from "../page"

interface PreviewAreaProps {
  device: DeviceSize
  elements: GridElement[]
  selectedElement: GridElement | null
  onSelectElement: (element: GridElement | null) => void
  onUpdateElement: (id: string, updates: Partial<GridElement>) => void
}

export function PreviewArea({ device, elements, selectedElement, onSelectElement, onUpdateElement }: PreviewAreaProps) {
  const [{ isOver }, drop] = useDrop({
    accept: "element",
    drop: (item: { id: string; type: string }, monitor) => {
      const offset = monitor.getClientOffset()
      if (offset) {
        const containerRect = document.getElementById("preview-container")?.getBoundingClientRect()
        if (containerRect) {
          const x = offset.x - containerRect.left
          const y = offset.y - containerRect.top
          onUpdateElement(item.id, {
            position: { x: Math.max(0, x - 100), y: Math.max(0, y - 50) },
          })
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  const handleElementMove = useCallback(
    (id: string, position: { x: number; y: number }) => {
      onUpdateElement(id, { position })
    },
    [onUpdateElement],
  )

  const handleElementResize = useCallback(
    (id: string, size: { width: number; height: number }) => {
      onUpdateElement(id, {
        size,
        styles: {
          ...elements.find((el) => el.id === id)?.styles,
          width: `${size.width}px`,
          height: `${size.height}px`,
        } as any,
      })
    },
    [onUpdateElement, elements],
  )

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-gray-100">
      <div
        className="bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300"
        style={{
          width: device.width,
          height: device.height,
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      >
        <div className="bg-gray-800 text-white px-4 py-2 text-sm flex items-center justify-between">
          <span>{device.name} Preview</span>
          <span className="text-gray-300">
            {device.width} × {device.height}
          </span>
        </div>
        <div
          ref={drop}
          id="preview-container"
          className={`relative w-full h-full overflow-hidden ${isOver ? "bg-blue-50" : "bg-white"}`}
          onClick={() => onSelectElement(null)}
          style={{ height: device.height - 40 }}
        >
          {elements.map((element) => (
            <DraggableElement
              key={element.id}
              element={element}
              isSelected={selectedElement?.id === element.id}
              onSelect={() => onSelectElement(element)}
              onMove={handleElementMove}
              onResize={handleElementResize}
            />
          ))}
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-lg font-medium">Start building your layout</div>
                <div className="text-sm">Add elements from the sidebar to begin</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
