import { requireAdmin } from '@/features/admin/utils/require-admin';
import { AdminSettingsRepository } from '@/features/admin/settings/repositories/admin-settings-repository';
import { SettingsTabs } from './components/settings-tabs';

export default async function AdminSettingsPage() {
  const supabase = await requireAdmin();
  const repo = new AdminSettingsRepository(supabase);
  const allSettings = await repo.getAll();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Configurações Globais</h1>
        <p className="text-muted-foreground">Informações da loja, contatos, SEO e regras de negócio.</p>
      </div>

      <SettingsTabs initialSettings={allSettings} />
    </div>
  );
}
