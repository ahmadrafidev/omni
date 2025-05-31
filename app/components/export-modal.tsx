"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Download } from "lucide-react"
import type { GridElement, DeviceSize } from "../page"

interface ExportModalProps {
  elements: GridElement[]
  devices: DeviceSize[]
  onClose: () => void
}

export function ExportModal({ elements, devices, onClose }: ExportModalProps) {
  const [copied, setCopied] = useState(false)

  const generateTailwindCSS = () => {
    let css = "/* Tailwind CSS Classes */\n\n"

    elements.forEach((element, index) => {
      css += `/* Element ${index + 1}: ${element.type} */\n`
      css += `.element-${element.id} {\n`

      // Convert styles to Tailwind classes
      const tailwindClasses = []

      if (element.styles.backgroundColor !== "transparent") {
        tailwindClasses.push(`bg-[${element.styles.backgroundColor}]`)
      }

      if (element.styles.padding) {
        tailwindClasses.push(`p-[${element.styles.padding}]`)
      }

      if (element.styles.margin) {
        tailwindClasses.push(`m-[${element.styles.margin}]`)
      }

      if (element.styles.borderRadius !== "0px") {
        tailwindClasses.push(`rounded-[${element.styles.borderRadius}]`)
      }

      if (element.styles.fontSize) {
        tailwindClasses.push(`text-[${element.styles.fontSize}]`)
      }

      if (element.styles.fontWeight !== "normal") {
        tailwindClasses.push(`font-${element.styles.fontWeight}`)
      }

      if (element.styles.textAlign !== "left") {
        tailwindClasses.push(`text-${element.styles.textAlign}`)
      }

      css += `  @apply ${tailwindClasses.join(" ")};\n`
      css += `  width: ${element.styles.width};\n`
      css += `  height: ${element.styles.height};\n`
      css += `}\n\n`
    })

    return css
  }

  const generateMediaQueries = () => {
    let css = "/* Responsive CSS with Media Queries */\n\n"

    elements.forEach((element, index) => {
      css += `/* Element ${index + 1}: ${element.type} */\n`
      css += `.element-${element.id} {\n`
      css += `  width: ${element.styles.width};\n`
      css += `  height: ${element.styles.height};\n`
      css += `  background-color: ${element.styles.backgroundColor};\n`
      css += `  padding: ${element.styles.padding};\n`
      css += `  margin: ${element.styles.margin};\n`
      css += `  border-radius: ${element.styles.borderRadius};\n`
      css += `  font-size: ${element.styles.fontSize};\n`
      css += `  font-weight: ${element.styles.fontWeight};\n`
      css += `  text-align: ${element.styles.textAlign};\n`
      css += `  position: absolute;\n`
      css += `  left: ${element.position.x}px;\n`
      css += `  top: ${element.position.y}px;\n`
      css += `}\n\n`
    })

    // Add responsive breakpoints
    css += "/* Responsive Breakpoints */\n"
    css += "@media (max-width: 768px) {\n"
    css += "  /* Mobile styles */\n"
    css += "  .container { padding: 1rem; }\n"
    css += "}\n\n"

    css += "@media (min-width: 769px) and (max-width: 1024px) {\n"
    css += "  /* Tablet styles */\n"
    css += "  .container { padding: 2rem; }\n"
    css += "}\n\n"

    css += "@media (min-width: 1025px) {\n"
    css += "  /* Desktop styles */\n"
    css += "  .container { padding: 3rem; }\n"
    css += "}\n"

    return css
  }

  const generateHTML = () => {
    let html = "<!-- Generated HTML Structure -->\n\n"
    html += '<div class="container">\n'

    elements.forEach((element) => {
      const tag = element.type === "button" ? "button" : element.type === "image" ? "img" : "div"
      html += `  <${tag} class="element-${element.id}">`

      if (element.type === "image") {
        html += `alt="${element.content}"`
      } else {
        html += element.content
      }

      html += `</${tag}>\n`
    })

    html += "</div>"
    return html
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Export Layout CSS</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="tailwind" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tailwind">Tailwind CSS</TabsTrigger>
            <TabsTrigger value="media-queries">Media Queries</TabsTrigger>
            <TabsTrigger value="html">HTML Structure</TabsTrigger>
          </TabsList>

          <TabsContent value="tailwind" className="mt-4 h-96 overflow-hidden">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(generateTailwindCSS())}>
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(generateTailwindCSS(), "layout-tailwind.css")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto h-80">{generateTailwindCSS()}</pre>
            </div>
          </TabsContent>

          <TabsContent value="media-queries" className="mt-4 h-96 overflow-hidden">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(generateMediaQueries())}>
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(generateMediaQueries(), "layout-responsive.css")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto h-80">{generateMediaQueries()}</pre>
            </div>
          </TabsContent>

          <TabsContent value="html" className="mt-4 h-96 overflow-hidden">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(generateHTML())}>
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadFile(generateHTML(), "layout-structure.html")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto h-80">{generateHTML()}</pre>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
