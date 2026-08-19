import { TireProduct, TireBrand, TireCategory } from '../types';

function createMockProduct(
  id: string, brand: string, model: string, width: number, profile: number, rim: number, 
  category: TireProduct['vehicleType'], price: number, badges: TireProduct['badges'], 
  stock: TireProduct['stockStatus'], imgCategory: string, rating: number
): TireProduct {
  const pixDiscount = 0.10; // 10% discount
  const basePrice = price;
  const pixPrice = basePrice * (1 - pixDiscount);
  const isOffer = badges?.includes('Oferta');
  const promPrice = isOffer ? basePrice * 0.95 : undefined;
  
  // Mocks for PDP
  const descriptions: Record<string, string> = {
    'Passeio': 'Pneu desenvolvido para uso urbano e rodoviário, priorizando conforto acústico, economia de combustível e excelente dirigibilidade em pisos secos e molhados.',
    'SUV': 'Pneu robusto projetado para SUVs, oferecendo alta durabilidade, estabilidade direcional e conforto superior para viagens em família.',
    'Pickup': 'Pneu de alta resistência projetado para picapes e veículos de carga leve. Suporta carga pesada mantendo aderência e segurança.',
    '4x4': 'Pneu All-Terrain de alta performance, ideal para uso misto (asfalto e terra). Possui blocos de ombro reforçados para tração off-road agressiva.',
    'Performance': 'Pneu UHP (Ultra High Performance) projetado para carros esportivos. Oferece máxima aderência em altas velocidades e frenagem otimizada.',
    'Utilitário': 'Pneu voltado para veículos comerciais leves, priorizando quilometragem, resistência a impactos e custo-benefício para frota.'
  };

  const eans = ['7891234567890', '7890987654321', '7891112223334', '7894445556667'];
  const ean = eans[Math.floor(Math.random() * eans.length)];
  
  const inmetros = ['001234/2012', '009876/2015', '004567/2018', '002233/2020'];
  const inmetroCode = inmetros[Math.floor(Math.random() * inmetros.length)];

  const efficiencies = ['A', 'B', 'C', 'D', 'E'] as const;
  const efficiency = efficiencies[Math.floor(Math.random() * efficiencies.length)];
  const wetGrip = efficiencies[Math.floor(Math.random() * efficiencies.length)];
  const externalNoiseDb = Math.floor(Math.random() * 8) + 68; // 68 to 75
  
  const stockQuantity = stock === 'available' ? Math.floor(Math.random() * 20) + 2 : 0;
  
  const imgPath = `/images/products/tire-${imgCategory}.webp`;
  
  // We use the same image multiple times for the gallery mock
  const gallery = [
    imgPath,
    imgPath,
    imgPath,
    imgPath
  ];
  
  return {
    id,
    slug: `${brand.toLowerCase()}-${model.toLowerCase().replace(/\s+/g, '-')}-${width}-${profile}-r${rim}`,
    sku: `${brand.substring(0,3).toUpperCase()}-${model.substring(0,3).toUpperCase()}-${width}${profile}${rim}`,
    brand,
    model,
    width,
    profile,
    rim,
    loadIndex: "91",
    speedIndex: "V",
    vehicleType: category,
    runFlat: false,
    reinforced: category === 'Pickup' || category === '4x4',
    price: basePrice,
    promotionalPrice: promPrice,
    pixPrice: promPrice ? promPrice * (1 - pixDiscount) : pixPrice,
    installmentCount: 10,
    installmentValue: (promPrice || basePrice) / 10,
    stockStatus: stock,
    rating,
    reviewCount: Math.floor(Math.random() * 300) + 10,
    imageUrl: imgPath,
    gallery,
    badges,
    freeShipping: price > 500,
    description: descriptions[category],
    warrantyMonths: 60,
    ean,
    inmetroCode,
    efficiency,
    wetGrip,
    externalNoiseDb,
    stockQuantity
  };
}

