'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Truck } from 'lucide-react';

export function ShippingCalculator() {
  const [zip, setZip] = useState('');
  const [result, setResult] = useState<{name: string; days: string; price: number}[] | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const cleanZip = zip.replace(/\D/g, '');
    if (cleanZip.length !== 8) {
      setError('Informe um CEP válido com 8 dígitos.');
      setResult(null);
      return;
    }
    
    setError('');
    // Mock shipping response
    setResult([
      { name: 'Entrega Padrão', days: '5 a 8 dias úteis', price: 29.90 },
      { name: 'Entrega Expressa', days: '2 a 4 dias úteis', price: 49.90 }
    ]);
  };

  return (
    <div className="bg-muted/30 rounded-xl p-5 border border-muted">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-bold text-foreground">Calcule o frete e prazo</h3>
      </div>
      
      <div className="flex gap-2">
        <input 
          type="text"
          placeholder="00000-000"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          className="flex-1 h-10 px-3 rounded-md border border-input bg-background text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          maxLength={9}
        />
        <Button onClick={handleCalculate} variant="secondary" className="font-bold">
          CALCULAR
        </Button>
      </div>
      
      {error && (
        <p className="text-destructive text-sm font-medium mt-2">{error}</p>
      )}

      {result && (
        <div className="mt-4 space-y-3">
          {result.map((opt, i) => (
            <div key={i} className="flex justify-between items-center text-sm p-3 bg-background border border-muted rounded-lg">
              <div>
                <div className="font-bold text-foreground">{opt.name}</div>
                <div className="text-muted-foreground">{opt.days}</div>
              </div>
              <div className="font-black text-primary">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(opt.price)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
