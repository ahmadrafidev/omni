'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Laptop, Smartphone } from 'lucide-react';

interface DeviceWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeviceWarningModal({ isOpen, onClose }: DeviceWarningModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Smartphone className="h-6 w-6" />
            Mobile Device Detected
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-muted-foreground">
            We recommend using a desktop computer for the best experience with Omni.
            Some features may be not work as expected on mobile devices.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Laptop className="h-4 w-4" />
            <span>For optimal experience, please use a desktop screen.</span>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose} variant="default">
            I understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 

DeviceWarningModal.displayName = 'DeviceWarningModal';
