"use client"

import { Type, ImageIcon, Square, MousePointer, TextCursorInput, CheckSquare, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type { GridElement } from "../page"

interface GridBuilderProps {
  onAddElement: (type: GridElement["type"]) => void
}

const elementTypes = [
  { type: "container" as const, label: "Container", icon: Square, description: "Layout container" },
  { type: "text" as const, label: "Text", icon: Type, description: "Text content" },
  { type: "image" as const, label: "Image", icon: ImageIcon, description: "Image placeholder" },
  { type: "button" as const, label: "Button", icon: MousePointer, description: "Interactive button" },
  { type: "input" as const, label: "Input", icon: TextCursorInput, description: "Text input field" },
  { type: "checkbox" as const, label: "Checkbox", icon: CheckSquare, description: "Checkbox input" },
  { type: "select" as const, label: "Select", icon: ChevronDown, description: "Dropdown select" },
]

export function GridBuilder({ onAddElement }: GridBuilderProps) {
  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="text-lg">Elements</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {elementTypes.map(({ type, label, icon: Icon, description }) => (
          <Button
            key={type}
            variant="outline"
            className="w-full justify-start h-auto p-4"
            onClick={() => onAddElement(type)}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">{label}</div>
                <div className="text-xs text-gray-500">{description}</div>
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
