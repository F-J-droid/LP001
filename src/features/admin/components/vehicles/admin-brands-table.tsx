"use client"

import { VehicleBrand } from "@/features/vehicles/types";

export function AdminBrandsTable({ brands }: { brands: VehicleBrand[] }) {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h3 className="font-bold text-lg">Marcas Cadastradas</h3>
        <button className="bg-primary text-white px-4 py-2 rounded-md font-bold text-sm">
          Nova Marca
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Nome da Marca</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {brands.map(brand => (
              <tr key={brand.id} className="border-b">
                <td className="px-4 py-3 font-medium">{brand.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{brand.slug}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${brand.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {brand.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button className="text-blue-600 hover:underline">Editar</button>
                  <button className="text-red-600 hover:underline">Arquivar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
