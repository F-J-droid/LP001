'use client';

import { useCart } from '../context/cart-context';
import { getCartSubtotal, getCartPixTotal, getCartSavings } from '../utils/calculations';
import { formatCurrency, formatTireSize } from '@/features/products/utils/formatters';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag, ShieldCheck } from 'lucide-react';

export function CartPageClient() {
  const { state, dispatch, isHydrated } = useCart();
  
  // Show skeleton or nothing during SSR to avoid mismatch
  if (!isHydrated) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-64 bg-card rounded-2xl border border-muted" />
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="bg-card border border-muted rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-muted/30 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-12 h-12 text-muted-foreground/50" />
        </div>
        <h2 className="text-2xl font-black text-foreground mb-3">Seu carrinho está vazio</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          Aproveite para navegar por nossas categorias e encontrar o pneu ideal para o seu veículo.
        </p>
        <Button asChild size="lg" className="font-bold px-12 h-14 text-lg">
          <Link href="/pneus">ENCONTRAR PNEUS</Link>
        </Button>
      </div>
    );
  }

  const subtotal = getCartSubtotal(state.items);
  const pixTotal = getCartPixTotal(state.items);
  const savings = getCartSavings(state.items);

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Items List */}
      <div className="w-full lg:w-2/3 space-y-4">
        <div className="bg-card border border-muted rounded-2xl p-6 hidden md:grid grid-cols-12 gap-4 text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">
          <div className="col-span-6">Produto</div>
          <div className="col-span-2 text-center">Preço</div>
          <div className="col-span-2 text-center">Quantidade</div>
          <div className="col-span-2 text-right">Subtotal</div>
        </div>

        {state.items.map(item => (
          <div key={item.productId} className="bg-card border border-muted rounded-2xl p-4 md:p-6 flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 md:gap-6">
            
            {/* Mobile View / Product Info */}
            <div className="md:col-span-6 flex gap-4">
              <div className="w-24 h-24 bg-muted/20 border border-muted rounded-xl flex items-center justify-center relative p-2 shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.model}
                  fill
                  className="object-contain p-2"
                  sizes="96px"
                />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{item.brand}</div>
                <Link href={`/produto/${item.slug}`} className="font-black text-foreground text-sm md:text-base leading-tight hover:text-primary transition-colors line-clamp-2">
                  {item.model}
                </Link>
                <div className="text-sm text-primary font-bold mt-1">
                  {formatTireSize(item.width, item.profile, item.rim)}
                </div>
              </div>
            </div>

            {/* Price (Desktop only) */}
            <div className="hidden md:block col-span-2 text-center">
              <div className="font-bold text-foreground">
                {formatCurrency(item.pixPrice ?? item.unitPrice)}
              </div>
              {(item.pixPrice && item.pixPrice < item.unitPrice) && (
                <div className="text-xs text-muted-foreground line-through mt-0.5">
                  {formatCurrency(item.unitPrice)}
                </div>
              )}
            </div>

            {/* Actions & Quantity */}
            <div className="md:col-span-2 flex items-center justify-between md:justify-center mt-2 md:mt-0 pt-4 md:pt-0 border-t border-muted md:border-t-0">
              <div className="flex items-center border border-input rounded-md h-10 bg-background w-28 shrink-0">
                <button 
                  onClick={() => dispatch({ type: 'DECREMENT', payload: item.productId })}
                  className="flex-1 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  disabled={item.quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex-1 text-center font-bold">{item.quantity}</div>
                <button 
                  onClick={() => dispatch({ type: 'INCREMENT', payload: item.productId })}
                  className="flex-1 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  disabled={item.stockQuantity !== undefined && item.quantity >= item.stockQuantity}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Subtotal & Remove */}
            <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-4 mt-2 md:mt-0">
              <div className="md:hidden text-sm font-bold text-muted-foreground uppercase">Subtotal</div>
              <div className="font-black text-foreground text-lg text-right">
                {formatCurrency((item.pixPrice ?? item.unitPrice) * item.quantity)}
              </div>
              <button 
                onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.productId })}
                className="text-muted-foreground hover:text-destructive p-2 transition-colors absolute md:static top-4 right-4"
                aria-label={`Remover ${item.model}`}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            
          </div>
        ))}

        <div className="flex justify-between items-center mt-6">
          <Button variant="ghost" onClick={() => dispatch({ type: 'CLEAR_CART' })} className="text-muted-foreground hover:text-destructive font-semibold">
            ESVAZIAR CARRINHO
          </Button>
          <Button variant="outline" asChild className="font-bold border-muted">
            <Link href="/pneus">CONTINUAR COMPRANDO</Link>
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="w-full lg:w-1/3">
        <div className="bg-card border border-muted rounded-2xl p-6 sticky top-24 shadow-sm">
          <h2 className="text-xl font-black text-foreground mb-6">Resumo do Pedido</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center font-medium text-foreground">
              <span>Subtotal dos produtos</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            
            <div className="flex justify-between items-center font-medium text-foreground">
              <span>Frete</span>
              <span className="text-sm text-muted-foreground italic">Calculado no checkout</span>
            </div>

            {savings > 0 && (
              <div className="flex justify-between items-center font-bold text-success bg-success/10 px-3 py-2 rounded-lg border border-success/20">
                <span>Desconto PIX</span>
                <span>-{formatCurrency(savings)}</span>
              </div>
            )}
          </div>
          
          <div className="border-t border-muted pt-6 mb-8">
            <div className="flex justify-between items-end mb-1">
              <span className="font-bold text-lg">Total à vista no PIX</span>
              <span className="text-3xl font-black text-foreground tracking-tighter">
                {formatCurrency(pixTotal)}
              </span>
            </div>
            <p className="text-right text-sm text-muted-foreground font-medium">
              ou {formatCurrency(subtotal)} no cartão
            </p>
          </div>

          <Button asChild size="lg" className="w-full font-black h-14 text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1">
            <Link href="/checkout">IR PARA O CHECKOUT</Link>
          </Button>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground">
            <ShieldCheck className="w-5 h-5 text-success" />
            Compra 100% segura e protegida
          </div>
        </div>
      </div>
    </div>
  );
}
