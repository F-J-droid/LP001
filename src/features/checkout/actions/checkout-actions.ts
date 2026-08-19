'use server';

import { ServerCheckoutService, ServerCheckoutInput, ServerCheckoutResult } from '../services/server-checkout-service';

export async function processCheckoutAction(input: ServerCheckoutInput): Promise<ServerCheckoutResult> {
  // Pass the payload directly to the service
  // Server action boundary protects internal execution
  return await ServerCheckoutService.processCheckout(input);
}
