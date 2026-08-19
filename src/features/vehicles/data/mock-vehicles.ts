import { VehicleBrand, VehicleModel, VehicleVersion, VehicleFitment, TireSize } from '../types';

// MOCK DATA - Source: Development (Not officially homologated, for architecture testing only)
export const MOCK_TIRE_SIZES: TireSize[] = [
  { id: '205-55-16', width: 205, profile: 55, rim: 16 },
  { id: '225-45-17', width: 225, profile: 45, rim: 17 },
  { id: '175-65-14', width: 175, profile: 65, rim: 14 },
  { id: '215-50-17', width: 215, profile: 50, rim: 17 },
  { id: '195-55-15', width: 195, profile: 55, rim: 15 },
  { id: '185-65-15', width: 185, profile: 65, rim: 15 },
  { id: '175-70-13', width: 175, profile: 70, rim: 13 },
  { id: '195-60-15', width: 195, profile: 60, rim: 15 },
  { id: '215-60-17', width: 215, profile: 60, rim: 17 },
  { id: '225-55-18', width: 225, profile: 55, rim: 18 },
  { id: '235-55-18', width: 235, profile: 55, rim: 18 },
  { id: '245-45-18', width: 245, profile: 45, rim: 18 },
  { id: '265-60-18', width: 265, profile: 60, rim: 18 },
  { id: '215-65-16', width: 215, profile: 65, rim: 16 },
  { id: '285-75-16', width: 285, profile: 75, rim: 16 },
  { id: '265-70-16', width: 265, profile: 70, rim: 16 },
  { id: '265-65-17', width: 265, profile: 65, rim: 17 },
  { id: '205-60-15', width: 205, profile: 60, rim: 15 },
  { id: '235-75-15', width: 235, profile: 75, rim: 15 },
  { id: '225-40-18', width: 225, profile: 40, rim: 18 },
  { id: '245-35-19', width: 245, profile: 35, rim: 19 },
  { id: '235-35-19', width: 235, profile: 35, rim: 19 },
  { id: '205-75-16', width: 205, profile: 75, rim: 16 },
  { id: '195-70-15', width: 195, profile: 70, rim: 15 },
  { id: '205-70-15', width: 205, profile: 70, rim: 15 },
  { id: '225-75-16', width: 225, profile: 75, rim: 16 },
];

export const MOCK_VEHICLE_BRANDS: VehicleBrand[] = [
  { id: 'vb_chevrolet', name: 'Chevrolet', slug: 'chevrolet', isActive: true },
  { id: 'vb_volkswagen', name: 'Volkswagen', slug: 'volkswagen', isActive: true },
  { id: 'vb_fiat', name: 'Fiat', slug: 'fiat', isActive: true },
  { id: 'vb_toyota', name: 'Toyota', slug: 'toyota', isActive: true },
  { id: 'vb_hyundai', name: 'Hyundai', slug: 'hyundai', isActive: true },
  { id: 'vb_honda', name: 'Honda', slug: 'honda', isActive: true },
  { id: 'vb_renault', name: 'Renault', slug: 'renault', isActive: true },
  { id: 'vb_jeep', name: 'Jeep', slug: 'jeep', isActive: true },
  { id: 'vb_ford', name: 'Ford', slug: 'ford', isActive: true },
  { id: 'vb_nissan', name: 'Nissan', slug: 'nissan', isActive: true },
];

