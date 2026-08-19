'use client';

import React from 'react';
import { useCart } from '../context/cart-context';
import { getCartSubtotal, getCartPixTotal, getCartSavings } from '../utils/calculations';
import { formatCurrency, formatTireSize } from '@/features/products/utils/formatters';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

export function CartDrawer() {
  const { state, dispatch, isCartDrawerOpen, setIsCartDrawerOpen, isHydrated } = useCart();
  
  if (!isHydrated) return null;

  const subtotal = getCartSubtotal(state.items);
  const pixTotal = getCartPixTotal(state.items);
  const savings = getCartSavings(state.items);

  const handleClose = () => setIsCartDrawerOpen(false);

  return (
    <>
      {/* Backdrop */}
      {isCartDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-background shadow-2xl flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isCartDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho de Compras"
      >
        <div className="flex items-center justify-between p-5 border-b border-muted">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="font-black text-xl text-foreground tracking-tight">Meu Carrinho</h2>
          </div>
          <button 
            onClick={handleClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Fechar carrinho"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {state.items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Seu carrinho está vazio</h3>
              <p className="text-muted-foreground mb-8">
                Que tal procurar o pneu ideal para o seu veículo agora mesmo?
              </p>
              <Button onClick={handleClose} asChild className="font-bold px-8 h-12">
                <Link href="/pneus">VER PNEUS</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {state.items.map(item => (
                <div key={item.productId} className="flex gap-4">
                  {/* Item Image */}
                  <div className="w-24 h-24 bg-muted/20 border border-muted rounded-xl flex items-center justify-center relative p-2 shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.model}
                      fill
                      className="object-contain p-2"
                      sizes="96px"
                    />
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{item.brand}</div>
                        <h4 className="font-bold text-foreground text-sm leading-tight truncate" title={item.model}>
                          {item.model}
                        </h4>
                        <div className="text-xs text-muted-foreground mt-0.5 font-medium">
                          {formatTireSize(item.width, item.profile, item.rim)}
                        </div>
                      </div>
                      <button 
                        onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.productId })}
                        className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                        aria-label={`Remover ${item.model}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Control */}
                      <div className="flex items-center border border-input rounded-md h-9 bg-background w-24">
                        <button 
                          onClick={() => dispatch({ type: 'DECREMENT', payload: item.productId })}
                          className="flex-1 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <div className="flex-1 text-center font-bold text-sm">{item.quantity}</div>
                        <button 
                          onClick={() => dispatch({ type: 'INCREMENT', payload: item.productId })}
                          className="flex-1 h-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                          disabled={item.stockQuantity !== undefined && item.quantity >= item.stockQuantity}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-black text-foreground">
                          {formatCurrency((item.pixPrice ?? item.unitPrice) * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {state.items.length > 0 && (
          <div className="border-t border-muted bg-card p-5">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between items-center text-sm font-medium text-success">
                  <span>Economia no PIX</span>
                  <span>-{formatCurrency(savings)}</span>
                </div>
              )}
              <div className="flex justify-between items-end border-t border-muted/50 pt-3">
                <span className="font-bold text-foreground">Total à vista no PIX</span>
                <span className="text-2xl font-black text-foreground tracking-tight">
                  {formatCurrency(pixTotal)}
                </span>
              </div>
            </div>
            
            <div className="grid gap-3">
              <Button asChild size="lg" className="w-full font-black text-lg shadow-lg hover:shadow-xl transition-shadow">
                <Link href="/carrinho" onClick={handleClose}>
                  VER CARRINHO
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full font-bold">
                <Link href="/checkout" onClick={handleClose}>
                  FINALIZAR COMPRA
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