export const MOCK_PRODUCTS: TireProduct[] = [
  // Passeio
  createMockProduct("p1", "Michelin", "Primacy 4+", 205, 55, 16, "Passeio", 549.90, ["Oferta", "Mais vendido"], "available", "touring", 4.8),
  createMockProduct("p2", "Pirelli", "Cinturato P7", 225, 45, 17, "Passeio", 689.90, [], "available", "touring", 4.6),
  createMockProduct("p3", "Continental", "PowerContact 2", 175, 65, 14, "Passeio", 389.90, [], "out_of_stock", "touring", 4.7),
  createMockProduct("p4", "Bridgestone", "Turanza T005", 215, 50, 17, "Passeio", 729.90, ["Melhor avaliado"], "available", "touring", 4.9),
  createMockProduct("p5", "Goodyear", "EfficientGrip Performance", 195, 55, 15, "Passeio", 459.90, [], "available", "touring", 4.5),
  createMockProduct("p6", "Hankook", "Kinergy Eco 2", 185, 65, 15, "Passeio", 399.90, ["Oferta"], "available", "touring", 4.4),
  createMockProduct("p7", "Dunlop", "SP Touring R1", 175, 70, 13, "Passeio", 299.90, ["Mais vendido"], "available", "touring", 4.6),
  createMockProduct("p8", "Firestone", "F-Series", 195, 60, 15, "Passeio", 359.90, [], "available", "touring", 4.3),
  
  // SUV
  createMockProduct("s1", "Michelin", "Primacy SUV", 215, 60, 17, "SUV", 849.90, ["Mais vendido"], "available", "suv", 4.9),
  createMockProduct("s2", "Pirelli", "Scorpion Verde", 225, 55, 18, "SUV", 929.90, [], "available", "suv", 4.7),
  createMockProduct("s3", "Continental", "CrossContact", 235, 55, 18, "SUV", 989.90, ["Oferta"], "available", "suv", 4.8),
  createMockProduct("s4", "Bridgestone", "Alenza", 245, 45, 18, "SUV", 1129.90, [], "available", "suv", 4.6),
  createMockProduct("s5", "Goodyear", "Wrangler SUV", 265, 60, 18, "SUV", 1059.90, ["Lançamento"], "available", "suv", 4.5),
  createMockProduct("s6", "Hankook", "Dynapro HP2", 215, 65, 16, "SUV", 749.90, [], "available", "suv", 4.4),
  
  // Pickup & 4x4
  createMockProduct("pk1", "BFGoodrich", "All-Terrain T/A KO2", 285, 75, 16, "4x4", 1849.90, ["Melhor avaliado"], "available", "4x4", 4.9),
  createMockProduct("pk2", "Goodyear", "Wrangler AT Adventure", 265, 70, 16, "Pickup", 999.90, ["Lançamento", "Oferta"], "available", "pickup", 4.8),
  createMockProduct("pk3", "Michelin", "LTX Force", 265, 65, 17, "Pickup", 1199.90, [], "available", "pickup", 4.7),
  createMockProduct("pk4", "Pirelli", "Scorpion ATR", 205, 60, 15, "Pickup", 649.90, ["Mais vendido"], "available", "pickup", 4.6),
  createMockProduct("pk5", "Bridgestone", "Dueler A/T", 235, 75, 15, "4x4", 899.90, [], "available", "4x4", 4.7),
  createMockProduct("pk6", "Continental", "CrossContact ATR", 265, 60, 18, "Pickup", 1299.90, [], "out_of_stock", "pickup", 4.8),

  // Performance
  createMockProduct("pf1", "Michelin", "Pilot Sport 5", 225, 40, 18, "Performance", 1129.90, ["Oferta", "Lançamento"], "available", "performance", 5.0),
  createMockProduct("pf2", "Pirelli", "P Zero", 245, 35, 19, "Performance", 1459.90, ["Melhor avaliado"], "available", "performance", 4.9),
  createMockProduct("pf3", "Continental", "SportContact 7", 235, 35, 19, "Performance", 1389.90, [], "available", "performance", 4.8),
  createMockProduct("pf4", "Bridgestone", "Potenza Sport", 225, 45, 17, "Performance", 999.90, [], "available", "performance", 4.7),
  
  // Utilitário
  createMockProduct("ut1", "Michelin", "Agilis 3", 205, 75, 16, "Utilitário", 899.90, ["Mais vendido"], "available", "suv", 4.8),
  createMockProduct("ut2", "Pirelli", "Chronos", 195, 70, 15, "Utilitário", 729.90, [], "available", "suv", 4.6),
  createMockProduct("ut3", "Goodyear", "Cargo Marathon 2", 205, 70, 15, "Utilitário", 689.90, ["Oferta"], "available", "suv", 4.5),
  createMockProduct("ut4", "Continental", "Vanco 2", 225, 75, 16, "Utilitário", 949.90, [], "available", "suv", 4.7),
];

export const MOCK_BRANDS: TireBrand[] = [
  { id: 'b1', name: 'Michelin', slug: 'michelin', isActive: true },
  { id: 'b2', name: 'Pirelli', slug: 'pirelli', isActive: true },
  { id: 'b3', name: 'Continental', slug: 'continental', isActive: true },
  { id: 'b4', name: 'Bridgestone', slug: 'bridgestone', isActive: true },
  { id: 'b5', name: 'Goodyear', slug: 'goodyear', isActive: true },
  { id: 'b6', name: 'Hankook', slug: 'hankook', isActive: true },
  { id: 'b7', name: 'Dunlop', slug: 'dunlop', isActive: true },
  { id: 'b8', name: 'Firestone', slug: 'firestone', isActive: true },
  { id: 'b9', name: 'BFGoodrich', slug: 'bfgoodrich', isActive: true },
];

export const MOCK_CATEGORIES: TireCategory[] = [
  { id: 'c1', name: 'Passeio', slug: 'passeio', isActive: true },
  { id: 'c2', name: 'SUV', slug: 'suv', isActive: true },
  { id: 'c3', name: 'Pickup', slug: 'pickup', isActive: true },
  { id: 'c4', name: 'Utilitário', slug: 'utilitario', isActive: true },
  { id: 'c5', name: '4x4', slug: '4x4', isActive: true },
  { id: 'c6', name: 'Performance', slug: 'performance', isActive: true },
];
