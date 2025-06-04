"use client"

import { useCallback, useRef } from "react"
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
  const containerRef = useRef<HTMLDivElement>(null)

  const [{ isOver }, drop] = useDrop({
    accept: "element",
    drop: (item: { id: string; type: string }, monitor) => {
      const offset = monitor.getClientOffset()
      if (offset && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect()
        const x = Math.max(0, offset.x - containerRect.left - 100)
        const y = Math.max(0, offset.y - containerRect.top - 50)
        

        const maxX = containerRect.width - 200 
        const maxY = containerRect.height - 100 
        
        onUpdateElement(item.id, {
          position: { 
            x: Math.min(x, maxX), 
            y: Math.min(y, maxY) 
          },
        })
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  })

  const handleElementResize = useCallback(
    (id: string, size: { width: number; height: number }) => {
      const element = elements.find((el) => el.id === id)
      if (!element) return


      const containerRect = containerRef.current?.getBoundingClientRect()
      if (containerRect) {
        const maxWidth = containerRect.width - element.position.x
        const maxHeight = containerRect.height - element.position.y
        
        const newWidth = Math.min(Math.max(50, size.width), maxWidth)
        const newHeight = Math.min(Math.max(30, size.height), maxHeight)

        onUpdateElement(id, {
          size: { width: newWidth, height: newHeight },
          styles: {
            ...element.styles,
            width: `${newWidth}px`,
            height: `${newHeight}px`,
          } as GridElement["styles"],
        })
      }
    },
    [onUpdateElement, elements],
  )

  const handleContainerClick = useCallback((e: React.MouseEvent) => {

    if (e.target === containerRef.current) {
      onSelectElement(null)
    }
  }, [onSelectElement])

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div
        className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden transition-all duration-300 border border-gray-200 dark:border-gray-700"
        style={{
          width: device.width,
          height: device.height,
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      >
        <div className="bg-gray-800 dark:bg-gray-900 text-white px-4 py-2.5 text-sm flex items-center justify-between border-b border-gray-700">
          <span className="font-medium">{device.name} Preview</span>
          <span className="text-gray-300 dark:text-gray-200 text-xs font-mono">
            {device.width} × {device.height}
          </span>
        </div>
        <div
          ref={(node) => {
            drop(node)
            containerRef.current = node
          }}
          id="preview-container"
          className={`relative w-full overflow-hidden transition-colors duration-200 ${
            isOver 
              ? "bg-blue-50 dark:bg-blue-900/20" 
              : "bg-white dark:bg-gray-800"
          }`}
          onClick={handleContainerClick}
          style={{ 
            height: device.height - 40,
            minHeight: device.height - 40,
            maxHeight: device.height - 40
          }}
        >
          {elements.map((element) => (
            <DraggableElement
              key={element.id}
              element={element}
              isSelected={selectedElement?.id === element.id}
              onSelect={() => onSelectElement(element)}
              onResize={handleElementResize}
            />
          ))}
          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
              <div className="text-center space-y-2">
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
