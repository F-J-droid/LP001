"use client"

import { VehicleFitment, VehicleVersion, VehicleModel, VehicleBrand, TireSize } from "@/features/vehicles/types";

export function AdminFitmentsTable({
  fitments,
  versions,
  models,
  brands,
  tireSizes
}: {
  fitments: VehicleFitment[];
  versions: VehicleVersion[];
  models: VehicleModel[];
  brands: VehicleBrand[];
  tireSizes: TireSize[];
}) {
  return (
    <div>
      <div className="flex justify-between mb-4">
        <h3 className="font-bold text-lg">Fitments Cadastrados</h3>
        <button className="bg-primary text-white px-4 py-2 rounded-md font-bold text-sm">
          Novo Fitment
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-4 py-3">Veículo (Marca / Modelo / Versão)</th>
              <th className="px-4 py-3">Medida (Tire Size)</th>
              <th className="px-4 py-3">Posição</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {fitments.map(fitment => {
              const version = versions.find(v => v.id === fitment.vehicleVersionId);
              const model = version ? models.find(m => m.id === version.modelId) : null;
              const brand = model ? brands.find(b => b.id === model.brandId) : null;
              const tireSize = tireSizes.find(t => t.id === fitment.tireSizeId);
              
              const vehicleName = brand && model && version 
                ? `${brand.name} ${model.name} ${version.name} (${version.yearStart}-${version.yearEnd})`
                : 'Veículo Desconhecido';
                
              const sizeName = tireSize 
                ? `${tireSize.width}/${tireSize.profile} R${tireSize.rim}`
                : 'Medida Desconhecida';

              return (
                <tr key={fitment.id} className="border-b">
                  <td className="px-4 py-3 font-medium">{vehicleName}</td>
                  <td className="px-4 py-3 font-bold">{sizeName}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      fitment.position === 'all' ? 'bg-gray-100 text-gray-800' :
                      fitment.position === 'front' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {fitment.position}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button className="text-blue-600 hover:underline">Editar</button>
                    <button className="text-red-600 hover:underline">Remover</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {fitments.length === 0 && (
          <p className="text-center py-4 text-muted-foreground">Nenhum fitment cadastrado.</p>
        )}
      </div>
    </div>
  )
}
