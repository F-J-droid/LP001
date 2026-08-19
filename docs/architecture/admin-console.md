# Arquitetura do Painel Administrativo

O painel administrativo (`/admin`) foi projetado como uma interface separada do storefront para gerenciar os dados da aplicação de forma segura e eficiente.

## 1. Princípios Arquiteturais

* **Camada de Serviço Server-Side**: Todas as operações de leitura e escrita devem passar pelo `admin-service.ts`, garantindo validação e integridade.
* **Storage Provider Abstrato**: O uso do `AdminLocalDB` encapsula a persistência em um arquivo JSON durante o desenvolvimento, preparando o terreno para a futura integração com Supabase.
* **Componentes Otimizados**: Uso intensivo de Server Components (`page.tsx`) para carregamento inicial de dados e Client Components (`product-form.tsx`, `stock-table.tsx`) para interações ricas com os formulários (via React Hook Form e Zod).
* **Isolamento de Segurança**: Rotas sob `/admin` são restritas em produção caso `ADMIN_AUTH_ENABLED` não esteja ativo. (O ideal é um middleware de autenticação, previsto para fases futuras).

## 2. Estrutura de Diretórios

```
src/
  app/
    admin/               # Rotas do painel (App Router)
      layout.tsx         # Layout com Sidebar e Header
      page.tsx           # Dashboard com KPIs
      produtos/          # CRUD de Produtos
      estoque/           # Tabela de edição rápida de estoque
      ...
  features/
    admin/
      components/        # Componentes visuais do admin (Forms, Tables, Nav)
      schemas/           # Validações Zod (product.schema.ts)
      services/          # Server Actions e lógicas de negócios (admin-service.ts)
      storage/           # Camada de persistência local (admin-local-db.ts)
      types/             # Interfaces de domínio (AdminDatabase, etc)
```

## 3. Fluxo de Dados e Revalidação

Ao editar um produto no painel administrativo:
1. O Client Component `ProductForm` submete os dados válidos.
2. O Server Action `updateAdminProduct` (ou `createAdminProduct`) é acionado.
3. O `admin-service.ts` interage com o `AdminLocalDB` para atualizar o arquivo JSON.
4. O `admin-service.ts` chama `revalidatePath('/pneus')` e `revalidatePath('/admin/produtos')` para atualizar instantaneamente o cache do Next.js.
5. O Storefront passa a exibir os novos dados, preços ou oculta o produto (se arquivado).

## 4. Evolução (Próximos Passos)

* **Autenticação**: Implementar middleware de verificação JWT (NextAuth ou Supabase Auth).
* **Upload de Imagens**: Substituir os campos de URL manual por upload direto para o Supabase Storage.
* **Histórico e Auditoria**: Adicionar tabela para auditar mudanças críticas de preço ou estoque.
