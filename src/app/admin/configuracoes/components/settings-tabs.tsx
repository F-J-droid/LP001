/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  StoreInfoSettingsSchema, 
  ContactSettingsSchema, 
  SocialMediaSettingsSchema, 
  CommerceSettingsSchema, 
  SeoSettingsSchema,
  TrackingSettingsSchema
} from '@/features/admin/settings/schemas/settings.schema';
import { Button } from '@/components/ui/button';
import { saveSettingsSectionAction } from '@/features/admin/settings/actions/settings-actions';
import { checkMetaCapiConfiguredAction } from '@/features/tracking/actions/tracking-actions';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsTabsProps {
  initialSettings: Record<string, any>;
}

export function SettingsTabs({ initialSettings }: SettingsTabsProps) {
  const [activeTab, setActiveTab] = useState('store_info');

  const tabs = [
    { id: 'store_info', label: 'Dados da Loja' },
    { id: 'contact', label: 'Contato' },
    { id: 'social_media', label: 'Redes Sociais' },
    { id: 'commerce', label: 'Regras Comerciais' },
    { id: 'seo', label: 'SEO' },
    { id: 'tracking', label: 'Rastreamento & Conversões' },
  ];

  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col md:flex-row">
      {/* Sidebar Tabs */}
      <div className="w-full md:w-64 bg-muted/30 border-r p-4 space-y-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-4 py-2 rounded-md font-medium text-sm transition-colors ${
              activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 md:p-8">
        {activeTab === 'store_info' && <StoreInfoForm initialData={initialSettings['store_info']} />}
        {activeTab === 'contact' && <ContactForm initialData={initialSettings['contact']} />}
        {activeTab === 'social_media' && <SocialMediaForm initialData={initialSettings['social_media']} />}
        {activeTab === 'commerce' && <CommerceForm initialData={initialSettings['commerce']} />}
        {activeTab === 'seo' && <SeoForm initialData={initialSettings['seo']} />}
        {activeTab === 'tracking' && <TrackingForm initialData={initialSettings['tracking']} />}
      </div>
    </div>
  );
}

// --- FORMS --- //

function BaseForm({ sectionKey, schema, initialData, children }: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || {}
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const result = await saveSettingsSectionAction(sectionKey, data);
      if (result.error) toast.error(result.error);
      else toast.success('Configurações salvas.');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {children(form)}
      <Button type="submit" disabled={isSubmitting}>
        <Save className="w-4 h-4 mr-2" />
        {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
      </Button>
    </form>
  );
}

