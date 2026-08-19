import { vehicleFitmentRepository } from '../repositories/vehicle-fitment-repository';
import { productRepository } from '@/features/products/repositories/supabase-product-repository';
import { TireProduct } from '@/features/products/types';
import { TireSize, VehicleFitment } from '../types';

export interface CompatibilityResult {
  vehicle: Awaited<ReturnType<typeof vehicleFitmentRepository.getVehicleByVersionId>>;
  fitments: {
    fitment: VehicleFitment;
    tireSize: TireSize;
    products: TireProduct[];
  }[];
}

export class VehicleProductCompatibilityService {
  /**
   * Retrieves all compatible products for a given vehicle version, grouped by fitment.
   */
  async getCompatibleProducts(versionId: string): Promise<CompatibilityResult | null> {
    const vehicle = await vehicleFitmentRepository.getVehicleByVersionId(versionId);
    if (!vehicle) return null;

    const fitments = await vehicleFitmentRepository.getFitmentsByVehicleVersion(versionId);
    if (fitments.length === 0) {
      return { vehicle, fitments: [] };
    }

    const fitmentResults: CompatibilityResult['fitments'] = [];

    for (const fitment of fitments) {
      const tireSize = await vehicleFitmentRepository.getTireSizeById(fitment.tireSizeId);
      if (!tireSize) continue;

      // Find products that match this size exactly
      // We use the searchProducts from ProductRepository which we can simulate by getting all active products
      // or we can use our own filtering if ProductRepository doesn't support exact width/profile/rim simultaneously
      
      // Let's use searchProducts with parameters
      const searchResult = await productRepository.searchProducts({
        width: tireSize.width,
        profile: tireSize.profile,
        rim: tireSize.rim
      }, 'relevance', 1, 100);

      fitmentResults.push({
        fitment,
        tireSize,
        products: searchResult.data
      });
    }

    return {
      vehicle,
      fitments: fitmentResults
    };
  }

  /**
   * Checks if a specific product is compatible with a given vehicle version.
   * Returns: 'compatible' | 'incompatible' | 'unknown'
   */
  async checkCompatibility(productId: string, versionId: string): Promise<'compatible' | 'incompatible' | 'unknown'> {
    try {
      const product = await productRepository.getProductBySlug(productId); // Actually we might need getProductById, wait, product-repository has getProductBySlug.
      // Wait, let's just get all products and find it.
      const allProducts = await productRepository.getAllProducts(1, 1000);
      const targetProduct = allProducts.data.find(p => p.id === productId || p.slug === productId);

      if (!targetProduct) return 'unknown';

      const fitments = await vehicleFitmentRepository.getFitmentsByVehicleVersion(versionId);
      if (fitments.length === 0) return 'unknown';

      for (const fitment of fitments) {
        const tireSize = await vehicleFitmentRepository.getTireSizeById(fitment.tireSizeId);
        if (tireSize) {
          if (
            targetProduct.width === tireSize.width &&
            targetProduct.profile === tireSize.profile &&
            targetProduct.rim === tireSize.rim
          ) {
            return 'compatible';
          }
        }
      }

      return 'incompatible';
    } catch (error) {
      return 'unknown';
    }
  }
}

export const vehicleCompatibilityService = new VehicleProductCompatibilityService();
