"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import type { GridElement, DeviceSize } from "../page"

interface AccessibilityCheckerProps {
  elements: GridElement[]
  device: DeviceSize
}

interface AccessibilityIssue {
  id: string
  type: "error" | "warning" | "success"
  message: string
  element?: GridElement
}

export function AccessibilityChecker({ elements, device }: AccessibilityCheckerProps) {
  const checkAccessibility = (): AccessibilityIssue[] => {
    const issues: AccessibilityIssue[] = []

    elements.forEach((element) => {
      // Check touch target size (minimum 44px for mobile)
      if (device.name === "Mobile" && element.type === "button") {
        const minSize = 44
        if (element.size.width < minSize || element.size.height < minSize) {
          issues.push({
            id: `touch-target-${element.id}`,
            type: "error",
            message: `Touch target too small (${element.size.width}×${element.size.height}px). Minimum 44×44px required.`,
            element,
          })
        } else {
          issues.push({
            id: `touch-target-ok-${element.id}`,
            type: "success",
            message: `Touch target size meets requirements (${element.size.width}×${element.size.height}px).`,
            element,
          })
        }
      }

      // Check font size
      const fontSize = Number.parseInt(element.styles.fontSize)
      if ((element.type === "text" || element.type === "button") && fontSize < 16) {
        issues.push({
          id: `font-size-${element.id}`,
          type: "warning",
          message: `Font size may be too small (${fontSize}px). Consider 16px minimum for readability.`,
          element,
        })
      }

      // Check color contrast (simplified check)
      if (element.type === "button" && element.styles.backgroundColor === "#ffffff") {
        issues.push({
          id: `contrast-${element.id}`,
          type: "warning",
          message: "White background button may have poor contrast. Consider darker colors.",
          element,
        })
      }

      // Check content accessibility
      if (element.type === "image" && element.content === "Image") {
        issues.push({
          id: `alt-text-${element.id}`,
          type: "error",
          message: "Image missing descriptive alt text.",
          element,
        })
      }
    })

    // Overall layout checks
    if (elements.length === 0) {
      issues.push({
        id: "no-content",
        type: "warning",
        message: "No content to check for accessibility.",
      })
    }

    return issues
  }

  const issues = checkAccessibility()
  const errorCount = issues.filter((i) => i.type === "error").length
  const warningCount = issues.filter((i) => i.type === "warning").length
  const successCount = issues.filter((i) => i.type === "success").length

  const getIcon = (type: AccessibilityIssue["type"]) => {
    switch (type) {
      case "error":
        return <XCircle className="w-4 h-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
    }
  }

  const getBadgeVariant = (type: AccessibilityIssue["type"]) => {
    switch (type) {
      case "error":
        return "destructive"
      case "warning":
        return "secondary"
      case "success":
        return "default"
    }
  }

  return (
    <Card className="m-4 h-fit">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Accessibility Check
          <div className="flex gap-1">
            {errorCount > 0 && (
              <Badge variant="destructive" className="text-xs">
                {errorCount} errors
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {warningCount} warnings
              </Badge>
            )}
            {successCount > 0 && (
              <Badge variant="default" className="text-xs">
                {successCount} passed
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-gray-600">WCAG 2.1 Guidelines Check for {device.name}</div>

        {issues.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No accessibility issues found</div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className={`p-3 rounded-lg border ${
                  issue.type === "error"
                    ? "bg-red-50 border-red-200"
                    : issue.type === "warning"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-green-50 border-green-200"
                }`}
              >
                <div className="flex items-start gap-2">
                  {getIcon(issue.type)}
                  <div className="flex-1">
                    <div className="text-sm font-medium">
                      {issue.element ? `${issue.element.type} element` : "Layout"}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">{issue.message}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
