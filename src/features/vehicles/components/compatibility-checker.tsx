"use client"

import * as React from "react"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { 
  getVehicleBrandsAction, 
  getVehicleModelsAction, 
  getVehicleYearsAction, 
  getVehicleVersionsAction 
} from "../services/finder-actions"
import { checkProductCompatibilityAction } from "../services/compatibility-actions"
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react"

export function CompatibilityChecker({ productId }: { productId: string }) {
  const [brands, setBrands] = React.useState<{id:string, name:string}[]>([]);
  const [models, setModels] = React.useState<{id:string, name:string}[]>([]);
  const [years, setYears] = React.useState<number[]>([]);
  const [versions, setVersions] = React.useState<{id:string, name:string}[]>([]);

  const [brand, setBrand] = React.useState('');
  const [model, setModel] = React.useState('');
  const [year, setYear] = React.useState('');
  const [version, setVersion] = React.useState('');

  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'checking' | 'compatible' | 'incompatible' | 'unknown'>('idle');

  React.useEffect(() => {
    let active = true;
    async function init() {
      setLoading(true);
      try {
        const data = await getVehicleBrandsAction();
        if (active) setBrands(data);
      } finally {
        if (active) setLoading(false);
      }
    }
    init();
    return () => { active = false; };
  }, []);

  const handleBrandChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setBrand(val);
    setModel(''); setYear(''); setVersion('');
    setModels([]); setYears([]); setVersions([]);
    setStatus('idle');
    
    if (val) {
      setLoading(true);
      const data = await getVehicleModelsAction(val);
      setModels(data);
      setLoading(false);
    }
  };

  const handleModelChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setModel(val);
    setYear(''); setVersion('');
    setYears([]); setVersions([]);
    setStatus('idle');

    if (val) {
      setLoading(true);
      const data = await getVehicleYearsAction(val);
      setYears(data);
      setLoading(false);
    }
  };

  const handleYearChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setYear(val);
    setVersion('');
    setVersions([]);
    setStatus('idle');

    if (val && model) {
      setLoading(true);
      const data = await getVehicleVersionsAction(model, parseInt(val));
      setVersions(data);
      setLoading(false);
    }
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVersion(e.target.value);
    setStatus('idle');
  }

  const handleCheck = async () => {
    if (!version) return;
    setStatus('checking');
    const result = await checkProductCompatibilityAction(productId, version);
    setStatus(result);
  }

  return (
    <div className="bg-card border rounded-2xl p-6 shadow-sm">
      <h3 className="text-xl font-bold mb-4">Serve no meu carro?</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Selecione o seu veículo para confirmar se esta medida é recomendada.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase">Marca</label>
          <Select value={brand} onChange={handleBrandChange} disabled={loading && brands.length === 0}>
            <option value="">Selecione...</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase">Modelo</label>
          <Select value={model} onChange={handleModelChange} disabled={!brand || loading}>
            <option value="">Selecione...</option>
            {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase">Ano</label>
          <Select value={year} onChange={handleYearChange} disabled={!model || loading}>
            <option value="">Selecione...</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold text-muted-foreground uppercase">Versão</label>
          <Select value={version} onChange={handleVersionChange} disabled={!year || loading}>
            <option value="">Selecione...</option>
            {versions.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
          </Select>
        </div>
      </div>

      <Button 
        onClick={handleCheck} 
        disabled={!version || status === 'checking'} 
        className="w-full mb-6"
      >
        {status === 'checking' ? 'Verificando...' : 'Verificar Compatibilidade'}
      </Button>

      {status === 'compatible' && (
        <div className="bg-success/10 border border-success/20 p-4 rounded-xl flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-success">Compatível com esta versão.</p>
            <p className="text-sm text-success/80 mt-1">Este pneu possui as medidas homologadas para o veículo selecionado.</p>
          </div>
        </div>
      )}

      {status === 'incompatible' && (
        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl flex items-start gap-3">
          <XCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold text-destructive">Esta medida não consta como compatível com a versão selecionada.</p>
            <p className="text-sm text-destructive/80 mt-1">Verifique se você selecionou a versão correta do seu veículo.</p>
          </div>
        </div>
      )}

      {status === 'unknown' && (
        <div className="bg-muted p-4 rounded-xl flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-bold">Não foi possível confirmar a compatibilidade.</p>
            <p className="text-sm text-muted-foreground mt-1">Os dados para esta versão podem estar incompletos ou a medida não é de fábrica.</p>
          </div>
        </div>
      )}

      {status !== 'idle' && status !== 'checking' && (
        <p className="text-xs text-muted-foreground mt-4 text-center">
          * Consulte também a medida indicada no manual do veículo ou no pneu atualmente instalado.
        </p>
      )}
    </div>
  )
}
