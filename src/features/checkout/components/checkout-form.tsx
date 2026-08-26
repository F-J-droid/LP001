'use client';

import React, { useState, useEffect } from 'react';
import { useForm, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, CheckoutFormData } from '../schemas/checkout.schema';
import { useCart } from '@/features/cart/context/cart-context';
import { getCartSubtotal, getCartPixTotal, getCartSavings, getCartTotalQuantity } from '@/features/cart/utils/calculations';
import { formatCurrency, formatTireSize } from '@/features/products/utils/formatters';
import { mockShippingService } from '../services/mock-shipping-service';
import { processCheckoutAction } from '../actions/checkout-actions';
import { formatCpf } from '../utils/cpf';
import { formatPhone, formatZipCode, normalizeZipCode } from '../utils/masks';
import { ShippingOption } from '../types';
import { ShieldCheck, MapPin, User, CreditCard, Truck, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { trackingService } from '@/features/tracking/services/tracking-service';

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export function CheckoutForm() {
  const { state, isHydrated, dispatch } = useCart();
  const router = useRouter();
  
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkoutResult, setCheckoutResult] = useState<{ success: boolean; id?: string; message?: string } | null>(null);
  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer: { fullName: '', email: '', cpf: '', phone: '' },
      address: { zipCode: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' },
      paymentMethod: 'pix'
    },
    mode: 'onTouched' // scroll to error works better with form modes
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const zipCodeValue = form.watch('address.zipCode');
  const selectedShippingId = form.watch('shippingOptionId');
  const itemsCount = getCartTotalQuantity(state.items);

  // Redirect if empty
  useEffect(() => {
    if (isHydrated && state.items.length === 0 && !checkoutResult?.success) {
      router.replace('/carrinho');
    }
  }, [isHydrated, state.items.length, router, checkoutResult]);

  // Track Begin Checkout
  useEffect(() => {
    if (isHydrated && state.items.length > 0 && !checkoutResult?.success) {
      const subtotal = getCartSubtotal(state.items);
      const items = state.items.map(item => ({
        itemId: item.productId,
        sku: item.productId,
        itemName: `${item.brand} ${item.model}`,
        brand: item.brand,
        category: 'Pneus',
        price: Math.round(item.unitPrice * 100),
        quantity: item.quantity
      }));
      trackingService.trackBeginCheckout(items, Math.round(subtotal * 100));
    }
  }, [isHydrated, state.items.length, checkoutResult?.success]);

  // Fetch shipping options when valid zip is entered
  useEffect(() => {
    const fetchShipping = async () => {
      const normalizedZip = normalizeZipCode(zipCodeValue || '');
      if (normalizedZip.length === 8) {
        setIsLoadingShipping(true);
        try {
          const options = await mockShippingService.getOptions(normalizedZip, itemsCount);
          setShippingOptions(options);
          
          // Auto-select first option if none selected
          if (!selectedShippingId && options.length > 0) {
            form.setValue('shippingOptionId', options[0].id, { shouldValidate: true });
          }
        } finally {
          setIsLoadingShipping(false);
        }
      } else {
        setShippingOptions([]);
      }
    };
    
    // Simple debounce
    const timeout = setTimeout(fetchShipping, 500);
    return () => clearTimeout(timeout);
  }, [zipCodeValue, itemsCount, form, selectedShippingId]);

  if (!isHydrated || (state.items.length === 0 && !checkoutResult?.success)) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (checkoutResult?.success) {
    return (
      <div className="bg-card border border-muted rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto my-12 shadow-sm">
        <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldCheck className="w-12 h-12 text-success" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4">Pedido pronto para processamento</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Seus dados e itens foram validados com sucesso. A integração de pagamento será adicionada na próxima fase.
        </p>
        <div className="bg-muted/30 border border-muted rounded-xl p-4 font-mono text-sm text-muted-foreground mb-8">
          ID da Simulação: {checkoutResult.id}
        </div>
        <Button asChild size="lg" className="font-bold px-8">
          <Link href="/">VOLTAR PARA A HOME</Link>
        </Button>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      // Assemble items payload
      const items = state.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        expectedPriceCents: data.paymentMethod === 'pix' && item.pixPrice ? item.pixPrice : item.unitPrice
      }));

      const trackingItems = state.items.map(item => ({
        itemId: item.productId,
        sku: item.productId,
        itemName: `${item.brand} ${item.model}`,
        brand: item.brand,
        category: 'Pneus',
        price: Math.round((data.paymentMethod === 'pix' && item.pixPrice ? item.pixPrice : item.unitPrice) * 100),
        quantity: item.quantity
      }));
      const subtotal = getCartSubtotal(state.items);
      
      const selectedShipping = shippingOptions.find(o => o.id === data.shippingOptionId);
      
      // Track Shipping
      trackingService.trackAddShippingInfo(trackingItems, Math.round(subtotal * 100), selectedShipping?.name || 'standard');
      
      // Track Payment
      trackingService.trackAddPaymentInfo(trackingItems, Math.round(subtotal * 100), data.paymentMethod);

      const result = await processCheckoutAction({
        formData: data,
        items,
        idempotencyKey
      });

      if (result.success) {
        // Only clear the cart on confirmed successful server action
        dispatch({ type: 'CLEAR_CART' });
        router.push(`/checkout/sucesso/${result.publicId}`);
      } else {
        setCheckoutResult({ success: false, message: result.message });
      }
    } catch (err) {
      setCheckoutResult({ success: false, message: 'Erro ao conectar ao servidor. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: FieldErrors<CheckoutFormData>) => {
    // Scroll to the first error
    const errorKeys = Object.keys(errors);
    if (errorKeys.length > 0) {
      const firstError = document.querySelector(`[name="${errorKeys[0]}"]`) || document.querySelector('.text-destructive');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const subtotal = getCartSubtotal(state.items);
  const pixTotal = getCartPixTotal(state.items);
  const savings = getCartSavings(state.items);
  const selectedShipping = shippingOptions.find(o => o.id === selectedShippingId);
  const shippingCost = selectedShipping?.price || 0;
  
  const paymentMethod = form.watch('paymentMethod');
  const finalTotal = (paymentMethod === 'pix' ? pixTotal : subtotal) + shippingCost;

  return (
    <form onSubmit={form.handleSubmit(onSubmit, onError)} className="flex flex-col lg:flex-row gap-8 items-start relative">
      
      {/* Left Column - Form */}
      <div className="w-full lg:w-[65%] space-y-6">
        
        {checkoutResult?.success === false && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-6 py-4 rounded-xl font-bold">
            Erro: {checkoutResult.message}
          </div>
        )}

        {/* 1. Identificação */}
        <div className="bg-card border border-muted rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-muted/50">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</div>
            <h2 className="text-xl font-bold flex items-center gap-2"><User className="w-5 h-5 text-muted-foreground" /> Identificação</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-muted-foreground mb-1">Nome completo</label>
              <input 
                {...form.register('customer.fullName')}
                className={`w-full h-12 px-4 rounded-xl border ${form.formState.errors.customer?.fullName ? 'border-destructive' : 'border-input'} bg-background focus:ring-2 focus:ring-primary outline-none transition-all`}
                placeholder="Ex: João da Silva"
              />
              {form.formState.errors.customer?.fullName && <p className="text-destructive text-xs mt-1 font-semibold">{form.formState.errors.customer.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-1">E-mail</label>
              <input 
                type="email"
                {...form.register('customer.email')}
                className={`w-full h-12 px-4 rounded-xl border ${form.formState.errors.customer?.email ? 'border-destructive' : 'border-input'} bg-background focus:ring-2 focus:ring-primary outline-none transition-all`}
                placeholder="joao@exemplo.com"
              />
              {form.formState.errors.customer?.email && <p className="text-destructive text-xs mt-1 font-semibold">{form.formState.errors.customer.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-muted-foreground mb-1">CPF</label>
              <input 
                {...form.register('customer.cpf')}
                onChange={e => {
                  const formatted = formatCpf(e.target.value);
                  form.setValue('customer.cpf', formatted, { shouldValidate: true });
                }}
                maxLength={14}
                className={`w-full h-12 px-4 rounded-xl border ${form.formState.errors.customer?.cpf ? 'border-destructive' : 'border-input'} bg-background focus:ring-2 focus:ring-primary outline-none transition-all`}
                placeholder="000.000.000-00"
              />
              {form.formState.errors.customer?.cpf && <p className="text-destructive text-xs mt-1 font-semibold">{form.formState.errors.customer.cpf.message}</p>}
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-muted-foreground mb-1">WhatsApp / Telefone</label>
              <input 
                type="tel"
                {...form.register('customer.phone')}
                onChange={e => {
                  const formatted = formatPhone(e.target.value);
                  form.setValue('customer.phone', formatted, { shouldValidate: true });
                }}
                maxLength={15}
                className={`w-full h-12 px-4 rounded-xl border ${form.formState.errors.customer?.phone ? 'border-destructive' : 'border-input'} bg-background focus:ring-2 focus:ring-primary outline-none transition-all`}
                placeholder="(00) 00000-0000"
              />
              {form.formState.errors.customer?.phone && <p className="text-destructive text-xs mt-1 font-semibold">{form.formState.errors.customer.phone.message}</p>}
            </div>
          </div>
        </div>

        {/* 2. Endereço */}
        <div className="bg-card border border-muted rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-muted/50">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</div>
            <h2 className="text-xl font-bold flex items-center gap-2"><MapPin className="w-5 h-5 text-muted-foreground" /> Endereço de Entrega</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="col-span-1 md:col-span-4">
              <label className="block text-sm font-bold text-muted-foreground mb-1">CEP</label>
              <input 
                {...form.register('address.zipCode')}
                onChange={e => {
                  const formatted = formatZipCode(e.target.value);
                  form.setValue('address.zipCode', formatted, { shouldValidate: true });
                }}
                maxLength={9}
                className={`w-full h-12 px-4 rounded-xl border ${form.formState.errors.address?.zipCode ? 'border-destructive' : 'border-input'} bg-background focus:ring-2 focus:ring-primary outline-none transition-all`}
                placeholder="00000-000"
              />
              {form.formState.errors.address?.zipCode && <p className="text-destructive text-xs mt-1 font-semibold">{form.formState.errors.address.zipCode.message}</p>}
            </div>

            <div className="col-span-1 md:col-span-8">
              <label className="block text-sm font-bold text-muted-foreground mb-1">Rua / Avenida</label>
              <input 
                {...form.register('address.street')}
                className={`w-full h-12 px-4 rounded-xl border ${form.formState.errors.address?.street ? 'border-destructive' : 'border-input'} bg-background focus:ring-2 focus:ring-primary outline-none transition-all`}
                placeholder="Ex: Avenida Paulista"
              />
              {form.formState.errors.address?.street && <p className="text-destructive text-xs mt-1 font-semibold">{form.formState.errors.address.street.message}</p>}
            </div>

            <div className="col-span-1 md:col-span-4">
              <label className="block text-sm font-bold text-muted-foreground mb-1">Número</label>
              <input 
                {...form.register('address.number')}
                className={`w-full h-12 px-4 rounded-xl border ${form.formState.errors.address?.number ? 'border-destructive' : 'border-input'} bg-background focus:ring-2 focus:ring-primary outline-none transition-all`}
                placeholder="Ex: 1000"
              />
              {form.formState.errors.address?.number && <p className="text-destructive text-xs mt-1 font-semibold">{form.formState.errors.address.number.message}</p>}
            </div>

            <div className="col-span-1 md:col-span-8">
              <label className="block text-sm font-bold text-muted-foreground mb-1">Complemento (opcional)</label>
              <input 
                {...form.register('address.complement')}
                className="w-full h-12 px-4 rounded-xl border border-input bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                placeholder="Apto, Bloco, Casa 2"
              />
            </div>

            <div className="col-span-1 md:col-span-5">
              <label className="block text-sm font-bold text-muted-foreground mb-1">Bairro</label>
              <input 
                {...form.register('address.neighborhood')}
                className={`w-full h-12 px-4 rounded-xl border ${form.formState.errors.address?.neighborhood ? 'border-destructive' : 'border-input'} bg-background focus:ring-2 focus:ring-primary outline-none transition-all`}
              />
              {form.formState.errors.address?.neighborhood && <p className="text-destructive text-xs mt-1 font-semibold">{form.formState.errors.address.neighborhood.message}</p>}
            </div>

            <div className="col-span-1 md:col-span-5">
              <label className="block text-sm font-bold text-muted-foreground mb-1">Cidade</label>
              <input 
                {...form.register('address.city')}
                className={`w-full h-12 px-4 rounded-xl border ${form.formState.errors.address?.city ? 'border-destructive' : 'border-input'} bg-background focus:ring-2 focus:ring-primary outline-none transition-all`}
              />
              {form.formState.errors.address?.city && <p className="text-destructive text-xs mt-1 font-semibold">{form.formState.errors.address.city.message}</p>}
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-muted-foreground mb-1">UF</label>
              <select 
                {...form.register('address.state')}
                className={`w-full h-12 px-4 rounded-xl border ${form.formState.errors.address?.state ? 'border-destructive' : 'border-input'} bg-background focus:ring-2 focus:ring-primary outline-none transition-all appearance-none`}
              >
                <option value="">--</option>
                {BRAZILIAN_STATES.map(uf => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
              {form.formState.errors.address?.state && <p className="text-destructive text-xs mt-1 font-semibold">{form.formState.errors.address.state.message}</p>}
            </div>
          </div>
        </div>

        {/* 3. Entrega */}
        <div className="bg-card border border-muted rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-muted/50">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</div>
            <h2 className="text-xl font-bold flex items-center gap-2"><Truck className="w-5 h-5 text-muted-foreground" /> Opções de Entrega</h2>
          </div>

          <div className="space-y-4">
            {isLoadingShipping && (
              <div className="animate-pulse flex gap-4 bg-muted/20 p-4 rounded-xl border border-muted h-24" />
            )}
            
            {!isLoadingShipping && shippingOptions.length === 0 && (
              <div className="bg-muted/20 text-muted-foreground p-6 rounded-xl text-center border border-dashed border-muted font-medium text-sm">
                Preencha um CEP válido acima para calcular o frete.
              </div>
            )}

            {!isLoadingShipping && shippingOptions.map((opt) => (
              <label key={opt.id} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-muted/10 ${selectedShippingId === opt.id ? 'border-primary bg-primary/5' : 'border-muted'}`}>
                <div className="flex items-center gap-4">
                  <input 
                    type="radio" 
                    value={opt.id}
                    {...form.register('shippingOptionId')}
                    className="w-5 h-5 text-primary focus:ring-primary"
                  />
                  <div>
                    <div className="font-bold text-foreground">{opt.name}</div>
                    <div className="text-sm text-muted-foreground font-medium">Entrega estimada: {opt.estimatedMinDays} a {opt.estimatedMaxDays} dias úteis</div>
                  </div>
                </div>
                <div className="font-black text-lg text-primary">{formatCurrency(opt.price)}</div>
              </label>
            ))}
            {form.formState.errors.shippingOptionId && <p className="text-destructive text-xs mt-1 font-semibold text-center">{form.formState.errors.shippingOptionId.message}</p>}
          </div>
        </div>

        {/* 4. Pagamento */}
        <div className="bg-card border border-muted rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-muted/50">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">4</div>
            <h2 className="text-xl font-bold flex items-center gap-2"><CreditCard className="w-5 h-5 text-muted-foreground" /> Forma de Pagamento</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <label className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-muted/10 ${paymentMethod === 'pix' ? 'border-primary bg-primary/5' : 'border-muted'}`}>
              <div className="flex items-center gap-3 mb-2">
                <input 
                  type="radio" 
                  value="pix"
                  {...form.register('paymentMethod')}
                  className="w-5 h-5 text-primary focus:ring-primary"
                />
                <span className="font-bold text-foreground flex items-center gap-1">PIX <span className="text-xs bg-success/20 text-success px-2 py-0.5 rounded-full ml-1">Até 10% OFF</span></span>
              </div>
              <p className="text-xs text-muted-foreground pl-8">Aprovação imediata. O QR Code será gerado após finalizar.</p>
            </label>

            <label className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all hover:bg-muted/10 ${paymentMethod === 'credit_card' ? 'border-primary bg-primary/5' : 'border-muted'}`}>
              <div className="flex items-center gap-3 mb-2">
                <input 
                  type="radio" 
                  value="credit_card"
                  {...form.register('paymentMethod')}
                  className="w-5 h-5 text-primary focus:ring-primary"
                />
                <span className="font-bold text-foreground">Cartão de Crédito</span>
              </div>
              <p className="text-xs text-muted-foreground pl-8">Parcele em até 12x. Processamento seguro pelo gateway.</p>
            </label>
          </div>

          {paymentMethod === 'credit_card' && (
            <div className="bg-muted/10 p-6 rounded-xl border border-muted mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-muted-foreground mb-1">Nome impresso no cartão</label>
                  <input 
                    {...form.register('creditCard.holderName')}
                    className={`w-full h-12 px-4 rounded-xl border ${form.formState.errors.creditCard?.holderName ? 'border-destructive' : 'border-input'} bg-background focus:ring-2 focus:ring-primary outline-none transition-all uppercase`}
                    placeholder="JOAO DA SILVA"
                  />
                  {form.formState.errors.creditCard?.holderName && <p className="text-destructive text-xs mt-1 font-semibold">{form.formState.errors.creditCard.holderName.message}</p>}
                </div>

                <div className="col-span-1 md:col-span-2">
                  <label className="block text-sm font-bold text-muted-foreground mb-1">Número do Cartão</label>
                  <input 
                    {...form.register('creditCard.number')}
                    onChange={e => {
                      let val = e.target.value.replace(/\D/g, '');
                      val = val.replace(/(\d{4})/g, '$1 ').trim();
                      form.setValue('creditCard.number', val, { shouldValidate: true });
                    }}
                    maxLength={19}
                    className={`w-full h-12 px-4 rounded-xl border ${form.formState.errors.creditCard?.number ? 'border-destructive' : 'border-input'} bg-background focus:ring-2 focus:ring-primary outline-none transition-all`}
                    placeholder="0000 0000 0000 0000"
                  />
                  {form.formState.errors.creditCard?.number && <p className="text-destructive text-xs mt-1 font-semibold">{form.formState.errors.creditCard.number.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-1">Validade (Mês/Ano)</label>
                  <div className="flex gap-2">
                    <input 
                      {...form.register('creditCard.expiryMonth')}
                      maxLength={2}
                      className={`w-1/2 h-12 px-4 rounded-xl border ${form.formState.errors.creditCard?.expiryMonth ? 'border-destructive' : 'border-input'} bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-center`}
                      placeholder="MM"
                    />
                    <input 
                      {...form.register('creditCard.expiryYear')}
                      maxLength={4}
                      className={`w-1/2 h-12 px-4 rounded-xl border ${form.formState.errors.creditCard?.expiryYear ? 'border-destructive' : 'border-input'} bg-background focus:ring-2 focus:ring-primary outline-none transition-all text-center`}
                      placeholder="AAAA"
                    />
                  </div>
                  {(form.formState.errors.creditCard?.expiryMonth || form.formState.errors.creditCard?.expiryYear) && (
                    <p className="text-destructive text-xs mt-1 font-semibold">Mês e/ou Ano inválidos</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-muted-foreground mb-1">CVV</label>
                  <input 
                    {...form.register('creditCard.ccv')}
                    maxLength={4}
                    type="password"
                    className={`w-full h-12 px-4 rounded-xl border ${form.formState.errors.creditCard?.ccv ? 'border-destructive' : 'border-input'} bg-background focus:ring-2 focus:ring-primary outline-none transition-all`}
                    placeholder="123"
                  />
                  {form.formState.errors.creditCard?.ccv && <p className="text-destructive text-xs mt-1 font-semibold">{form.formState.errors.creditCard.ccv.message}</p>}
                </div>
              </div>
            </div>
          )}
          {form.formState.errors.paymentMethod && <p className="text-destructive text-xs mt-1 font-semibold">{form.formState.errors.paymentMethod.message}</p>}
        </div>

      </div>

      {/* Right Column - Summary (Sticky Desktop) */}
      <div className="w-full lg:w-[35%]">
        <div className="bg-card border border-muted rounded-2xl p-6 sticky top-24 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-foreground">Resumo do Pedido</h2>
            <Link href="/carrinho" className="text-sm font-bold text-primary hover:underline">EDITAR</Link>
          </div>
          
          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
            {state.items.map(item => (
              <div key={item.productId} className="flex gap-3 items-center">
                <div className="w-16 h-16 bg-muted/20 rounded-lg border border-muted flex items-center justify-center p-1 relative shrink-0">
                  <Image src={item.imageUrl} alt={item.model} fill className="object-contain p-1" sizes="64px" />
                  <div className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase">{item.brand}</div>
                  <div className="text-xs font-bold text-foreground truncate">{item.model}</div>
                  <div className="text-xs text-muted-foreground">{formatTireSize(item.width, item.profile, item.rim)}</div>
                </div>
                <div className="text-sm font-black text-right shrink-0">
                  {formatCurrency((paymentMethod === 'pix' && item.pixPrice ? item.pixPrice : item.unitPrice) * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 mb-6 border-t border-muted pt-6">
            <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
              <span>Subtotal dos produtos</span>
              <span>{formatCurrency(paymentMethod === 'pix' ? pixTotal : subtotal)}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
              <span>Frete</span>
              <span>{shippingCost > 0 ? formatCurrency(shippingCost) : '---'}</span>
            </div>

            {paymentMethod === 'pix' && savings > 0 && (
              <div className="flex justify-between items-center text-sm font-bold text-success bg-success/10 px-2 py-1 rounded-md">
                <span>Desconto PIX</span>
                <span>-{formatCurrency(savings)}</span>
              </div>
            )}
          </div>
          
          <div className="border-t border-muted/50 pt-4 mb-6 flex justify-between items-end">
            <span className="font-bold text-lg">Total</span>
            <span className="text-3xl font-black text-primary tracking-tighter">
              {formatCurrency(finalTotal)}
            </span>
          </div>

          <div className="mb-6">
            <label className="flex items-start gap-3 p-3 bg-muted/10 rounded-xl border border-muted cursor-pointer hover:bg-muted/20 transition-colors">
              <input 
                type="checkbox" 
                {...form.register('acceptTerms')}
                className="mt-1 w-4 h-4 text-primary focus:ring-primary rounded"
              />
              <span className="text-xs text-muted-foreground font-medium leading-relaxed">
                Li e concordo com os <Link href="/termos" className="text-foreground underline font-bold" target="_blank">Termos de Uso</Link> e a <Link href="/privacidade" className="text-foreground underline font-bold" target="_blank">Política de Privacidade</Link>.
              </span>
            </label>
            {form.formState.errors.acceptTerms && <p className="text-destructive text-xs mt-1 font-semibold">{form.formState.errors.acceptTerms.message}</p>}
          </div>

          <Button type="submit" disabled={isSubmitting} size="lg" className="w-full font-black h-14 text-lg shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1 relative">
            {isSubmitting ? (
              'PROCESSANDO...'
            ) : (
              <>FINALIZAR PEDIDO <ChevronRight className="w-5 h-5 ml-1 absolute right-4" /></>
            )}
          </Button>
          
          <div className="mt-4 flex flex-col items-center justify-center gap-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-widest text-center">
            <ShieldCheck className="w-4 h-4 text-success mb-1" />
            Ambiente preparado para pagamento seguro
          </div>
        </div>
      </div>
    </form>
  );
}
