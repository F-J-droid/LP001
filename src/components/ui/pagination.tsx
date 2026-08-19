'use client';

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { Button } from './button';

export function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex items-center gap-2">
      <Link href={createPageUrl(Math.max(1, currentPage - 1))} className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}>
        <Button variant="outline" size="sm" disabled={currentPage === 1} className="font-semibold">
          Anterior
        </Button>
      </Link>
      
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <Link key={page} href={createPageUrl(page)}>
            <Button 
              variant={currentPage === page ? 'default' : 'outline'} 
              size="sm" 
              className={`w-9 h-9 p-0 font-bold ${currentPage === page ? '' : 'text-muted-foreground'}`}
            >
              {page}
            </Button>
          </Link>
        ))}
      </div>

      <Link href={createPageUrl(Math.min(totalPages, currentPage + 1))} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}>
        <Button variant="outline" size="sm" disabled={currentPage === totalPages} className="font-semibold">
          Próxima
        </Button>
      </Link>
    </div>
  );
}
