import { CheckoutData, CheckoutResult, CheckoutService } from '../types';

export const mockCheckoutService: CheckoutService = {
  async validateCheckout(input: CheckoutData): Promise<CheckoutResult> {
    // Artificial delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Basic validation safety net on the server mock
    if (!input.customer.cpf || !input.address.zipCode || !input.shippingOptionId || !input.paymentMethod) {
      return {
        success: false,
        errorCode: 'VALIDATION_ERROR',
        message: 'Dados incompletos fornecidos ao checkout.'
      };
    }

    // Generate a temporary demonstrative ID
    const simulationId = `SIM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

    // Here a real service would persist the order and integrate with the gateway.
    // For this phase, we just return success with the simulation ID.
    return {
      success: true,
      simulationId
    };
  }
};
