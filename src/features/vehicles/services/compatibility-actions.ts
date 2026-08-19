'use server';

import { vehicleCompatibilityService } from './vehicle-compatibility-service';

export async function checkProductCompatibilityAction(productId: string, versionId: string) {
  if (!productId || !versionId) return 'unknown';
  return await vehicleCompatibilityService.checkCompatibility(productId, versionId);
}
