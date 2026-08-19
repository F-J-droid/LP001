export interface TireSize {
  id: string; // e.g., '205-55-16'
  width: number;
  profile: number;
  rim: number;
}

export interface VehicleBrand {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface VehicleModel {
  id: string;
  brandId: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface VehicleVersion {
  id: string;
  modelId: string;
  name: string;
  slug: string;
  yearStart: number;
  yearEnd: number;
  engine?: string;
  trim?: string;
  bodyType?: string;
  isActive: boolean;
}

export interface VehicleFitment {
  id: string;
  vehicleVersionId: string;
  tireSizeId: string;
  position: 'all' | 'front' | 'rear';
}
