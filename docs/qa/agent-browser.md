# Documentação Agent-Browser

## 1. Objetivo
Transformar testes manuais em fluxos reproduzíveis através de um navegador controlado por agentes, integrando verificações visuais e navegação robusta, sem substituir a suite de unit tests (Vitest).

## 2. Instalação e Requisitos
O projeto utiliza a versão `^0.34.0` ou superior como dependência de desenvolvimento:
```bash
npm install -D agent-browser
```

### Comandos da CLI (v0.34.0)
Pode-se usar a CLI da seguinte maneira:
- `npx agent-browser open <url>`
- `npx agent-browser click <ref>`
- `npx agent-browser fill <ref> <texto>`
- `npx agent-browser snapshot`
- `npx agent-browser screenshot`

Pode-se encadear comandos com `&&`:
```bash
npx agent-browser open http://localhost:3000 && npx agent-browser snapshot
```

## 3. Segurança e Sessão
- **Sessão Persistente:** O `agent-browser` consegue reutilizar perfil se configurado (via `--profile` ou session storage local). Nos testes do Admin, caso a automação não tenha a senha (`E2E_ADMIN_PASSWORD`), ela fará uma pausa ou falhará com erro. 
- **Login Manual:** O script instruirá a abertura de `/admin/login`. Se o usuário efetuar o login, a sessão será reutilizada pelos próximos comandos.
- **Cleanup:** Testes que alteram dados do Supabase devem usar blocos `try...finally` em Node.js para garantir a reversão do banco, impedindo efeitos colaterais permanentes no ambiente de QA remoto.

## 4. Como um Agente deve usar esta ferramenta
Para usar a ferramenta na construção de automações:
1. Verifique se a URL está ativa.
2. Inicie o navegador e abra a URL. Ex: `npx agent-browser open http://localhost:3000`
3. Solicite a estrutura da página (`npx agent-browser snapshot`).
4. Navegue ou atue sobre referências numéricas retornadas no snapshot. Ex: `npx agent-browser click @e3`
5. Valide os elementos ou a presença de URLs esperadas.
6. Tire uma captura de evidência: `npx agent-browser screenshot --out ./qa/browser/screenshots/home.png`
7. Feche a sessão/limpe o estado. Exporte relatórios para `qa/browser/reports/latest.md`.
