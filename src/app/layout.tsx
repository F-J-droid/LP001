import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/features/cart/context/cart-context";
import { CartDrawer } from "@/features/cart/components/cart-drawer";
import { createClient } from "@/lib/supabase/server";
import { AdminSettingsRepository } from "@/features/admin/settings/repositories/admin-settings-repository";
import { TrackingProvider } from "@/features/tracking/components/tracking-provider";
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BRPNEU | E-commerce de Pneus",
  description: "Loja virtual de pneus profissional, moderna e escalável.",
};

export async function generateViewport() {
  const supabase = await createClient();
  const settingsRepo = new AdminSettingsRepository(supabase);
  const pwaSettings = await settingsRepo.getSection('pwa');
  
  return {
    themeColor: pwaSettings?.themeColor || '#0f172a',
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const settingsRepo = new AdminSettingsRepository(supabase);
  const trackingSettings = await settingsRepo.getSection('tracking');

  const gtmEnabled = trackingSettings?.gtm?.enabled;
  const gtmId = trackingSettings?.gtm?.containerId;
  const ga4Enabled = trackingSettings?.ga4?.enabled;
  const ga4Id = trackingSettings?.ga4?.measurementId;

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen flex flex-col bg-background text-foreground antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {trackingSettings && <TrackingProvider settings={trackingSettings} />}
          
          <CartProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <CartDrawer />
          </CartProvider>
        </ThemeProvider>
      </body>
      {/* 
        Estratégia de Injeção GTM/GA4 (Server Rendered via next/third-parties)
        Se GTM for habilitado, evita GA4 direto para não duplicar, assumindo que GTM gerencia GA4.
        Isto respeita as restrições da arquitetura definidas no plano.
      */}
      {gtmEnabled && gtmId && <GoogleTagManager gtmId={gtmId} />}
      {!gtmEnabled && ga4Enabled && ga4Id && <GoogleAnalytics gaId={ga4Id} />}
    </html>
  );
}
