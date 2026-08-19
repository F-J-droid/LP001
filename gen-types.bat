@echo off
set SUPABASE_ACCESS_TOKEN=SEU_TOKEN_AQUI
npx supabase gen types typescript --project-id karseejxpebcgrcwnvlj --schema public > src\lib\supabase\database.types.ts
