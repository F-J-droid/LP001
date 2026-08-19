# Browser QA com Agent-Browser

Este diretório contém os fluxos de automação de testes E2E e Smoke utilizando a ferramenta [agent-browser](https://github.com/vercel-labs/agent-browser).

## Estrutura
- `flows/`: Scripts executáveis (`.mjs`) que rodam fluxos de navegação e assertividade.
- `screenshots/`: Diretório ignorado pelo git contendo capturas de tela das execuções (útil para auditoria visual e modelos de visão).
- `reports/`: Relatórios gerados em Markdown contendo o resultado das execuções (ex: `latest.md`).

## Executando
O `package.json` expõe os seguintes scripts:
- `npm run qa:browser:storefront` - Executa os fluxos na interface pública.
- `npm run qa:browser:admin` - Executa os smoke tests do painel administrativo.
- `npm run qa:browser:homologation` - Executa a homologação que envolve Storefront e Admin com manipulação do Supabase.

> [!WARNING]
> O `agent-browser` complementa os testes do `vitest` fazendo validação de caixa-preta via UI. Ele não os substitui.

## Segurança
- Não inclua senhas ou tokens nos fluxos. Use variáveis de ambiente (ex: `E2E_ADMIN_PASSWORD` no `.env.local`).
- O `.gitignore` garante que artefatos locais gerados durante a navegação não sejam commitados.
