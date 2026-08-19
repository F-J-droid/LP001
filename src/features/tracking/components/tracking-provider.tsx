'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackingService } from '../services/tracking-service';
import { AttributionService } from '../attribution/attribution-service';
import { TrackingSettings } from '@/features/admin/settings/schemas/settings.schema';

interface TrackingProviderProps {
  settings: TrackingSettings;
}

export function TrackingProvider({ settings }: TrackingProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialized = useRef(false);

  // Initialize Tracking Service once
  useEffect(() => {
    if (!initialized.current) {
      trackingService.initialize(settings);
      initialized.current = true;
    }
  }, [settings]);

  // Capture Attribution from URL on load
  useEffect(() => {
    const url = window.location.href;
    AttributionService.captureFromUrl(url);
  }, [pathname, searchParams]);

  // Track Page Views on route changes
  useEffect(() => {
    if (initialized.current) {
      // Small timeout to allow the new page to render completely (e.g. document.title changes)
      const timeout = setTimeout(() => {
        trackingService.trackPageView();
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [pathname, searchParams]);

  return null;
}
