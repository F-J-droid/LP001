import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { vehicleFitmentRepository } from '@/features/vehicles/repositories/vehicle-fitment-repository';
import { vehicleCompatibilityService } from '@/features/vehicles/services/vehicle-compatibility-service';
import { ProductCard } from '@/features/products/components/product-card';
import Link from 'next/link';
import { AlertCircle, ChevronRight, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VehiclePageProps {
  params: Promise<{
    brand: string;
    model: string;
    year: string;
    versionSlug: string;
  }>;
}

export async function generateMetadata({ params }: VehiclePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const brand = await vehicleFitmentRepository.getBrandBySlug(resolvedParams.brand);
  const model = brand ? await vehicleFitmentRepository.getModelBySlug(brand.id, resolvedParams.model) : null;
  const version = model ? await vehicleFitmentRepository.getVersionBySlug(model.id, parseInt(resolvedParams.year), resolvedParams.versionSlug) : null;

  if (!brand || !model || !version) {
    return { title: 'Veículo Não Encontrado | BRPNEU' };
  }

  const title = `Pneus para ${brand.name} ${model.name} ${version.name} ${resolvedParams.year} | BRPNEU`;
  const description = `Encontre os pneus compatíveis com as medidas originais do seu ${brand.name} ${model.name} ${version.name} ${resolvedParams.year}.`;

  return {
    title,
    description,
  };
}

export default async function VehicleCompatibilityPage({ params }: VehiclePageProps) {
  const resolvedParams = await params;
  const yearNum = parseInt(resolvedParams.year);

  // 1. Resolve Slugs to IDs
  const brand = await vehicleFitmentRepository.getBrandBySlug(resolvedParams.brand);
  if (!brand) notFound();

  const model = await vehicleFitmentRepository.getModelBySlug(brand.id, resolvedParams.model);
  if (!model) notFound();

  const version = await vehicleFitmentRepository.getVersionBySlug(model.id, yearNum, resolvedParams.versionSlug);
  if (!version) notFound();

  // 2. Get Compatibility Results
  const result = await vehicleCompatibilityService.getCompatibleProducts(version.id);
  
  if (!result) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <Container className="py-6">
        <div className="text-sm text-muted-foreground mb-8 flex items-center gap-2 font-medium">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/pneus" className="hover:text-foreground transition-colors">Pneus</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground truncate">{brand.name} {model.name}</span>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground mb-2">
                Pneus para {brand.name} {model.name} {version.name} {yearNum}
              </h1>
              <p className="text-muted-foreground text-lg">
                Medidas compatíveis encontradas para esta configuração.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 text-blue-800 p-4 rounded-xl flex items-start gap-3 max-w-sm">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">
                Confirme a medida instalada atualmente no veículo antes da compra. Os dados podem variar conforme a montadora.
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full font-semibold text-sm">
              Veículo Selecionado: {brand.name} {model.name} {yearNum}
              <Link href="/pneus" className="hover:bg-primary/20 p-1 rounded-full ml-1 transition-colors">
                <X className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {result.fitments.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-2xl border">
            <h3 className="text-xl font-bold text-muted-foreground mb-2">Nenhuma medida cadastrada.</h3>
            <p className="text-muted-foreground mb-6">Ainda não possuímos as medidas originais homologadas para esta versão no nosso sistema.</p>
            <Link href="/pneus" className="bg-primary text-white px-6 py-3 rounded-lg font-bold">Ver todos os Pneus</Link>
          </div>
        ) : (
          <div className="space-y-12">
            {result.fitments.map((fitmentData, index) => (
              <div key={fitmentData.fitment.id}>
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-2xl font-black">
                    Medida {fitmentData.tireSize.width}/{fitmentData.tireSize.profile} R{fitmentData.tireSize.rim}
                  </h2>
                  {fitmentData.fitment.position === 'front' && <Badge variant="secondary">Dianteiro</Badge>}
                  {fitmentData.fitment.position === 'rear' && <Badge variant="secondary">Traseiro</Badge>}
                  {result.fitments.length > 1 && fitmentData.fitment.position === 'all' && (
                    <Badge variant="outline">Opção {index + 1}</Badge>
                  )}
                </div>

                {fitmentData.products.length === 0 ? (
                  <div className="p-8 border border-dashed rounded-2xl text-center text-muted-foreground bg-card/50">
                    <p className="font-medium">Nenhum pneu disponível nesta medida no momento.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {fitmentData.products.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
