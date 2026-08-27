'use client';

import { useState, useEffect } from 'react';
import { TireProduct } from '../types';
import { formatCurrency, formatTireSize } from '../utils/formatters';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Truck, Clock, AlertCircle } from 'lucide-react';
import { ShippingCalculator } from './shipping-calculator';
import { useCart } from '../../cart/context/cart-context';
import { trackingService } from '@/features/tracking/services/tracking-service';

export function ProductPurchasePanel({ product }: { product: TireProduct }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  
  const isAvailable = product.stockStatus === 'available' && (product.stockQuantity ?? 1) > 0;
  
  // Track View Item
  useEffect(() => {
    trackingService.trackViewItem({
      itemId: product.id,
      sku: product.sku,
      itemName: `${product.brand} ${product.model}`,
      brand: product.brand,
      category: 'Pneus',
      price: Math.round((product.pixPrice ?? product.price) * 100), // cents
      quantity: 1
    });
  }, [product]);

  const handleAddToCart = () => {
    // Track Add To Cart
    trackingService.trackAddToCart(
      {
        itemId: product.id,
        sku: product.sku,
        itemName: `${product.brand} ${product.model}`,
        brand: product.brand,
        category: 'Pneus',
        price: Math.round((product.pixPrice ?? product.price) * 100),
        quantity
      }, 
      quantity,
      Math.round((product.pixPrice ?? product.price) * 100) * quantity
    );

    addItem({
      productId: product.id,
      slug: product.slug,
      brand: product.brand,
      model: product.model,
      imageUrl: product.imageUrl,
      width: product.width,
      profile: product.profile,
      rim: product.rim,
      unitPrice: product.price,
      pixPrice: product.pixPrice,
      quantity: quantity,
      stockQuantity: product.stockQuantity
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">{product.brand}</span>
        <div className="flex gap-2">
          {product.badges?.map(badge => (
            <Badge key={badge} variant={badge === 'Oferta' ? 'accent' : 'secondary'} className={badge === 'Oferta' ? "bg-accent text-white" : ""}>
              {badge}
            </Badge>
          ))}
        </div>
      </div>

      {/* Title & Size */}
      <h1 className="text-3xl md:text-4xl font-black text-foreground leading-tight tracking-tight mb-2">
        {product.model}
      </h1>
      
      <div className="flex items-center gap-4 mb-6">
        <div className="text-lg font-semibold text-primary bg-primary/10 px-3 py-1 rounded-lg border border-primary/20">
          {formatTireSize(product.width, product.profile, product.rim)} {product.loadIndex}{product.speedIndex}
        </div>
        <div className="text-sm text-muted-foreground font-medium">SKU: {product.sku}</div>
      </div>

      {/* Reviews Mock */}
      <div className="flex items-center gap-2 mb-8 pb-8 border-b border-muted">
        <div className="flex text-accent">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < Math.floor(product.rating ?? 5) ? 'opacity-100' : 'opacity-30'}>★</span>
          ))}
        </div>
        <span className="font-bold text-foreground">{product.rating?.toFixed(1)}</span>
        <span className="text-muted-foreground text-sm">({product.reviewCount} avaliações)</span>
      </div>

      {/* Pricing */}
      <div className="mb-8">
        {product.promotionalPrice && (
          <div className="text-sm text-muted-foreground line-through font-medium mb-1">
            De {formatCurrency(product.price)}
          </div>
        )}
        <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4 mb-2">
          <div className="text-5xl font-black tracking-tighter text-foreground">
            {formatCurrency(product.pixPrice ?? product.price)}
          </div>
          <div className="text-success font-black uppercase tracking-wider text-sm mb-2">
            no PIX
          </div>
        </div>
        
        {product.installmentCount && product.installmentValue && (
          <div className="text-muted-foreground font-medium text-lg">
            ou {product.installmentCount}x de <span className="font-bold text-foreground">{formatCurrency(product.installmentValue)}</span> sem juros
          </div>
        )}
      </div>

      {/* Action Area */}
      <div className="bg-card border border-muted rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Quantity */}
          <div className="flex items-center border border-input rounded-md h-14 bg-background w-full sm:w-32 shrink-0">
            <button 
              className="w-10 h-full flex items-center justify-center font-bold text-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-l-md transition-colors"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={!isAvailable}
              aria-label="Diminuir quantidade"
            >
              -
            </button>
            <div className="flex-1 text-center font-bold text-lg">{quantity}</div>
            <button 
              className="w-10 h-full flex items-center justify-center font-bold text-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-r-md transition-colors"
              onClick={() => setQuantity(Math.min(product.stockQuantity ?? 10, quantity + 1))}
              disabled={!isAvailable || quantity >= (product.stockQuantity ?? 10)}
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>
          
          {/* CTA */}
          <Button 
            className="flex-1 h-14 text-lg font-black shadow-lg hover:shadow-xl transition-all" 
            size="lg"
            onClick={handleAddToCart}
            disabled={!isAvailable}
          >
            {isAvailable ? 'ADICIONAR AO CARRINHO' : 'ESGOTADO'}
          </Button>
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-center gap-2 text-sm font-semibold">
          {isAvailable ? (
            <>
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-success">Em estoque</span>
              <span className="text-muted-foreground ml-1">({product.stockQuantity} disponíveis)</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-destructive" />
              <span className="text-destructive">Produto indisponível no momento</span>
            </>
          )}
        </div>
      </div>

      {/* Shipping Mock */}
      <ShippingCalculator />

      {/* Benefits */}
      <div className="mt-8 pt-8 border-t border-muted grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold text-foreground leading-tight">Compra segura</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold text-foreground leading-tight">Entrega Brasil</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold text-foreground leading-tight">Garantia {product.warrantyMonths}m</span>
        </div>
      </div>
      
      {/* Sticky Mobile Buy Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-muted p-4 pb-safe flex items-center justify-between gap-4 z-50 shadow-2xl">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-success uppercase">No PIX</span>
          <span className="text-2xl font-black text-foreground tracking-tighter leading-none">
            {formatCurrency(product.pixPrice ?? product.price)}
          </span>
        </div>
        <Button 
          className="h-12 px-8 font-black shadow-lg" 
          onClick={handleAddToCart}
          disabled={!isAvailable}
        >
          COMPRAR
        </Button>
      </div>
    </div>
  );
}
