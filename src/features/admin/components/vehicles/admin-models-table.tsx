"use client"

import { VehicleModel, VehicleBrand } from "@/features/vehicles/types";

export function AdminModelsTable({ models, brands }: { models: VehicleModel[], brands: VehicleBrand[] }) {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h3 className="font-bold text-lg">Modelos Cadastrados</h3>
        <button className="bg-primary text-white px-4 py-2 rounded-md font-bold text-sm">
          Novo Modelo
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Marca</th>
              <th className="px-4 py-3">Modelo</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {models.map(model => {
              const brand = brands.find(b => b.id === model.brandId);
              return (
                <tr key={model.id} className="border-b">
                  <td className="px-4 py-3 text-muted-foreground">{brand?.name || 'Desconhecida'}</td>
                  <td className="px-4 py-3 font-medium">{model.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{model.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${model.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {model.isActive ? 'Ativo' : 'Inativo'}
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