function StoreInfoForm({ initialData }: any) {
  return (
    <BaseForm sectionKey="store_info" schema={StoreInfoSettingsSchema} initialData={initialData}>
      {(form: any) => (
        <>
          <h2 className="text-xl font-bold border-b pb-2">Dados da Loja</h2>
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="text-sm font-medium">Nome Fantasia da Loja</label>
              <input {...form.register('store_name')} className="w-full h-10 px-3 border rounded-md bg-background" />
              {form.formState.errors.store_name && <p className="text-xs text-red-500">{form.formState.errors.store_name.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Razão Social (Opcional)</label>
              <input {...form.register('legal_name')} className="w-full h-10 px-3 border rounded-md bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium">URL da Logo Principal</label>
              <input {...form.register('logo_url')} className="w-full h-10 px-3 border rounded-md bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium">URL do Favicon (Opcional)</label>
              <input {...form.register('favicon_url')} className="w-full h-10 px-3 border rounded-md bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium">Sobre a Loja / Descrição Curta</label>
              <textarea {...form.register('description')} className="w-full p-3 border rounded-md bg-background min-h-[100px]" />
            </div>
          </div>
        </>
      )}
    </BaseForm>
  );
}

function ContactForm({ initialData }: any) {
  return (
    <BaseForm sectionKey="contact" schema={ContactSettingsSchema} initialData={initialData}>
      {(form: any) => (
        <>
          <h2 className="text-xl font-bold border-b pb-2">Atendimento e Contato</h2>
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="text-sm font-medium">Email Oficial</label>
              <input {...form.register('email')} type="email" className="w-full h-10 px-3 border rounded-md bg-background" />
              {form.formState.errors.email && <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Telefone de Contato</label>
              <input {...form.register('phone')} className="w-full h-10 px-3 border rounded-md bg-background" />
              {form.formState.errors.phone && <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Número do WhatsApp</label>
              <input {...form.register('whatsapp')} className="w-full h-10 px-3 border rounded-md bg-background" />
              {form.formState.errors.whatsapp && <p className="text-xs text-red-500">{form.formState.errors.whatsapp.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Horário de Atendimento Livre (Ex: Seg a Sex, 08h às 18h)</label>
              <input {...form.register('business_hours')} className="w-full h-10 px-3 border rounded-md bg-background" />
            </div>
          </div>
        </>
      )}
    </BaseForm>
  );
}

function SocialMediaForm({ initialData }: any) {
  return (
    <BaseForm sectionKey="social_media" schema={SocialMediaSettingsSchema} initialData={initialData}>
      {(form: any) => (
        <>
          <h2 className="text-xl font-bold border-b pb-2">Redes Sociais</h2>
          <p className="text-sm text-muted-foreground mb-4">Deixe em branco as que não possuir.</p>
          <div className="space-y-4 max-w-xl">
            {['instagram', 'facebook', 'youtube', 'tiktok'].map(network => (
              <div key={network}>
                <label className="text-sm font-medium capitalize">{network} (URL completa)</label>
                <input {...form.register(network)} className="w-full h-10 px-3 border rounded-md bg-background" placeholder={`https://${network}.com/suapagina`} />
                {form.formState.errors[network] && <p className="text-xs text-red-500">{form.formState.errors[network].message}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </BaseForm>
  );
}

function CommerceForm({ initialData }: any) {
  const mergedData = { max_installments: 12, pix_label: 'PIX (10% off)', low_stock_threshold: 4, currency: 'BRL', ...initialData };
  return (
    <BaseForm sectionKey="commerce" schema={CommerceSettingsSchema} initialData={mergedData}>
      {(form: any) => (
        <>
          <h2 className="text-xl font-bold border-b pb-2">Regras Comerciais</h2>
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="text-sm font-medium">Moeda</label>
              <select {...form.register('currency')} className="w-full h-10 px-3 border rounded-md bg-background">
                <option value="BRL">Real (BRL)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Máximo de Parcelas (Cartão)</label>
              <input type="number" min="1" max="24" {...form.register('max_installments')} className="w-full h-10 px-3 border rounded-md bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium">Label/Aviso Pix</label>
              <input {...form.register('pix_label')} className="w-full h-10 px-3 border rounded-md bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium">Alerta de Estoque Baixo (Quantidade)</label>
              <input type="number" min="0" {...form.register('low_stock_threshold')} className="w-full h-10 px-3 border rounded-md bg-background" />
            </div>
          </div>
        </>
      )}
    </BaseForm>
  );
}

function SeoForm({ initialData }: any) {
  return (
    <BaseForm sectionKey="seo" schema={SeoSettingsSchema} initialData={initialData}>
      {(form: any) => (
        <>
          <h2 className="text-xl font-bold border-b pb-2">SEO Global</h2>
          <div className="space-y-4 max-w-xl">
            <div>
              <label className="text-sm font-medium">Título Padrão (Title Tag)</label>
              <input {...form.register('default_title')} className="w-full h-10 px-3 border rounded-md bg-background" />
              {form.formState.errors.default_title && <p className="text-xs text-red-500">{form.formState.errors.default_title.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Descrição Padrão (Meta Description)</label>
              <textarea {...form.register('default_description')} className="w-full p-3 border rounded-md bg-background min-h-[100px]" />
              {form.formState.errors.default_description && <p className="text-xs text-red-500">{form.formState.errors.default_description.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">OG Image URL (Para redes sociais)</label>
              <input {...form.register('og_image_url')} className="w-full h-10 px-3 border rounded-md bg-background" />
            </div>
          </div>
        </>
      )}
    </BaseForm>
  );
}

function TrackingForm({ initialData }: any) {
  const [capiStatus, setCapiStatus] = useState<boolean | null>(null);

  useState(() => {
    checkMetaCapiConfiguredAction().then(res => setCapiStatus(res.configured ?? false));
  });

  return (
    <BaseForm sectionKey="tracking" schema={TrackingSettingsSchema} initialData={initialData}>
      {(form: any) => {
        const metaPixelId = form.watch('meta.pixelId');
        const ga4MeasurementId = form.watch('ga4.measurementId');
        const gtmContainerId = form.watch('gtm.containerId');
        
        return (
          <div className="space-y-8 max-w-2xl">
            <div className="flex flex-col border-b pb-4">
              <h2 className="text-xl font-bold">Rastreamento & Conversões</h2>
              <p className="text-sm text-muted-foreground mt-1">Configure Meta Pixel, CAPI, Google Analytics 4, Tag Manager e Google Ads.</p>
            </div>

            {/* META ADS */}
            <div className="space-y-4 bg-muted/20 p-4 rounded-lg border border-border">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Meta Ads
              </h3>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...form.register('meta.enabled')} className="w-4 h-4 accent-primary" />
                <span className="text-sm font-medium">Habilitar Meta Pixel</span>
              </label>

              <div>
                <label className="text-sm font-medium">Meta Pixel ID</label>
                <input {...form.register('meta.pixelId')} className="w-full h-10 px-3 border rounded-md bg-background mt-1" placeholder="Ex: 123456789012345" />
                <p className="text-xs text-muted-foreground mt-1">Encontrado no Gerenciador de Eventos da Meta.</p>
              </div>

              <label className="flex items-center gap-2 cursor-pointer mt-4">
                <input type="checkbox" {...form.register('meta.capiEnabled')} className="w-4 h-4 accent-primary" />
                <span className="text-sm font-medium">Habilitar Conversions API (CAPI) server-side</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer mt-2">
                <input type="checkbox" {...form.register('meta.advancedMatchingEnabled')} className="w-4 h-4 accent-primary" />
                <span className="text-sm font-medium">Habilitar Advanced Matching Automático</span>
              </label>

              <div className="mt-4">
                <label className="text-sm font-medium">Test Event Code (Opcional - Apenas Dev)</label>
                <input {...form.register('meta.testEventCode')} className="w-full h-10 px-3 border rounded-md bg-background mt-1" placeholder="Ex: TEST12345" />
              </div>
            </div>

            {/* GA4 */}
            <div className="space-y-4 bg-muted/20 p-4 rounded-lg border border-border">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                Google Analytics 4
              </h3>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...form.register('ga4.enabled')} className="w-4 h-4 accent-primary" />
                <span className="text-sm font-medium">Habilitar GA4</span>
              </label>

              <div>
                <label className="text-sm font-medium">Measurement ID</label>
                <input {...form.register('ga4.measurementId')} className="w-full h-10 px-3 border rounded-md bg-background mt-1" placeholder="Ex: G-XXXXXXXXXX" />
                {form.formState.errors?.ga4?.measurementId && <p className="text-xs text-red-500">{form.formState.errors.ga4.measurementId.message}</p>}
              </div>
            </div>

            {/* GTM */}
            <div className="space-y-4 bg-muted/20 p-4 rounded-lg border border-border">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Google Tag Manager
              </h3>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...form.register('gtm.enabled')} className="w-4 h-4 accent-primary" />
                <span className="text-sm font-medium">Habilitar GTM</span>
              </label>

              <div>
                <label className="text-sm font-medium">Container ID</label>
                <input {...form.register('gtm.containerId')} className="w-full h-10 px-3 border rounded-md bg-background mt-1" placeholder="Ex: GTM-XXXXXXX" />
                {form.formState.errors?.gtm?.containerId && <p className="text-xs text-red-500">{form.formState.errors.gtm.containerId.message}</p>}
              </div>
            </div>

            {/* GOOGLE ADS */}
            <div className="space-y-4 bg-muted/20 p-4 rounded-lg border border-border">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Google Ads
              </h3>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...form.register('googleAds.enabled')} className="w-4 h-4 accent-primary" />
                <span className="text-sm font-medium">Habilitar Google Ads Tracking</span>
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Conversion ID</label>
                  <input {...form.register('googleAds.conversionId')} className="w-full h-10 px-3 border rounded-md bg-background mt-1" placeholder="Ex: AW-XXXXXXXXX" />
                  {form.formState.errors?.googleAds?.conversionId && <p className="text-xs text-red-500">{form.formState.errors.googleAds.conversionId.message}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium">Purchase Conversion Label</label>
                  <input {...form.register('googleAds.purchaseConversionLabel')} className="w-full h-10 px-3 border rounded-md bg-background mt-1" />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer mt-4">
                <input type="checkbox" {...form.register('googleAds.enhancedConversionsEnabled')} className="w-4 h-4 accent-primary" />
                <span className="text-sm font-medium">Habilitar Enhanced Conversions</span>
              </label>
            </div>

            {/* DIAGNÓSTICO */}
            <div className="bg-muted p-4 rounded-lg border border-border mt-8">
              <h3 className="font-semibold text-sm mb-4 text-muted-foreground">DIAGNÓSTICO E SEGURANÇA</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                  <span className="font-medium">Meta CAPI Access Token (Server-side)</span>
                  {capiStatus === null ? (
                    <span className="text-muted-foreground text-xs">Verificando...</span>
                  ) : capiStatus ? (
                    <span className="text-green-600 bg-green-100/50 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">● Configurado</span>
                  ) : (
                    <span className="text-red-600 bg-red-100/50 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">● Não configurado</span>
                  )}
                </div>
                <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                  <span className="font-medium">Meta Pixel ID</span>
                  <span className={metaPixelId ? 'text-green-600 text-xs font-semibold' : 'text-amber-600 text-xs font-semibold'}>
                    {metaPixelId ? 'Configurado' : 'Não configurado'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                  <span className="font-medium">GA4 Measurement ID</span>
                  <span className={ga4MeasurementId ? 'text-green-600 text-xs font-semibold' : 'text-amber-600 text-xs font-semibold'}>
                    {ga4MeasurementId ? 'Configurado' : 'Não configurado'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">GTM Container ID</span>
                  <span className={gtmContainerId ? 'text-green-600 text-xs font-semibold' : 'text-amber-600 text-xs font-semibold'}>
                    {gtmContainerId ? 'Configurado' : 'Não configurado'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      }}
    </BaseForm>
  );
}