export const MOCK_VEHICLE_MODELS: VehicleModel[] = [
  { id: 'vm_onix', brandId: 'vb_chevrolet', name: 'Onix', slug: 'onix', isActive: true },
  { id: 'vm_tracker', brandId: 'vb_chevrolet', name: 'Tracker', slug: 'tracker', isActive: true },
  { id: 'vm_polo', brandId: 'vb_volkswagen', name: 'Polo', slug: 'polo', isActive: true },
  { id: 'vm_tcross', brandId: 'vb_volkswagen', name: 'T-Cross', slug: 't-cross', isActive: true },
  { id: 'vm_argo', brandId: 'vb_fiat', name: 'Argo', slug: 'argo', isActive: true },
  { id: 'vm_pulse', brandId: 'vb_fiat', name: 'Pulse', slug: 'pulse', isActive: true },
  { id: 'vm_corolla', brandId: 'vb_toyota', name: 'Corolla', slug: 'corolla', isActive: true },
  { id: 'vm_corolla_cross', brandId: 'vb_toyota', name: 'Corolla Cross', slug: 'corolla-cross', isActive: true },
  { id: 'vm_hb20', brandId: 'vb_hyundai', name: 'HB20', slug: 'hb20', isActive: true },
  { id: 'vm_creta', brandId: 'vb_hyundai', name: 'Creta', slug: 'creta', isActive: true },
  { id: 'vm_civic', brandId: 'vb_honda', name: 'Civic', slug: 'civic', isActive: true },
  { id: 'vm_hrv', brandId: 'vb_honda', name: 'HR-V', slug: 'hr-v', isActive: true },
  { id: 'vm_kicks', brandId: 'vb_nissan', name: 'Kicks', slug: 'kicks', isActive: true },
  { id: 'vm_compass', brandId: 'vb_jeep', name: 'Compass', slug: 'compass', isActive: true },
  { id: 'vm_renegade', brandId: 'vb_jeep', name: 'Renegade', slug: 'renegade', isActive: true },
];

export const MOCK_VEHICLE_VERSIONS: VehicleVersion[] = [
  { id: 'vv_onix_1', modelId: 'vm_onix', name: '1.0 Turbo Premier', slug: '1-0-turbo-premier', yearStart: 2020, yearEnd: 2024, isActive: true },
  { id: 'vv_onix_2', modelId: 'vm_onix', name: '1.0 Aspirado LT', slug: '1-0-aspirado-lt', yearStart: 2020, yearEnd: 2024, isActive: true },
  { id: 'vv_tracker_1', modelId: 'vm_tracker', name: '1.2 Turbo Premier', slug: '1-2-turbo-premier', yearStart: 2021, yearEnd: 2024, isActive: true },
  { id: 'vv_polo_1', modelId: 'vm_polo', name: '1.0 TSI Highline', slug: '1-0-tsi-highline', yearStart: 2018, yearEnd: 2024, isActive: true },
  { id: 'vv_tcross_1', modelId: 'vm_tcross', name: '1.4 TSI Highline', slug: '1-4-tsi-highline', yearStart: 2019, yearEnd: 2024, isActive: true },
  { id: 'vv_argo_1', modelId: 'vm_argo', name: '1.0 Drive', slug: '1-0-drive', yearStart: 2018, yearEnd: 2024, isActive: true },
  { id: 'vv_pulse_1', modelId: 'vm_pulse', name: '1.0 Turbo Impetus', slug: '1-0-turbo-impetus', yearStart: 2022, yearEnd: 2024, isActive: true },
  { id: 'vv_corolla_1', modelId: 'vm_corolla', name: '2.0 Altis', slug: '2-0-altis', yearStart: 2020, yearEnd: 2024, isActive: true },
  { id: 'vv_corolla_2', modelId: 'vm_corolla', name: '1.8 Hybrid Altis', slug: '1-8-hybrid-altis', yearStart: 2020, yearEnd: 2024, isActive: true },
  { id: 'vv_corolla_cross_1', modelId: 'vm_corolla_cross', name: '2.0 XRE', slug: '2-0-xre', yearStart: 2022, yearEnd: 2024, isActive: true },
  { id: 'vv_hb20_1', modelId: 'vm_hb20', name: '1.0 TGDI Platinum Plus', slug: '1-0-tgdi-platinum-plus', yearStart: 2020, yearEnd: 2024, isActive: true },
  { id: 'vv_creta_1', modelId: 'vm_creta', name: '2.0 Ultimate', slug: '2-0-ultimate', yearStart: 2022, yearEnd: 2024, isActive: true },
  { id: 'vv_civic_1', modelId: 'vm_civic', name: '2.0 Touring', slug: '2-0-touring', yearStart: 2017, yearEnd: 2021, isActive: true },
  { id: 'vv_hrv_1', modelId: 'vm_hrv', name: '1.5 Turbo Touring', slug: '1-5-turbo-touring', yearStart: 2023, yearEnd: 2024, isActive: true },
  { id: 'vv_kicks_1', modelId: 'vm_kicks', name: '1.6 Exclusive', slug: '1-6-exclusive', yearStart: 2021, yearEnd: 2024, isActive: true },
  { id: 'vv_compass_1', modelId: 'vm_compass', name: '1.3 Turbo Limited', slug: '1-3-turbo-limited', yearStart: 2022, yearEnd: 2024, isActive: true },
  { id: 'vv_renegade_1', modelId: 'vm_renegade', name: '1.3 Turbo Trailhawk', slug: '1-3-turbo-trailhawk', yearStart: 2022, yearEnd: 2024, isActive: true },
  { id: 'vv_corolla_staggered', modelId: 'vm_corolla', name: 'Sport Custom (Staggered)', slug: 'sport-custom-staggered', yearStart: 2023, yearEnd: 2024, isActive: true }, // For testing front/rear
];

