import { describe, it, expect, beforeEach } from 'vitest';
import { adminDb } from '@/features/admin/storage/admin-local-db';
import { vehicleFitmentRepository } from '@/features/vehicles/repositories/vehicle-fitment-repository';
import { vehicleCompatibilityService } from '@/features/vehicles/services/vehicle-compatibility-service';

describe('Vehicle Fitment Engine', () => {
  beforeEach(async () => {
    // This will force migration from v1 to v2 or just load v2
    await adminDb.getDb();
  });

  it('should list all available vehicle brands', async () => {
    const brands = await vehicleFitmentRepository.getBrands();
    expect(brands.length).toBeGreaterThan(0);
    expect(brands.find(b => b.slug === 'chevrolet')).toBeDefined();
  });

  it('should resolve models for a given brand', async () => {
    const brand = await vehicleFitmentRepository.getBrandBySlug('volkswagen');
    expect(brand).toBeDefined();
    
    const models = await vehicleFitmentRepository.getModelsByBrand(brand!.id);
    expect(models.length).toBeGreaterThan(0);
    expect(models.find(m => m.slug === 'polo')).toBeDefined();
  });

  it('should find fitments for a specific version', async () => {
    // Find Onix 1.0 Turbo
    const brand = await vehicleFitmentRepository.getBrandBySlug('chevrolet');
    const model = await vehicleFitmentRepository.getModelBySlug(brand!.id, 'onix');
    const version = await vehicleFitmentRepository.getVersionBySlug(model!.id, 2024, '1-0-turbo-premier');
    
    expect(version).toBeDefined();

    const fitments = await vehicleFitmentRepository.getFitmentsByVehicleVersion(version!.id);
    expect(fitments.length).toBeGreaterThan(0);
  });

  it.skip('should determine compatibility accurately', async () => {
    const brand = await vehicleFitmentRepository.getBrandBySlug('chevrolet');
    const model = await vehicleFitmentRepository.getModelBySlug(brand!.id, 'onix');
    const version = await vehicleFitmentRepository.getVersionBySlug(model!.id, 2024, '1-0-turbo-premier');
    
    // Check compatibility with a known product
    // The Onix 1.0 Turbo has fitment '205-55-16' which corresponds to width: 205, profile: 55, rim: 16
    // In our mock products, p1 is a Primacy 4+ 205/55 R16
    const compatibility = await vehicleCompatibilityService.checkCompatibility('p1', version!.id);
    expect(compatibility).toBe('compatible');
    
    // p2 is 225/45 R17
    const incCompatibility = await vehicleCompatibilityService.checkCompatibility('p2', version!.id);
    expect(incCompatibility).toBe('incompatible');
  });
});
