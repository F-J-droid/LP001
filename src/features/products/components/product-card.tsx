import * as React from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { type TireProduct } from "../types"
import { formatCurrency, formatTireSize } from "../utils/formatters"
import { FavoriteButton } from "./favorite-button"

export function ProductCard({ product }: { product: TireProduct }) {
  const isAvailable = product.stockStatus === 'available';
  // Maximum of 2 main commercial badges
  const mainBadges = product.badges?.slice(0, 2) || [];

  return (
    <Link href={`/produto/${product.slug}`} className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/50 group bg-card border rounded-2xl border-muted/60">
      <div className="p-0 relative">
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {mainBadges.map(badge => (
            <Badge key={badge} variant={badge === 'Oferta' ? 'accent' : 'secondary'} className={badge === 'Oferta' ? "bg-accent text-white shadow-sm" : "shadow-sm"}>
              {badge}
            </Badge>
          ))}
          {!isAvailable && (
            <Badge variant="destructive" className="shadow-sm">Esgotado</Badge>
          )}
        </div>
        
        <FavoriteButton productId={product.id} />
        
        <div className="aspect-square relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white to-gray-100 flex items-center justify-center p-6 border-b border-muted/30">
          {product.imageUrl ? (
            <div className="relative w-full h-[85%] group-hover:scale-105 transition-transform duration-500 ease-out">
              <Image 
                src={product.imageUrl} 
                alt={`${product.brand} ${product.model}`} 
                fill 
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain drop-shadow-md" 
                priority={false}
              />
            </div>
          ) : (
            <div className="w-full h-full bg-muted-foreground/5 rounded-full flex items-center justify-center">
              <div className="text-muted-foreground/30 font-medium">Sem Imagem</div>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 pt-5 flex-grow flex flex-col justify-start">
        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
          {product.brand}
        </div>
        <div className="text-lg font-bold leading-tight mb-2 line-clamp-2 min-h-[44px]">
          {product.model}
        </div>
        <div className="flex items-center gap-2 mb-4">
          <div className="text-sm font-semibold text-primary/80 bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
            {formatTireSize(product.width, product.profile, product.rim)}
          </div>
          {product.rating && (
            <div className="flex items-center text-xs text-accent font-bold">
              ★ {product.rating} <span className="text-muted-foreground/80 ml-1 font-medium">({product.reviewCount})</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-2 border-t border-muted/50 flex flex-col gap-0.5">
          {product.promotionalPrice ? (
            <>
              <div className="text-xs text-muted-foreground line-through font-medium">
                De {formatCurrency(product.price)}
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-foreground tracking-tight">
                  {formatCurrency(product.pixPrice ?? product.promotionalPrice)}
                </span>
                {(product.pixPrice) && (
                  <span className="text-xs font-bold text-success uppercase tracking-wider mt-0.5">
                    no PIX
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col pt-4">
              <span className="text-2xl font-black text-foreground tracking-tight">
                {formatCurrency(product.pixPrice ?? product.price)}
              </span>
              {(product.pixPrice) && (
                <span className="text-xs font-bold text-success uppercase tracking-wider mt-0.5">
                  no PIX
                </span>
              )}
            </div>
          )}
          
          {product.installmentCount && product.installmentValue && (
            <div className="text-xs text-muted-foreground font-medium mt-1">
              ou {product.installmentCount}x de <span className="text-foreground">{formatCurrency(product.installmentValue)}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 pt-3 flex gap-2">
        <div className={`w-full font-bold transition-colors mt-auto py-3 rounded-lg flex items-center justify-center gap-2 ${
          isAvailable ? "bg-primary/10 text-primary hover:bg-primary hover:text-white" : "bg-muted text-muted-foreground"
        }`}>
          {isAvailable ? (
            <>COMPRAR AGORA <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
          ) : (
            "ESGOTADO"
          )}
        </div>
      </div>
    </Link>
  )
}