export const MOCK_VEHICLE_FITMENTS: VehicleFitment[] = [
  // Onix
  { id: 'f_onix_1', vehicleVersionId: 'vv_onix_1', tireSizeId: '205-55-16', position: 'all' },
  { id: 'f_onix_2', vehicleVersionId: 'vv_onix_2', tireSizeId: '185-65-15', position: 'all' },
  // Tracker
  { id: 'f_tracker_1', vehicleVersionId: 'vv_tracker_1', tireSizeId: '215-55-17', position: 'all' }, // NOTE: 215-55-17 is not in mock sizes, but we'll pretend or add it later
  // Polo
  { id: 'f_polo_1', vehicleVersionId: 'vv_polo_1', tireSizeId: '205-55-16', position: 'all' },
  // T-Cross
  { id: 'f_tcross_1', vehicleVersionId: 'vv_tcross_1', tireSizeId: '205-55-17', position: 'all' }, // Needs 205-55-17
  // Argo
  { id: 'f_argo_1', vehicleVersionId: 'vv_argo_1', tireSizeId: '175-65-14', position: 'all' },
  // Pulse
  { id: 'f_pulse_1', vehicleVersionId: 'vv_pulse_1', tireSizeId: '195-60-15', position: 'all' },
  { id: 'f_pulse_2', vehicleVersionId: 'vv_pulse_1', tireSizeId: '205-60-16', position: 'all' }, // Alternative
  // Corolla
  { id: 'f_corolla_1', vehicleVersionId: 'vv_corolla_1', tireSizeId: '225-45-17', position: 'all' },
  { id: 'f_corolla_2', vehicleVersionId: 'vv_corolla_2', tireSizeId: '225-45-17', position: 'all' },
  // Corolla Cross
  { id: 'f_ccross_1', vehicleVersionId: 'vv_corolla_cross_1', tireSizeId: '225-50-18', position: 'all' },
  // HB20
  { id: 'f_hb20_1', vehicleVersionId: 'vv_hb20_1', tireSizeId: '195-55-15', position: 'all' },
  // Creta
  { id: 'f_creta_1', vehicleVersionId: 'vv_creta_1', tireSizeId: '215-60-17', position: 'all' },
  // Civic
  { id: 'f_civic_1', vehicleVersionId: 'vv_civic_1', tireSizeId: '215-50-17', position: 'all' },
  // HR-V
  { id: 'f_hrv_1', vehicleVersionId: 'vv_hrv_1', tireSizeId: '215-60-17', position: 'all' },
  // Kicks
  { id: 'f_kicks_1', vehicleVersionId: 'vv_kicks_1', tireSizeId: '205-55-17', position: 'all' },
  // Compass
  { id: 'f_compass_1', vehicleVersionId: 'vv_compass_1', tireSizeId: '225-55-18', position: 'all' },
  // Renegade
  { id: 'f_renegade_1', vehicleVersionId: 'vv_renegade_1', tireSizeId: '215-60-17', position: 'all' },
  // Staggered test
  { id: 'f_corolla_stag_f', vehicleVersionId: 'vv_corolla_staggered', tireSizeId: '225-40-18', position: 'front' },
  { id: 'f_corolla_stag_r', vehicleVersionId: 'vv_corolla_staggered', tireSizeId: '245-35-19', position: 'rear' },
];
