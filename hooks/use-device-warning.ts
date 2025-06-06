'use client';

import { useEffect, useState } from 'react';

interface UseDeviceWarningReturn {
  isMobileOrTablet: boolean;
  dismissWarning: () => void;
}

export function useDeviceWarning(): UseDeviceWarningReturn {
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobileOrTablet(width < 1024);  
    };

    checkDevice();

    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  const dismissWarning = () => {
    setIsMobileOrTablet(false);
  };

  return {
    isMobileOrTablet,
    dismissWarning,
  };
} 