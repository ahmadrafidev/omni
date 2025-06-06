'use client';

import { useDeviceWarning } from '@/hooks/use-device-warning';
import { DeviceWarningModal } from './device-warning-modal';

export function DeviceWarning() {
  const { isMobileOrTablet, dismissWarning } = useDeviceWarning();

  if (!isMobileOrTablet) {
    return null;
  }

  return <DeviceWarningModal isOpen={true} onClose={dismissWarning} />;
} 