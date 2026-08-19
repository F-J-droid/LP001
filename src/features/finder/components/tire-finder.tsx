"use client"

import * as React from "react"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { 
  getVehicleBrandsAction, 
  getVehicleModelsAction, 
  getVehicleYearsAction, 
  getVehicleVersionsAction 
} from "@/features/vehicles/services/finder-actions"

export type FinderMode = 'measure' | 'vehicle' | 'rim';

export function TireFinder() {
  const router = useRouter();
  const [mode, setMode] = React.useState<FinderMode>('measure');
  
  // Measure states
  const [width, setWidth] = React.useState('');
  const [profile, setProfile] = React.useState('');
  const [rimMeasure, setRimMeasure] = React.useState('');

  // Vehicle states
  const [brands, setBrands] = React.useState<{id:string, name:string, slug:string}[]>([]);
  const [models, setModels] = React.useState<{id:string, name:string, slug:string}[]>([]);
  const [years, setYears] = React.useState<number[]>([]);
  const [versions, setVersions] = React.useState<{id:string, name:string, slug:string}[]>([]);

  const [brand, setBrand] = React.useState('');
  const [model, setModel] = React.useState('');
  const [year, setYear] = React.useState('');
  const [version, setVersion] = React.useState('');

  const [loading, setLoading] = React.useState(false);

  // Rim state
  const [rimOnly, setRimOnly] = React.useState('');

  React.useEffect(() => {
    let active = true;
    async function loadBrands() {
      if (mode === 'vehicle' && brands.length === 0) {
        setLoading(true);
        try {
          const data = await getVehicleBrandsAction();
          if (active) {
            setBrands(data);
          }
        } finally {
          if (active) setLoading(false);
        }
      }
    }
    loadBrands();
    return () => { active = false; };
  }, [mode, brands.length]);

  const handleBrandChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setBrand(val);
    // Reset dependents
    setModel(''); setYear(''); setVersion('');
    setModels([]); setYears([]); setVersions([]);
    
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
    // Reset dependents
    setYear(''); setVersion('');
    setYears([]); setVersions([]);

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
    // Reset dependents
    setVersion('');
    setVersions([]);

    if (val && model) {
      setLoading(true);
      const data = await getVehicleVersionsAction(model, parseInt(val));
      setVersions(data);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (mode === 'measure' && width && profile && rimMeasure) {
      router.push(`/pneus/${width}-${profile}-r${rimMeasure}`);
    } else if (mode === 'rim' && rimOnly) {
      router.push(`/pneus/aro-${rimOnly}`);
    } else if (mode === 'vehicle' && brand && model && year && version) {
      const selectedBrand = brands.find(b => b.id === brand);
      const selectedModel = models.find(m => m.id === model);
      const selectedVersion = versions.find(v => v.id === version);
      
      if (selectedBrand && selectedModel && selectedVersion) {
        router.push(`/pneus/veiculo/${selectedBrand.slug}/${selectedModel.slug}/${year}/${selectedVersion.slug}`);
      }
    } else {
      router.push('/pneus');
    }
  }

  return (
    <div className="bg-card rounded-xl shadow-lg border p-6 md:p-8">
      {/* Tabs */}
      <div className="flex gap-4 border-b pb-4 mb-6 overflow-x-auto">
        <button 
          onClick={() => setMode('measure')}
          className={`font-semibold pb-4 -mb-[18px] whitespace-nowrap transition-colors ${mode === 'measure' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Por Medida
        </button>
        <button 
          onClick={() => setMode('vehicle')}
          className={`font-semibold pb-4 -mb-[18px] whitespace-nowrap transition-colors ${mode === 'vehicle' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Por Veículo
        </button>
        <button 
          onClick={() => setMode('rim')}
          className={`font-semibold pb-4 -mb-[18px] whitespace-nowrap transition-colors ${mode === 'rim' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Por Aro
        </button>
      </div>
      
      {/* Search Forms */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
        {mode === 'measure' && (
          <>
            <div className="space-y-2 lg:col-span-1 md:col-span-1">
              <label htmlFor="width-select" className="text-sm font-medium">Largura</label>
              <Select id="width-select" value={width} onChange={(e) => setWidth(e.target.value)}>
                <option value="">Selecione...</option>
                <option value="175">175</option>
                <option value="185">185</option>
                <option value="195">195</option>
                <option value="205">205</option>
                <option value="215">215</option>
                <option value="225">225</option>
                <option value="235">235</option>
                <option value="245">245</option>
                <option value="265">265</option>
                <option value="285">285</option>
              </Select>
            </div>
            <div className="space-y-2 lg:col-span-1 md:col-span-1">
              <label htmlFor="profile-select" className="text-sm font-medium">Perfil</label>
              <Select id="profile-select" value={profile} onChange={(e) => setProfile(e.target.value)}>
                <option value="">Selecione...</option>
                <option value="35">35</option>
                <option value="40">40</option>
                <option value="45">45</option>
                <option value="50">50</option>
                <option value="55">55</option>
                <option value="60">60</option>
                <option value="65">65</option>
                <option value="70">70</option>
                <option value="75">75</option>
              </Select>
            </div>
            <div className="space-y-2 lg:col-span-1 md:col-span-1">
              <label htmlFor="rim-select" className="text-sm font-medium">Aro</label>
              <Select id="rim-select" value={rimMeasure} onChange={(e) => setRimMeasure(e.target.value)}>
                <option value="">Selecione...</option>
                <option value="13">13</option>
                <option value="14">14</option>
                <option value="15">15</option>
                <option value="16">16</option>
                <option value="17">17</option>
                <option value="18">18</option>
                <option value="19">19</option>
              </Select>
            </div>
            <div className="lg:col-span-2 md:col-span-1 hidden lg:block"></div>
            <Button onClick={handleSearch} className="w-full h-10 text-base lg:col-span-5 md:col-span-4" size="lg">
              Buscar Pneus
            </Button>
          </>
        )}

        {mode === 'vehicle' && (
          <>
            <div className="space-y-2">
              <label htmlFor="brand-select" className="text-sm font-medium">Marca</label>
              <Select id="brand-select" value={brand} onChange={handleBrandChange} disabled={loading && brands.length === 0}>
                <option value="">{loading && brands.length === 0 ? 'Carregando...' : 'Selecione a Marca...'}</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="model-select" className="text-sm font-medium">Modelo</label>
              <Select id="model-select" value={model} onChange={handleModelChange} disabled={!brand || loading}>
                <option value="">Selecione o Modelo...</option>
                {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="year-select" className="text-sm font-medium">Ano</label>
              <Select id="year-select" value={year} onChange={handleYearChange} disabled={!model || loading}>
                <option value="">Selecione o Ano...</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="version-select" className="text-sm font-medium">Versão</label>
              <Select id="version-select" value={version} onChange={(e) => setVersion(e.target.value)} disabled={!year || loading}>
                <option value="">Selecione a Versão...</option>
                {versions.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
              </Select>
            </div>
            <Button 
              onClick={handleSearch} 
              className="w-full h-10 text-base" 
              size="lg"
              disabled={!brand || !model || !year || !version || loading}
            >
              Buscar Pneus
            </Button>
          </>
        )}

        {mode === 'rim' && (
          <>
            <div className="col-span-1 md:col-span-3 space-y-2">
              <label htmlFor="rim-only-select" className="text-sm font-medium">Selecione o tamanho do aro</label>
              <Select id="rim-only-select" value={rimOnly} onChange={(e) => setRimOnly(e.target.value)}>
                <option value="">Selecione...</option>
                <option value="13">Aro 13</option>
                <option value="14">Aro 14</option>
                <option value="15">Aro 15</option>
                <option value="16">Aro 16</option>
                <option value="17">Aro 17</option>
                <option value="18">Aro 18</option>
                <option value="19">Aro 19</option>
                <option value="20">Aro 20</option>
              </Select>
            </div>
            <Button onClick={handleSearch} className="w-full h-10 text-base md:col-span-1" size="lg">
              Buscar
            </Button>
          </>
        )}
      </div>

      {mode === 'measure' && (
        <p className="text-xs text-muted-foreground mt-4 italic">
          * Exemplo de medida: 205 / 55 R16
        </p>
      )}
    </div>
  )
}
