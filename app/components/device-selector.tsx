"use client"

import { Monitor, Smartphone, Tablet } from "lucide-react"

import { Button } from "@/components/ui/button"

import type { DeviceSize } from "../page"

interface DeviceSelectorProps {
  devices: DeviceSize[]
  currentDevice: DeviceSize
  onDeviceChange: (device: DeviceSize) => void
}

const deviceIcons = {
  Mobile: Smartphone,
  Tablet: Tablet,
  Desktop: Monitor,
}

export function DeviceSelector({ devices, currentDevice, onDeviceChange }: DeviceSelectorProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      {devices.map((device) => {
        const Icon = deviceIcons[device.name as keyof typeof deviceIcons]
        const isActive = currentDevice.name === device.name
        return (
          <Button
            key={device.name}
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => onDeviceChange(device)}
            className={`flex items-center gap-2 transition-colors ${
              isActive
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-current"}`} />
            <span className="hidden sm:inline font-medium">{device.name}</span>
            <span className={`text-xs ${isActive ? "text-primary-foreground/80" : "text-gray-500 dark:text-gray-400"}`}>
              {device.width}×{device.height}
            </span>
          </Button>
        )
      })}
    </div>
  )
}
