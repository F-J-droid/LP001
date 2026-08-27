import * as React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { AdminSettingsRepository } from "@/features/admin/settings/repositories/admin-settings-repository";
import { BrandingSettings } from "@/features/admin/settings/schemas/settings.schema";

export async function BrandLogo() {
  const supabase = await createClient();
  const repo = new AdminSettingsRepository(supabase);
  const settings = await repo.getSection('branding') as BrandingSettings | null;

  const brandName = settings?.brandName || "BRPNEU";
  const defaultUrl = settings?.logoDefaultUrl || "/branding/brpneu-logo-light.svg";
  const lightUrl = settings?.logoLightUrl || "/branding/brpneu-logo-light.svg";
  const darkUrl = settings?.logoDarkUrl || "/branding/brpneu-logo-dark.svg";
  const mobileUrl = settings?.logoMobileUrl || "/branding/brpneu-logo-mobile.svg";
  const showName = settings?.showBrandName ?? false;
  const altText = settings?.logoAlt || brandName;
  const widthDesktop = settings?.logoWidthDesktop || 150;
  const widthMobile = settings?.logoWidthMobile || 120;

  // Fallback se não houver nenhuma logo configurada
  if (!defaultUrl && !lightUrl && !darkUrl) {
    return (
      <Link href="/" className="flex items-center space-x-2" aria-label={`Ir para página inicial da ${brandName}`}>
        <span className="font-bold text-xl tracking-tight text-secondary">
          {brandName.includes('Store') ? (
            <>
              {brandName.replace('Store', '')}<span className="text-primary">Store</span>
            </>
          ) : (
            brandName
          )}
        </span>
      </Link>
    );
  }

  // Se tivermos mobileUrl configurada, usaremos a tag picture com media queries se possivel
  // Ou classes do Tailwind
  return (
    <Link href="/" className="flex items-center space-x-2 group" aria-label={`Ir para página inicial da ${brandName}`}>
      <div className="relative flex items-center shrink-0">
        {/* Render logic for Light Theme */}
        {lightUrl && (
          <img 
            src={lightUrl} 
            alt={altText} 
            style={{ width: `${widthDesktop}px` }}
            className={`dark:hidden hidden md:block transition-transform group-hover:scale-105 h-auto object-contain max-w-full`} 
          />
        )}
        
        {/* Render logic for Dark Theme */}
        {darkUrl && (
          <img 
            src={darkUrl} 
            alt={altText} 
            style={{ width: `${widthDesktop}px` }}
            className={`hidden md:dark:block transition-transform group-hover:scale-105 h-auto object-contain max-w-full`} 
          />
        )}

        {/* Render logic for Mobile (If mobile specific image exists) */}
        {mobileUrl ? (
          <img 
            src={mobileUrl} 
            alt={altText} 
            style={{ width: `${widthMobile}px` }}
            className={`md:hidden block transition-transform group-hover:scale-105 h-auto object-contain max-w-full`} 
          />
        ) : (
          <>
            {/* Fallback to Desktop logic on Mobile if no Mobile URL */}
            {lightUrl && (
              <img 
                src={lightUrl} 
                alt={altText} 
                style={{ width: `${widthMobile}px` }}
                className={`md:hidden dark:hidden block transition-transform group-hover:scale-105 h-auto object-contain max-w-full`} 
              />
            )}
            {darkUrl && (
              <img 
                src={darkUrl} 
                alt={altText} 
                style={{ width: `${widthMobile}px` }}
                className={`md:hidden hidden dark:block transition-transform group-hover:scale-105 h-auto object-contain max-w-full`} 
              />
            )}
          </>
        )}
      </div>
      
      {showName && (
        <span className="font-bold text-xl tracking-tight text-secondary ml-2">
          {brandName}
        </span>
      )}
    </Link>
  );
}
