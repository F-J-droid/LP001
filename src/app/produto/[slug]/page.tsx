import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Section } from '@/components/layout/section';
import { productRepository } from '@/features/products/repositories/supabase-product-repository';
import { ProductGallery } from '@/features/products/components/product-gallery';
import { ProductPurchasePanel } from '@/features/products/components/product-purchase-panel';
import { ProductSpecs } from '@/features/products/components/product-specs';
import { ProductSimilar } from '@/features/products/components/product-similar';
import { CompatibilityChecker } from '@/features/vehicles/components/compatibility-checker';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Script from 'next/script';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await productRepository.getProductBySlug(slug);
  if (!product) return {};

  const title = `${product.brand} ${product.model} ${product.width}/${product.profile} R${product.rim} | TireStore`;
  const description = `Pneu ${product.brand} ${product.model} ${product.width}/${product.profile} R${product.rim}. Consulte especificações, preço e opções de entrega.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: product.imageUrl }],
    },
    alternates: {
      canonical: `/produto/${product.slug}`,
    }
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  console.log("SLUG RECEIVED:", slug);
  const product = await productRepository.getProductBySlug(slug);
  
  if (!product) {
    notFound();
  }

  const similarProducts = await productRepository.getSimilarProducts(product.id, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${product.brand} ${product.model}`,
    image: product.imageUrl,
    description: product.description,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      url: `/produto/${product.slug}`,
      priceCurrency: 'BRL',
      price: product.pixPrice ?? product.price,
      availability: product.stockStatus === 'available' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen bg-muted/20 pb-20">
        <Container className="py-6">
          <div className="text-sm text-muted-foreground mb-8 flex items-center gap-2 font-medium">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/pneus" className="hover:text-foreground transition-colors">Pneus</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/pneus?brand=${product.brand.toLowerCase()}`} className="hover:text-foreground transition-colors">{product.brand}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground truncate">{product.model}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Column: Gallery */}
            <div className="lg:col-span-7">
              <ProductGallery images={product.gallery || [product.imageUrl]} alt={`${product.brand} ${product.model}`} />
            </div>

            {/* Right Column: Commercial Info */}
            <div className="lg:col-span-5 space-y-8">
              <ProductPurchasePanel product={product} />
              <CompatibilityChecker productId={product.id} />
            </div>
          </div>
        </Container>

        {/* Product Information Tabs/Specs */}
        <Section className="bg-background border-y mt-8">
          <Container>
            <ProductSpecs product={product} />
          </Container>
        </Section>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <Section className="bg-muted/20">
            <Container>
              <ProductSimilar products={similarProducts} measure={`${product.width}/${product.profile} R${product.rim}`} />
            </Container>
          </Section>
        )}
      </div>
    </>
  );
}
