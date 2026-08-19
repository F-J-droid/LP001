import Image from "next/image"
import Link from "next/link"
import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TireFinder } from "@/features/finder/components/tire-finder"
import { ProductCard } from "@/features/products/components/product-card"
import { productRepository } from "@/features/products/repositories/supabase-product-repository"
import { CheckCircle2, ShieldCheck, CreditCard, Wrench, MessageCircle, ChevronRight, ArrowRight } from "lucide-react"
import { createClient } from '@/lib/supabase/server'
import { StorefrontBannersRepository } from '@/features/storefront/repositories/storefront-banners-repository'
import { HeroCarousel } from '@/features/storefront/components/hero-carousel'

export default async function Home() {
  const supabase = await createClient();
  const bannerRepo = new StorefrontBannersRepository(supabase);
  const [offers, bestSellers, heroBanners] = await Promise.all([
    productRepository.getFeaturedProducts(4),
    productRepository.getBestSellingProducts(4),
    bannerRepo.getHeroBanners()
  ]);

  return (
    <>
      <HeroCarousel banners={heroBanners} />

      {/* Search Block (TireFinder) */}
      <div className="relative -mt-10 md:-mt-16 z-20 px-4 md:px-0">
        <Container>
          <TireFinder />
        </Container>
      </div>

      {/* Institutional/Benefits Section */}
      <Section className="bg-background pt-20 md:pt-28 pb-10">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8">
            <div className="flex flex-col items-center text-center p-4 group">
              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-4 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white shadow-sm border border-primary/10">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-sm md:text-base mb-1 text-foreground">Entrega para todo Brasil</h3>
            </div>
            <div className="flex flex-col items-center text-center p-4 group">
              <div className="w-14 h-14 bg-success/5 rounded-2xl flex items-center justify-center mb-4 text-success transition-all duration-300 group-hover:scale-110 group-hover:bg-success group-hover:text-white shadow-sm border border-success/10">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-sm md:text-base mb-1 text-foreground">Compra segura</h3>
            </div>
            <div className="flex flex-col items-center text-center p-4 group">
              <div className="w-14 h-14 bg-accent/5 rounded-2xl flex items-center justify-center mb-4 text-accent transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-white shadow-sm border border-accent/10">
                <CreditCard className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-sm md:text-base mb-1 text-foreground">Pagamento facilitado</h3>
            </div>
            <div className="flex flex-col items-center text-center p-4 group">
              <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-4 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white shadow-sm border border-primary/10">
                <Wrench className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-sm md:text-base mb-1 text-foreground">Instalação especializada</h3>
            </div>
            <div className="flex flex-col items-center text-center p-4 col-span-2 md:col-span-1 group">
              <div className="w-14 h-14 bg-success/5 rounded-2xl flex items-center justify-center mb-4 text-success transition-all duration-300 group-hover:scale-110 group-hover:bg-success group-hover:text-white shadow-sm border border-success/10">
                <MessageCircle className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-sm md:text-base mb-1 text-foreground">Atendimento via WhatsApp</h3>
            </div>
          </div>
        </Container>
      </Section>

      {/* Offers Vitrine */}
      <Section className="bg-muted">
        <Container>
          <div className="flex justify-between items-end mb-8 border-b border-muted/50 pb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground uppercase">Ofertas em destaque</h2>
              <p className="text-muted-foreground mt-1 font-medium">Aproveite os melhores descontos da semana.</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex text-primary font-bold hover:bg-primary/10" asChild>
              <Link href="/pneus?promotion=true">Ver todas <ChevronRight className="ml-1 w-4 h-4" /></Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {offers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Button variant="outline" className="w-full mt-6 sm:hidden font-bold h-12" asChild>
            <Link href="/pneus?promotion=true">Ver todas ofertas</Link>
          </Button>
        </Container>
      </Section>

      {/* Promotional Banner */}
      <Section className="py-0 relative">
        <Container>
          <div className="w-full bg-[#111827] rounded-2xl overflow-hidden relative min-h-[280px] md:min-h-[220px] flex items-center my-8 md:my-12 shadow-2xl border border-white/10 group cursor-pointer">
            {/* Background pattern/image area */}
            <div className="absolute inset-0 z-0">
              <Image 
                src="/images/banners/banner-promo.webp"
                alt="Banner Background"
                fill
                className="object-cover opacity-60 mix-blend-overlay group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F33] to-transparent z-10"></div>
            </div>
            
            <div className="relative z-20 p-8 md:p-12 w-full md:w-2/3">
              <Badge className="bg-accent text-white hover:bg-accent mb-4 uppercase tracking-widest font-black">Pronto para a estrada?</Badge>
              <h2 className="text-2xl md:text-4xl font-black text-white mb-4 leading-tight">
                Encontre pneus perfeitos <br className="hidden md:block"/>para sua próxima viagem.
              </h2>
              <Link href="/pneus?promotion=true">
                <Button className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-full shadow-lg shadow-primary/20 transition-transform group-hover:translate-x-2">
                  VER PNEUS <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* Categories */}
      <Section className="bg-background">
        <Container>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-center mb-12 uppercase text-foreground">Encontre pelo seu tipo de veículo</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {[
              { id: 'passeio', name: 'Passeio', img: 'tire-touring' },
              { id: 'suv', name: 'SUV', img: 'tire-suv' },
              { id: 'pickup', name: 'Pickup', img: 'tire-pickup' },
              { id: 'utilitario', name: 'Utilitário', img: 'tire-suv' },
              { id: '4x4', name: '4x4', img: 'tire-4x4' },
              { id: 'performance', name: 'Performance', img: 'tire-performance' }
            ].map((cat) => (
              <Link href={`/pneus?category=${cat.name}`} key={cat.id} className="bg-muted/30 border border-muted/50 rounded-2xl p-4 text-center hover:-translate-y-2 hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer group flex flex-col items-center">
                <div className="w-full aspect-square relative mb-4">
                  <Image 
                    src={`/images/products/${cat.img}.webp`}
                    alt={`Categoria ${cat.name}`}
                    fill
                    sizes="(max-width: 768px) 33vw, 15vw"
                    className="object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>
                <h3 className="font-black text-foreground uppercase tracking-wide group-hover:text-primary transition-colors">{cat.name}</h3>
                <span className="text-xs text-muted-foreground mt-1 font-medium">Ver opções</span>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* Best Sellers Vitrine */}
      <Section className="bg-muted/30">
        <Container>
          <div className="flex justify-between items-end mb-8 border-b border-muted/50 pb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground uppercase">Mais vendidos</h2>
              <p className="text-muted-foreground mt-1 font-medium">Os preferidos pelos nossos clientes.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Brand Strip */}
      <Section className="bg-background border-y overflow-hidden py-10">
        <h2 className="text-sm font-bold tracking-widest text-center mb-8 uppercase text-muted-foreground">As marcas que você procura</h2>
        
        {/* Marquee Container */}
        <div className="relative flex overflow-x-hidden group">
          {/* First block */}
          <div className="flex animate-marquee gap-4 pr-4 whitespace-nowrap min-w-full">
            {['MICHELIN', 'PIRELLI', 'BRIDGESTONE', 'CONTINENTAL', 'GOODYEAR', 'HANKOOK', 'DUNLOP', 'YOKOHAMA', 'KUMHO', 'FALKEN'].map((brand) => (
              <Link href={`/pneus?brand=${brand.toLowerCase()}`} key={`1-${brand}`} className="bg-background border rounded-xl h-20 min-w-[200px] flex items-center justify-center hover:shadow-md hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer group/item flex-shrink-0">
                <span className="font-black text-xl tracking-tighter text-muted-foreground/60 group-hover/item:text-foreground transition-colors">{brand}</span>
              </Link>
            ))}
          </div>
          {/* Second block (duplicate for seamless loop) */}
          <div className="flex animate-marquee gap-4 pr-4 whitespace-nowrap min-w-full absolute top-0 left-[100%]">
            {['MICHELIN', 'PIRELLI', 'BRIDGESTONE', 'CONTINENTAL', 'GOODYEAR', 'HANKOOK', 'DUNLOP', 'YOKOHAMA', 'KUMHO', 'FALKEN'].map((brand) => (
              <Link href={`/pneus?brand=${brand.toLowerCase()}`} key={`2-${brand}`} className="bg-background border rounded-xl h-20 min-w-[200px] flex items-center justify-center hover:shadow-md hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer group/item flex-shrink-0">
                <span className="font-black text-xl tracking-tighter text-muted-foreground/60 group-hover/item:text-foreground transition-colors">{brand}</span>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* Guide Section */}
      <Section className="bg-[#0B1F33] text-white">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="z-10">
              <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-primary/20 mb-4 font-bold uppercase tracking-widest">Guia de Compras</Badge>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4 leading-tight">Entenda a medida <br/>do seu pneu</h2>
              <p className="text-white/70 mb-8 text-lg font-medium leading-relaxed">
                Saber ler as informações na lateral do pneu é essencial para comprar o modelo correto e garantir a segurança do seu veículo.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="bg-primary text-white font-black w-14 h-14 rounded-lg flex items-center justify-center shrink-0 text-xl shadow-lg shadow-primary/20">205</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Largura</h4>
                    <p className="text-sm text-white/60">A largura do pneu em milímetros, de ponta a ponta na banda de rodagem.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="bg-primary text-white font-black w-14 h-14 rounded-lg flex items-center justify-center shrink-0 text-xl shadow-lg shadow-primary/20">55</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Perfil</h4>
                    <p className="text-sm text-white/60">A relação entre a altura e a largura do pneu em porcentagem.</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="bg-primary text-white font-black w-14 h-14 rounded-lg flex items-center justify-center shrink-0 text-xl shadow-lg shadow-primary/20">R16</div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Construção e Aro</h4>
                    <p className="text-sm text-white/60">&quot;R&quot; indica construção Radial. O número 16 é o diâmetro do aro em polegadas.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative h-[400px] md:h-[500px] w-full flex items-center justify-center">
              {/* Technical illustration visual concept */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent z-0"></div>
              
              <div className="relative z-10 w-full max-w-sm aspect-square bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex flex-col items-center justify-center shadow-2xl p-8">
                <div className="absolute inset-4 border border-white/5 rounded-full border-dashed"></div>
                <div className="absolute inset-12 border border-white/5 rounded-full border-dashed"></div>
                
                <div className="text-center z-20 bg-[#0B1F33] p-6 rounded-2xl border border-white/10 shadow-2xl">
                  <div className="text-6xl font-black text-white tracking-widest font-mono">
                    205
                  </div>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/30 to-transparent my-4"></div>
                  <div className="flex justify-center items-end gap-2 font-mono">
                    <span className="text-5xl font-bold text-primary">55</span>
                    <span className="text-4xl font-bold text-white/80">R16</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Social Proof */}
      <Section className="bg-background border-b">
        <Container className="text-center max-w-4xl py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 text-success mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6 uppercase text-foreground">Experiência pensada para uma compra segura.</h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 font-medium leading-relaxed">
            Nossa plataforma foi desenhada para garantir que você encontre o pneu correto com a máxima facilidade, segurança e transparência. Navegue pelo nosso catálogo com confiança.
          </p>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-8 h-8 text-accent fill-accent drop-shadow-sm" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            ))}
          </div>
        </Container>
      </Section>

      {/* Blog */}
      <Section className="bg-muted">
        <Container>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight mb-10 text-foreground uppercase text-center md:text-left">Conteúdo para cuidar melhor do seu carro</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Como descobrir a medida do pneu",
                desc: "Aprenda a ler as marcações na lateral do pneu do seu carro em passos simples e evite compras erradas.",
                img: "blog-inspection"
              },
              {
                title: "Quando trocar os pneus?",
                desc: "Sinais claros na banda de rodagem que indicam que chegou a hora de substituir os pneus por questões de segurança.",
                img: "blog-wear"
              },
              {
                title: "Como escolher pneus para chuva",
                desc: "Segurança em dias chuvosos: entenda as ranhuras do pneu e a resistência à aquaplanagem.",
                img: "blog-rain"
              }
            ].map((post, i) => (
              <div key={i} className="group cursor-pointer bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-muted/30 flex flex-col h-full">
                <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                  <Image 
                    src={`/images/blog/${post.img}.png`}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 group-hover:rotate-1 transition-all duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="font-black text-xl group-hover:text-primary transition-colors leading-tight mb-3">{post.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">{post.desc}</p>
                  <span className="text-primary font-bold text-sm flex items-center uppercase tracking-wider">
                    Ler artigo <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA WhatsApp */}
      <Section className="bg-primary text-primary-foreground text-center py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent pointer-events-none"></div>
        <Container className="max-w-3xl relative z-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6 leading-tight">Precisa de ajuda para escolher?</h2>
          <p className="text-primary-foreground/90 text-lg md:text-xl mb-10 font-medium">
            Fale com nosso atendimento e encontre a medida correta para seu carro. Nossa equipe de especialistas está pronta para ajudar.
          </p>
          <Button size="lg" className="bg-success hover:bg-success/90 hover:scale-105 text-white font-black h-16 px-10 text-lg rounded-full shadow-2xl shadow-success/30 transition-all duration-300">
            <MessageCircle className="mr-3 h-7 w-7" />
            FALAR NO WHATSAPP
          </Button>
        </Container>
      </Section>
    </>
  )
}
