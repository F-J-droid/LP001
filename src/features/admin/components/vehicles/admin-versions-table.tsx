"use client"

import { VehicleVersion, VehicleModel, VehicleBrand } from "@/features/vehicles/types";

export function AdminVersionsTable({ 
  versions, 
  models, 
  brands 
}: { 
  versions: VehicleVersion[], 
  models: VehicleModel[], 
  brands: VehicleBrand[] 
}) {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h3 className="font-bold text-lg">Versões Cadastradas</h3>
        <button className="bg-primary text-white px-4 py-2 rounded-md font-bold text-sm">
          Nova Versão
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Veículo</th>
              <th className="px-4 py-3">Versão</th>
              <th className="px-4 py-3">Anos</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {versions.map(version => {
              const model = models.find(m => m.id === version.modelId);
              const brand = model ? brands.find(b => b.id === model.brandId) : null;
              
              const vehicleName = brand && model ? `${brand.name} ${model.name}` : 'Desconhecido';

              return (
                <tr key={version.id} className="border-b">
                  <td className="px-4 py-3 text-muted-foreground">{vehicleName}</td>
                  <td className="px-4 py-3 font-medium">{version.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{version.yearStart} - {version.yearEnd}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${version.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {version.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button className="text-blue-600 hover:underline">Editar</button>
                    <button className="text-red-600 hover:underline">Arquivar</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
