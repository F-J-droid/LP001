import { requireAdmin } from '@/features/admin/utils/require-admin';
import { AdminMeasuresRepository } from '@/features/admin/measures/repositories/admin-measures-repository';
import { MeasureList } from './components/measure-list';
import { MeasureForm } from './components/measure-form';

export default async function AdminMeasuresPage() {
  const supabase = await requireAdmin();
  const repo = new AdminMeasuresRepository(supabase);
  const measures = await repo.list();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Medidas</h1>
        <p className="text-muted-foreground">Gerenciamento de larguras, perfis e aros.</p>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Formulário de Criação */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Nova Medida</h2>
          <MeasureForm />
        </div>

        {/* Tabela de Medidas */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Medidas Cadastradas ({measures.length})</h2>
          <MeasureList measures={measures} />
        </div>
      </div>
    </div>
  );
}
