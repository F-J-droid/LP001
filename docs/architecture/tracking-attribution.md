# Arquitetura de Tracking e Atribuição

## Visão Geral

A loja implementa uma infraestrutura server-side robusta, desacoplada e segura para disparo de eventos de marketing (Meta Pixel, Conversions API, Google Analytics 4, GTM e Google Ads).

## Princípios

1. **Isolation / Facade Pattern**: Todo disparo de evento no frontend deve passar exclusivamente pelo `TrackingService`. Nenhum componente React sabe sobre `fbq`, `gtag` ou `dataLayer`. Isso previne crashes da UI se o script de uma ad network falhar.
2. **First-Party Attribution**: A origem das campanhas (utm_source, fbclid, gclid, _fbp, _fbc) é retida em um cookie de 90 dias (`tp_attr_data`).
3. **Consent-First e Consent Mode**: O status padrão para `analytics` e `marketing` é `unknown`. Nenhum dado é enviado sem consentimento explícito, exceto em ambiente de desenvolvimento se `TRACKING_DEV_BYPASS=true`. **Importante:** O Google Consent Mode ainda precisa ser homologado em ambiente real antes de ir para produção.
4. **Security (CAPI)**: O `META_CAPI_ACCESS_TOKEN` é mantido estritamente server-side. Não é trafegado no bundle JWT do admin, não é enviado ao frontend da loja, não vaza em requests HTTP públicos e NÃO é editável na UI administrativa (o admin apenas exibe se está configurado ou não).
5. **Purchase Guard e ID Transacional**: Eventos `PURCHASE` nunca são disparados de forma especulativa durante a visualização do checkout ou ao criar pedidos com status `pending_payment`. Eles são restritos a transações efetivadas e utilizarão um `transaction_id` estável baseado no `public_id` real do pedido.

## Fluxo de Evento e Deduplicação (Exemplo: AddToCart)

1. Usuário clica em "Adicionar ao Carrinho".
2. `ProductPurchasePanel` chama `trackingService.trackAddToCart(item)`.
3. `TrackingService` gera um UUID único **por ocorrência** (`event_id` gerado no momento do clique, não por sessão).
4. Verifica consentimento no `ConsentService`.
5. Se o usuário permitiu Marketing: `MetaPixelAdapter` despacha `fbq('track', 'AddToCart')` passando este `event_id`.
6. Para eventos críticos (CAPI habilitada), `TrackingService` também dispara a Server Action `sendMetaCapiEvent`, enviando o **mesmo** `event_id` para a API da Meta no backend.
7. O Meta Ads processa os envios, reconhece a mesma ocorrência lógica de evento pelo `event_id` e realiza a deduplicação.

## Atribuição (Touchpoints)

A `AttributionService` salva o `firstTouch` e `lastTouch`. Se um visitante clica em um anúncio do Facebook:
1. `fbclid` é capturado da URL no RootLayout via `TrackingProvider`.
2. Um cookie de 90 dias guarda esses dados.
3. Se ele volta no dia seguinte via acesso direto, os eventos Server-Side CAPI ainda enviarão o `_fbc` ou UTM original no payload `user_data`, garantindo atribuição da conversão à campanha correta.
