import { ShippingOption, ShippingService } from '../types';

export const mockShippingService: ShippingService = {
  async getOptions(zipCode: string, itemsCount: number): Promise<ShippingOption[]> {
    // Artificial delay to simulate network
    await new Promise(resolve => setTimeout(resolve, 800));

    const cleanZip = zipCode.replace(/\D/g, '');
    
    // Deterministic logic based on zipCode prefix
    const isSouthOrSoutheast = /^[0-3|8-9]/.test(cleanZip);
    const isNortheast = /^[4-6]/.test(cleanZip);

    let basePriceEco = 35.90;
    let basePriceExp = 65.90;
    let minDaysEco = 7;
    let minDaysExp = 3;

    if (isSouthOrSoutheast) {
      basePriceEco = 24.90;
      basePriceExp = 44.90;
      minDaysEco = 5;
      minDaysExp = 2;
    } else if (isNortheast) {
      basePriceEco = 45.90;
      basePriceExp = 85.90;
      minDaysEco = 10;
      minDaysExp = 5;
    }

    // Adjust price by weight/volume (itemsCount)
    const multiplier = 1 + (itemsCount - 1) * 0.4; // +40% per additional tire

    return [
      {
        id: 'eco',
        name: 'Entrega Econômica',
        description: 'Melhor custo-benefício',
        price: basePriceEco * multiplier,
        estimatedMinDays: minDaysEco,
        estimatedMaxDays: minDaysEco + 3
      },
      {
        id: 'exp',
        name: 'Entrega Expressa',
        description: 'Receba mais rápido',
        price: basePriceExp * multiplier,
        estimatedMinDays: minDaysExp,
        estimatedMaxDays: minDaysExp + 2
      }
    ];
  }
};
