'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Package, Tags, Maximize, Target, 
  Archive, Star, Image as ImageIcon, ShoppingCart, Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/features/admin/actions/auth-actions';

const MENU_GROUPS = [
  {
    title: 'Operação',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Pedidos', href: '/admin/pedidos', icon: ShoppingCart },
    ]
  },
  {
    title: 'Catálogo',
    items: [
      { label: 'Produtos', href: '/admin/produtos', icon: Package },
      { label: 'Estoque', href: '/admin/estoque', icon: Archive },
      { label: 'Marcas', href: '/admin/marcas', icon: Tags },
      { label: 'Categorias', href: '/admin/categorias', icon: Target },
      { label: 'Medidas', href: '/admin/medidas', icon: Maximize },
    ]
  },
  {
    title: 'Marketing',
    items: [
      { label: 'Promoções', href: '/admin/promocoes', icon: Star },
      { label: 'Banners', href: '/admin/banners', icon: ImageIcon },
    ]
  },
  {
    title: 'Sistema',
    items: [
      { label: 'Configurações', href: '/admin/configuracoes', icon: Settings },
    ]
  }
];

export function AdminNav({ isMobile }: { isMobile?: boolean }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-2 text-foreground font-black text-2xl tracking-tight">
          <span className="text-primary">Tire</span>Store
          <span className="text-xs uppercase bg-primary text-primary-foreground px-2 py-0.5 rounded-sm tracking-wider font-bold ml-1">Admin</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-8 pb-12">
        {MENU_GROUPS.map((group, i) => (
          <div key={i}>
            <h3 className="px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-primary/10 text-primary font-bold" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground/70")} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <form action={logout}>
          <button type="submit" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-red-500 hover:bg-red-500/10 w-full text-left">
            Sair
          </button>
        </form>
      </div>
    </div>
  );
}
