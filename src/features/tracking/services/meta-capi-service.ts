'use server';

import 'server-only';
import { CommerceEvent } from '../types';
import { MetaStandardEvents, InternalEventName } from '../events/event-registry';
import { centsToDecimal } from '../utils/money-helpers';

interface CapiPayload {
  eventName: InternalEventName;
  eventData: CommerceEvent;
  pixelId: string;
  testEventCode?: string;
  userData?: Record<string, unknown>;
  sourceUrl?: string;
}

export async function sendMetaCapiEvent(payload: CapiPayload) {
  try {
    const token = process.env.META_CAPI_ACCESS_TOKEN;
    const apiVersion = process.env.META_GRAPH_API_VERSION || 'v20.0';

    if (!token || !payload.pixelId) {
      return { success: false, reason: 'unconfigured' };
    }

    const metaEventName = MetaStandardEvents[payload.eventName];
    if (!metaEventName) return { success: false, reason: 'unmapped_event' };

    const customData: Record<string, unknown> = {};
    if (payload.eventData.currency) customData.currency = payload.eventData.currency;
    if (payload.eventData.value !== undefined) customData.value = centsToDecimal(payload.eventData.value);
    
    if (payload.eventData.items && payload.eventData.items.length > 0) {
      customData.content_ids = payload.eventData.items.map(i => i.sku || i.itemId);
      customData.content_type = 'product';
      if (payload.eventName === 'PURCHASE') {
        customData.num_items = payload.eventData.items.reduce((acc, curr) => acc + curr.quantity, 0);
      }
    }

    const event = {
      event_name: metaEventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: payload.eventData.eventId,
      action_source: 'website',
      event_source_url: payload.sourceUrl,
      user_data: {
        client_user_agent: 'ServerAction',
        ...payload.userData,
      },
      custom_data: customData,
    };

    const body: Record<string, unknown> = {
      data: [event],
    };

    if (payload.testEventCode) {
      body.test_event_code = payload.testEventCode;
    }

    const url = `https://graph.facebook.com/${apiVersion}/${payload.pixelId}/events?access_token=${token}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    
    if (!res.ok) {
      console.warn('[MetaCAPI] Failed to send event:', data.error?.message);
      return { success: false, reason: 'api_error', error: data.error };
    }

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[MetaCAPI] Network/Server Error:', message);
    return { success: false, reason: 'server_error', message };
  }
}

