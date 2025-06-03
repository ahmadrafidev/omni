"use client"

import { Trash2 } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import type { GridElement } from "../page"

interface PropertiesPanelProps {
  element: GridElement
  onUpdateElement: (id: string, updates: Partial<GridElement>) => void
  onDeleteElement: (id: string) => void
}

export function PropertiesPanel({ element, onUpdateElement, onDeleteElement }: PropertiesPanelProps) {
  const updateContent = (content: string) => {
    onUpdateElement(element.id, { content })
  }

  const updateStyle = (key: keyof GridElement["styles"], value: string) => {
    onUpdateElement(element.id, {
      styles: { ...element.styles, [key]: value },
    })
  }

  return (
    <Card className="m-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">Properties</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDeleteElement(element.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="content">Content</Label>
          <Input
            id="content"
            value={element.content}
            onChange={(e) => updateContent(e.target.value)}
            placeholder="Enter content..."
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="width">Width</Label>
            <Input
              id="width"
              value={element.styles.width}
              onChange={(e) => updateStyle("width", e.target.value)}
              placeholder="200px"
            />
          </div>
          <div>
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              value={element.styles.height}
              onChange={(e) => updateStyle("height", e.target.value)}
              placeholder="100px"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="backgroundColor">Background Color</Label>
          <Input
            id="backgroundColor"
            type="color"
            value={element.styles.backgroundColor}
            onChange={(e) => updateStyle("backgroundColor", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label htmlFor="padding">Padding</Label>
            <Input
              id="padding"
              value={element.styles.padding}
              onChange={(e) => updateStyle("padding", e.target.value)}
              placeholder="16px"
            />
          </div>
          <div>
            <Label htmlFor="margin">Margin</Label>
            <Input
              id="margin"
              value={element.styles.margin}
              onChange={(e) => updateStyle("margin", e.target.value)}
              placeholder="8px"
            />
          </div>
        </div>

        {element.type === "text" || element.type === "button" ? (
          <>
            <div>
              <Label htmlFor="fontSize">Font Size</Label>
              <Input
                id="fontSize"
                value={element.styles.fontSize}
                onChange={(e) => updateStyle("fontSize", e.target.value)}
                placeholder="16px"
              />
            </div>
            <div>
              <Label htmlFor="fontWeight">Font Weight</Label>
              <Select value={element.styles.fontWeight} onValueChange={(value) => updateStyle("fontWeight", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="lighter">Lighter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="textAlign">Text Align</Label>
              <Select value={element.styles.textAlign} onValueChange={(value) => updateStyle("textAlign", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        ) : null}

        <div>
          <Label htmlFor="borderRadius">Border Radius</Label>
          <Input
            id="borderRadius"
            value={element.styles.borderRadius}
            onChange={(e) => updateStyle("borderRadius", e.target.value)}
            placeholder="0px"
          />
        </div>
      </CardContent>
    </Card>
  )
}
