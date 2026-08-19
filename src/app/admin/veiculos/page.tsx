import { Metadata } from 'next';
import { adminDb } from '@/features/admin/storage/admin-local-db';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminBrandsTable } from '@/features/admin/components/vehicles/admin-brands-table';
import { AdminModelsTable } from '@/features/admin/components/vehicles/admin-models-table';
import { AdminVersionsTable } from '@/features/admin/components/vehicles/admin-versions-table';
import { AdminFitmentsTable } from '@/features/admin/components/vehicles/admin-fitments-table';

export const metadata: Metadata = {
  title: 'Veículos | Admin',
};

export default async function AdminVehiclesPage() {
  const db = await adminDb.getDb();
  
  const brands = db.vehicleBrands || [];
  const models = db.vehicleModels || [];
  const versions = db.vehicleVersions || [];
  const fitments = db.vehicleFitments || [];
  const tireSizes = db.sizes || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Veículos & Fitments</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as compatibilidades de veículos e tamanhos de pneus.
          </p>
        </div>
      </div>

      <Tabs defaultValue="fitments" className="space-y-4">
        <TabsList className="bg-background border">
          <TabsTrigger value="brands">Marcas ({brands.length})</TabsTrigger>
          <TabsTrigger value="models">Modelos ({models.length})</TabsTrigger>
          <TabsTrigger value="versions">Versões ({versions.length})</TabsTrigger>
          <TabsTrigger value="fitments">Fitments ({fitments.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="brands" className="space-y-4">
          <div className="bg-card border rounded-xl shadow-sm p-4">
            <AdminBrandsTable brands={brands} />
          </div>
        </TabsContent>
        
        <TabsContent value="models" className="space-y-4">
          <div className="bg-card border rounded-xl shadow-sm p-4">
            <AdminModelsTable models={models} brands={brands} />
          </div>
        </TabsContent>
        
        <TabsContent value="versions" className="space-y-4">
          <div className="bg-card border rounded-xl shadow-sm p-4">
            <AdminVersionsTable versions={versions} models={models} brands={brands} />
          </div>
        </TabsContent>

        <TabsContent value="fitments" className="space-y-4">
          <div className="bg-card border rounded-xl shadow-sm p-4">
            <AdminFitmentsTable 
              fitments={fitments} 
              versions={versions} 
              models={models} 
              brands={brands} 
              tireSizes={tireSizes}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
