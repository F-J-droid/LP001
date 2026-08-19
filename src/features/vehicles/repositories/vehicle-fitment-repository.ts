import { adminDb } from '@/features/admin/storage/admin-local-db';
import { VehicleBrand, VehicleModel, VehicleVersion, VehicleFitment, TireSize } from '../types';

export interface VehicleFitmentRepository {
  getBrands(): Promise<VehicleBrand[]>;
  getModelsByBrand(brandId: string): Promise<VehicleModel[]>;
  getYearsByModel(modelId: string): Promise<number[]>;
  getVersionsByModelAndYear(modelId: string, year: number): Promise<VehicleVersion[]>;
  getFitmentsByVehicleVersion(versionId: string): Promise<VehicleFitment[]>;
  getVehicleByVersionId(versionId: string): Promise<{ brand: VehicleBrand; model: VehicleModel; version: VehicleVersion } | null>;
  getTireSizeById(tireSizeId: string): Promise<TireSize | null>;
  getBrandBySlug(slug: string): Promise<VehicleBrand | null>;
  getModelBySlug(brandId: string, slug: string): Promise<VehicleModel | null>;
  getVersionBySlug(modelId: string, year: number, slug: string): Promise<VehicleVersion | null>;
}

export class MockVehicleFitmentRepository implements VehicleFitmentRepository {
  async getBrands(): Promise<VehicleBrand[]> {
    const db = await adminDb.getDb();
    return (db.vehicleBrands || []).filter(b => b.isActive).sort((a, b) => a.name.localeCompare(b.name));
  }

  async getModelsByBrand(brandId: string): Promise<VehicleModel[]> {
    const db = await adminDb.getDb();
    return (db.vehicleModels || [])
      .filter(m => m.brandId === brandId && m.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getYearsByModel(modelId: string): Promise<number[]> {
    const db = await adminDb.getDb();
    const versions = (db.vehicleVersions || []).filter(v => v.modelId === modelId && v.isActive);
    const years = new Set<number>();
    
    versions.forEach(v => {
      for (let y = v.yearStart; y <= v.yearEnd; y++) {
        years.add(y);
      }
    });

    return Array.from(years).sort((a, b) => b - a); // Descending order
  }

  async getVersionsByModelAndYear(modelId: string, year: number): Promise<VehicleVersion[]> {
    const db = await adminDb.getDb();
    return (db.vehicleVersions || [])
      .filter(v => v.modelId === modelId && year >= v.yearStart && year <= v.yearEnd && v.isActive)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getFitmentsByVehicleVersion(versionId: string): Promise<VehicleFitment[]> {
    const db = await adminDb.getDb();
    return (db.vehicleFitments || []).filter(f => f.vehicleVersionId === versionId);
  }

  async getVehicleByVersionId(versionId: string) {
    const db = await adminDb.getDb();
    const version = (db.vehicleVersions || []).find(v => v.id === versionId);
    if (!version) return null;

    const model = (db.vehicleModels || []).find(m => m.id === version.modelId);
    if (!model) return null;

    const brand = (db.vehicleBrands || []).find(b => b.id === model.brandId);
    if (!brand) return null;

    return { brand, model, version };
  }

  async getTireSizeById(tireSizeId: string): Promise<TireSize | null> {
    const db = await adminDb.getDb();
    return (db.sizes || []).find(s => s.id === tireSizeId) || null;
  }

  async getBrandBySlug(slug: string): Promise<VehicleBrand | null> {
    const db = await adminDb.getDb();
    return (db.vehicleBrands || []).find(b => b.slug === slug && b.isActive) || null;
  }

  async getModelBySlug(brandId: string, slug: string): Promise<VehicleModel | null> {
    const db = await adminDb.getDb();
    return (db.vehicleModels || []).find(m => m.brandId === brandId && m.slug === slug && m.isActive) || null;
  }

  async getVersionBySlug(modelId: string, year: number, slug: string): Promise<VehicleVersion | null> {
    const db = await adminDb.getDb();
    return (db.vehicleVersions || []).find(v => 
      v.modelId === modelId && 
      v.slug === slug && 
      year >= v.yearStart && 
      year <= v.yearEnd && 
      v.isActive
    ) || null;
  }
}

export const vehicleFitmentRepository = new MockVehicleFitmentRepository();
