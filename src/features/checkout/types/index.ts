export interface CheckoutCustomer {
  fullName: string;
  email: string;
  cpf: string;
  phone: string;
}

export interface CheckoutAddress {
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedMinDays: number;
  estimatedMaxDays: number;
}

export type PaymentMethodType = 'pix' | 'credit_card';

export interface CheckoutData {
  customer: CheckoutCustomer;
  address: CheckoutAddress;
  shippingOptionId: string;
  paymentMethod: PaymentMethodType;
}

export type CheckoutResult = 
  | { success: true; simulationId: string }
  | { success: false; errorCode: string; message: string };

export interface ShippingService {
  getOptions(zipCode: string, itemsCount: number): Promise<ShippingOption[]>;
}

export interface CheckoutService {
  validateCheckout(input: CheckoutData): Promise<CheckoutResult>;
}
