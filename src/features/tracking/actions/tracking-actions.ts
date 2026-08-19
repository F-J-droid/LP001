'use server';

import { requireAdmin } from '@/features/admin/utils/require-admin';

export async function checkMetaCapiConfiguredAction() {
  try {
    await requireAdmin(); // ensures only admin can check this
    const configured = !!process.env.META_CAPI_ACCESS_TOKEN;
    return { configured };
  } catch {
    return { configured: false };
  }
}
