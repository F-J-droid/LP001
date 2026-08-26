import { ReactNode } from 'react';
import { AdminSidebar } from '@/features/admin/components/admin-sidebar';
import { AdminHeader } from '@/features/admin/components/admin-header';

export const metadata = {
  title: 'Admin Console | BRPNEU',
  description: 'Painel administrativo BRPNEU',
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  // Ocultar admin em produção sem auth, conforme requisito 78.
  if (process.env.NODE_ENV === 'production' && !process.env.ADMIN_AUTH_ENABLED) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/20">
        <div className="text-center p-8 bg-card border rounded-xl shadow-sm max-w-md">
          <h1 className="text-xl font-bold mb-4">Acesso Restrito</h1>
          <p className="text-muted-foreground">O painel administrativo está indisponível neste ambiente.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-background overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader />
        <main className="flex-1 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
