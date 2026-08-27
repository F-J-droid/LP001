import 'server-only';

export interface AsaasCustomerInput {
  name: string;
  email: string;
  phone?: string;
  cpfCnpj?: string;
  notificationDisabled?: boolean;
}

export interface AsaasPixChargeInput {
  customerId: string;
  value: number;
  dueDate: string;
  description?: string;
  externalReference?: string;
}

export interface AsaasCreditCardInput {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

export interface AsaasCreditCardChargeInput extends AsaasPixChargeInput {
  creditCard: AsaasCreditCardInput;
  creditCardHolderInfo: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    addressComplement: string | null;
    phone: string;
  };
}

export class AsaasService {
  private static get baseUrl() {
    return process.env.ASAAS_API_URL || 'https://sandbox.asaas.com/api/v3';
  }

  private static get apiKey() {
    const key = process.env.ASAAS_API_KEY;
    if (!key) {
      console.warn('ASAAS_API_KEY is not defined. Using a dummy key for development.');
      return 'dummy_asaas_key';
    }
    return key;
  }

  private static get headers() {
    return {
      'Content-Type': 'application/json',
      'access_token': this.apiKey,
      'User-Agent': 'LojaDePneus/1.0',
    };
  }

  static async createCustomer(input: AsaasCustomerInput) {
    const payload = {
      ...input,
      notificationDisabled: input.notificationDisabled ?? true,
    };

    const response = await fetch(`${this.baseUrl}/customers`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('[Asaas] Error creating customer', errorData);
      throw new Error(`Failed to create customer in Asaas: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data.id as string;
  }

  static async createPixCharge(input: AsaasPixChargeInput) {
    const payload = {
      customer: input.customerId,
      billingType: 'PIX',
      value: input.value,
      dueDate: input.dueDate,
      description: input.description,
      externalReference: input.externalReference,
    };

    const response = await fetch(`${this.baseUrl}/payments`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('[Asaas] Error creating PIX charge', errorData);
      throw new Error(`Failed to create PIX charge in Asaas: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return {
      id: data.id as string,
      invoiceUrl: data.invoiceUrl as string
    };
  }

  static async getPixQrCode(paymentId: string) {
    const response = await fetch(`${this.baseUrl}/payments/${paymentId}/pixQrCode`, {
      method: 'GET',
      headers: this.headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('[Asaas] Error fetching PIX QR Code', errorData);
      throw new Error(`Failed to fetch PIX QR Code from Asaas: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return {
      encodedImage: data.encodedImage as string,
      payload: data.payload as string,
      expirationDate: data.expirationDate as string,
    };
  }

  static async createCreditCardCharge(input: AsaasCreditCardChargeInput) {
    const payload = {
      customer: input.customerId,
      billingType: 'CREDIT_CARD',
      value: input.value,
      dueDate: input.dueDate,
      description: input.description,
      externalReference: input.externalReference,
      creditCard: input.creditCard,
      creditCardHolderInfo: input.creditCardHolderInfo,
    };

    const response = await fetch(`${this.baseUrl}/payments`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('[Asaas] Error creating Credit Card charge', errorData);
      // We should potentially return specific error reasons here
      throw new Error('Failed to process Credit Card charge in Asaas');
    }

    const data = await response.json();
    return {
      id: data.id as string,
      status: data.status as string,
    };
  }
}
