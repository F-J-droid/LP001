import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';
import { AdminSettingsRepository } from '@/features/admin/settings/repositories/admin-settings-repository';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const supabase = await createClient();
  const repo = new AdminSettingsRepository(supabase);
  
  const pwaSettings = await repo.getSection('pwa');

  const appName = pwaSettings?.appName || 'BRPNEU App';
  const shortName = pwaSettings?.shortName || 'BRPNEU';
  const description = pwaSettings?.description || 'Loja de Pneus BRPNEU';
  const themeColor = pwaSettings?.themeColor || '#0f172a';
  const backgroundColor = pwaSettings?.backgroundColor || '#ffffff';
  
  const icons: MetadataRoute.Manifest['icons'] = [];
  if (pwaSettings?.iconUrl) {
    icons.push({
      src: pwaSettings.iconUrl,
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable'
    });
  } else {
    // Default fallback icon if none is provided
    icons.push({
      src: '/favicon.ico',
      sizes: 'any',
      type: 'image/x-icon'
    });
  }

  return {
    name: appName,
    short_name: shortName,
    description: description,
    start_url: '/',
    display: 'standalone',
    background_color: backgroundColor,
    theme_color: themeColor,
    icons: icons,
  };
}
