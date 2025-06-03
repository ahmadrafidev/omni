"use client"

import { useState, useCallback } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { DeviceSelector } from "./components/device-selector"
import { GridBuilder } from "./components/grid-builder"
import { PreviewArea } from "./components/preview-area"
import { PropertiesPanel } from "./components/properties-panel"
import { AccessibilityChecker } from "./components/accessibility-checker"
import { ExportModal } from "./components/export-modal"
import { ThemeToggle } from "./components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"

export interface GridElement {
  id: string
  type: "container" | "text" | "image" | "button" | "input"
  content: string
  styles: {
    width: string
    height: string
    backgroundColor: string
    padding: string
    margin: string
    fontSize: string
    fontWeight: string
    textAlign: string
    borderRadius: string
  }
  position: { x: number; y: number }
  size: { width: number; height: number }
}

export interface DeviceSize {
  name: string
  width: number
  height: number
  breakpoint: string
}

const deviceSizes: DeviceSize[] = [
  { name: "Mobile", width: 375, height: 667, breakpoint: "sm" },
  { name: "Tablet", width: 768, height: 1024, breakpoint: "md" },
  { name: "Desktop", width: 1440, height: 900, breakpoint: "lg" },
]

export default function Omni() {
  const [currentDevice, setCurrentDevice] = useState<DeviceSize>(deviceSizes[0])
  const [elements, setElements] = useState<GridElement[]>([])
  const [selectedElement, setSelectedElement] = useState<GridElement | null>(null)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showAccessibilityPanel, setShowAccessibilityPanel] = useState(false)

  const addElement = useCallback((type: GridElement["type"]) => {
    const newElement: GridElement = {
      id: `element-${Date.now()}`,
      type,
      content:
        type === "text" ? "Sample Text" : 
        type === "button" ? "Button" : 
        type === "image" ? "Image" : 
        type === "input" ? "Enter text..." : 
        "Container",
      styles: {
        width: "200px",
        height: type === "text" ? "auto" : "100px",
        backgroundColor: type === "container" ? "#f3f4f6" : 
                        type === "button" ? "#3b82f6" : 
                        type === "input" ? "white" : 
                        "transparent",
        padding: "16px",
        margin: "8px",
        fontSize: "16px",
        fontWeight: "normal",
        textAlign: "left",
        borderRadius: type === "button" || type === "input" ? "8px" : "0px",
      },
      position: { x: 50, y: 50 },
      size: { width: 200, height: type === "text" ? 50 : 100 },
    }
    setElements((prev) => [...prev, newElement])
  }, [])

  const updateElement = useCallback(
    (id: string, updates: Partial<GridElement>) => {
      setElements((prev) => prev.map((el) => (el.id === id ? { ...el, ...updates } : el)))
      if (selectedElement?.id === id) {
        setSelectedElement((prev) => (prev ? { ...prev, ...updates } : null))
      }
    },
    [selectedElement],
  )

  const deleteElement = useCallback(
    (id: string) => {
      setElements((prev) => prev.filter((el) => el.id !== id))
      if (selectedElement?.id === id) {
        setSelectedElement(null)
      }
    },
    [selectedElement],
  )

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Omni</h1>
            <div className="flex items-center gap-4">
              <DeviceSelector devices={deviceSizes} currentDevice={currentDevice} onDeviceChange={setCurrentDevice} />
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="outline" size="sm" onClick={() => setShowAccessibilityPanel(!showAccessibilityPanel)}>
                  <Eye className="w-4 h-4 mr-2" />
                  A11y Check
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowExportModal(true)}>
                  <Download className="w-4 h-4 mr-2" />
                  Export CSS
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <aside className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
            <div className="flex-none">
              <GridBuilder onAddElement={addElement} />
            </div>
            <div className="flex-1 overflow-y-auto">
              {selectedElement && (
                <PropertiesPanel
                  element={selectedElement}
                  onUpdateElement={updateElement}
                  onDeleteElement={deleteElement}
                />
              )}
            </div>
          </aside>

          {/* Preview Area */}
          <main className="flex-1 flex flex-col">
            <PreviewArea
              device={currentDevice}
              elements={elements}
              selectedElement={selectedElement}
              onSelectElement={setSelectedElement}
              onUpdateElement={updateElement}
            />
          </main>

          {/* Accessibility Panel */}
          {showAccessibilityPanel && (
            <aside className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
              <AccessibilityChecker elements={elements} device={currentDevice} />
            </aside>
          )}
        </div>

        {/* Export Modal */}
        {showExportModal && (
          <ExportModal elements={elements} onClose={() => setShowExportModal(false)} />
        )}
      </div>
    </DndProvider>
  )
}
