import { describe, it, expect } from 'vitest';
import { mockShippingService } from './mock-shipping-service';
import { mockCheckoutService } from './mock-checkout-service';
import { CheckoutData } from '../types';

describe('Checkout Services', () => {
  describe('MockShippingService', () => {
    it('should return options deterministically based on region', async () => {
      // 0xxxxxxx (SP) -> South/Southeast rule
      const spOptions = await mockShippingService.getOptions('01000-000', 1);
      expect(spOptions[0].price).toBe(24.90);
      expect(spOptions[0].estimatedMinDays).toBe(5);

      // 4xxxxxxx (BA) -> Northeast rule
      const baOptions = await mockShippingService.getOptions('40000-000', 1);
      expect(baOptions[0].price).toBe(45.90);
      expect(baOptions[0].estimatedMinDays).toBe(10);
    });

    it('should scale price with itemsCount', async () => {
      const oneItem = await mockShippingService.getOptions('01000-000', 1); // mult = 1
      const twoItems = await mockShippingService.getOptions('01000-000', 2); // mult = 1.4

      expect(oneItem[0].price).toBe(24.90);
      expect(twoItems[0].price).toBeCloseTo(24.90 * 1.4, 1);
    });
  });

  describe('MockCheckoutService', () => {
    it('should validate and return success simulation id', async () => {
      const validData: CheckoutData = {
        customer: { fullName: 'Test', email: 'test@test.com', cpf: '00000000191', phone: '11999999999' },
        address: { zipCode: '01000000', street: 'Rua', number: '1', neighborhood: 'Bairro', city: 'City', state: 'SP' },
        shippingOptionId: 'eco',
        paymentMethod: 'pix'
      };

      const result = await mockCheckoutService.validateCheckout(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.simulationId).toMatch(/^SIM-/);
      }
    });

    it('should return error if essential data is missing', async () => {
      const invalidData = {
        customer: { fullName: 'Test' } // Incomplete
      } as unknown as CheckoutData;

      const result = await mockCheckoutService.validateCheckout(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorCode).toBe('VALIDATION_ERROR');
      }
    });
  });
});
