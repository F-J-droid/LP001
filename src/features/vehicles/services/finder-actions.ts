'use server';

import { vehicleFitmentRepository } from '../repositories/vehicle-fitment-repository';

export async function getVehicleBrandsAction() {
  return await vehicleFitmentRepository.getBrands();
}

export async function getVehicleModelsAction(brandId: string) {
  if (!brandId) return [];
  return await vehicleFitmentRepository.getModelsByBrand(brandId);
}

export async function getVehicleYearsAction(modelId: string) {
  if (!modelId) return [];
  return await vehicleFitmentRepository.getYearsByModel(modelId);
}

export async function getVehicleVersionsAction(modelId: string, year: number) {
  if (!modelId || !year) return [];
  return await vehicleFitmentRepository.getVersionsByModelAndYear(modelId, year);
}
