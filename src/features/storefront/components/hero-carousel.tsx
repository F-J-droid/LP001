'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { Banner } from '@/features/admin/banners/repositories/admin-banners-repository';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { sendGTMEvent } from '@next/third-parties/google';

interface HeroCarouselProps {
  banners: Banner[];
}

export function HeroCarousel({ banners }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
    Autoplay({ delay: 6000, stopOnInteraction: true, stopOnMouseEnter: true })
  ]);
  
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    
    // Tracking impression
    const activeBanner = banners[index];
    if (activeBanner) {
      sendGTMEvent({ 
        event: 'banner_impression', 
        banner_id: activeBanner.id, 
        banner_name: activeBanner.internal_name,
        position: activeBanner.position,
        slide_index: index
      });
    }
  }, [emblaApi, banners]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  // Accessibility & Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') scrollPrev();
      if (e.key === 'ArrowRight') scrollNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollPrev, scrollNext]);

  if (!banners || banners.length === 0) {
    return <FallbackHero />;
  }

  return (
    <section className="relative overflow-hidden w-full bg-background" aria-label="Banners Principais">
      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex touch-pan-y h-[600px] md:h-[650px] lg:h-[700px]">
          {banners.map((banner, index) => (
            <div key={banner.id} className="relative flex-[0_0_100%] min-w-0" role="group" aria-roledescription="slide" aria-label={`${index + 1} de ${banners.length}`}>
              
              {/* Background Images */}
              <div className="absolute inset-0 z-0">
                {/* Desktop Image */}
                <Image 
                  src={banner.desktop_image_url}
                  alt={banner.image_alt || banner.headline || 'Banner'}
                  fill
                  priority={index === 0}
                  className={`object-cover ${banner.mobile_image_url ? 'hidden md:block' : ''}`}
                  sizes="100vw"
                />
                
                {/* Mobile Image */}
                {banner.mobile_image_url && (
                  <Image 
                    src={banner.mobile_image_url}
                    alt={banner.image_alt || banner.headline || 'Banner'}
                    fill
                    priority={index === 0}
                    className="object-cover md:hidden"
                    sizes="100vw"
                  />
                )}
                
                {/* Overlay */}
                {banner.overlay_strength !== 'none' && (
                  <div className={`absolute inset-0 ${
                    banner.overlay_strength === 'light' ? 'bg-black/20' :
                    banner.overlay_strength === 'medium' ? 'bg-black/40' :
                    banner.overlay_strength === 'strong' ? 'bg-black/60' : ''
                  } ${
                    banner.text_alignment === 'center' 
                      ? 'bg-gradient-to-t from-black/80 via-black/20 to-transparent' 
                      : 'bg-gradient-to-r from-[#0B1F33]/90 via-[#0B1F33]/40 to-transparent'
                  }`} />
                )}
              </div>

              {/* Content */}
              <Container className="relative z-10 h-full flex flex-col justify-center pb-12 pt-16">
                <div className={`w-full ${banner.text_alignment === 'center' ? 'text-center mx-auto' : 'text-left md:w-2/3 lg:w-1/2'} ${banner.theme === 'light' ? 'text-black' : 'text-white'}`}>
                  
                  {banner.headline && (
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4 md:mb-6 leading-[1.1] drop-shadow-sm">
                      {banner.highlight_text ? (
                        <>
                          {banner.headline.split(banner.highlight_text).map((part, i, arr) => (
                            <React.Fragment key={i}>
                              {part}
                              {i < arr.length - 1 && <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#4A90E2]">{banner.highlight_text}</span>}
                            </React.Fragment>
                          ))}
                        </>
                      ) : (
                        banner.headline
                      )}
                    </h2>
                  )}

                  {banner.subheadline && (
                    <p className={`text-lg md:text-xl mb-8 max-w-lg font-medium leading-relaxed drop-shadow-sm ${banner.text_alignment === 'center' ? 'mx-auto' : ''} ${banner.theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
                      {banner.subheadline}
                    </p>
                  )}

                  <div className={`flex flex-col sm:flex-row gap-4 ${banner.text_alignment === 'center' ? 'justify-center' : 'justify-start'}`}>
                    {banner.primary_cta_label?.trim() && (
                      <Link 
                        href={banner.primary_cta_url || '#'} 
                        className="w-full sm:w-auto"
                        onClick={() => sendGTMEvent({ event: 'banner_click', banner_id: banner.id, banner_name: banner.internal_name, cta: 'primary' })}
                      >
                        <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold px-8 h-14 text-lg w-full shadow-lg shadow-accent/20 transition-all hover:-translate-y-1">
                          {banner.primary_cta_label.trim()}
                        </Button>
                      </Link>
                    )}
                    {banner.secondary_cta_label?.trim() && (
                      <Link 
                        href={banner.secondary_cta_url || '#'} 
                        className="w-full sm:w-auto"
                        onClick={() => sendGTMEvent({ event: 'banner_click', banner_id: banner.id, banner_name: banner.internal_name, cta: 'secondary' })}
                      >
                        <Button size="lg" variant="outline" className={`font-bold px-8 h-14 text-lg w-full transition-all hover:-translate-y-1 backdrop-blur-sm ${
                          banner.theme === 'light' 
                            ? 'border-black text-black hover:bg-black/10' 
                            : 'border-white/50 text-white hover:bg-white/10'
                        }`}>
                          {banner.secondary_cta_label.trim()}
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Container>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      {banners.length > 1 && (
        <>
          <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 z-20 hidden md:block">
            <Button variant="ghost" size="icon" onClick={scrollPrev} className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-md border border-white/10 transition-all" aria-label="Banner anterior">
              <ChevronLeft className="w-6 h-6" />
            </Button>
          </div>
          <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 z-20 hidden md:block">
            <Button variant="ghost" size="icon" onClick={scrollNext} className="h-12 w-12 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-md border border-white/10 transition-all" aria-label="Próximo banner">
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
          
          {/* Dots */}
          <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                aria-label={`Ir para banner ${index + 1}`}
                className={`transition-all duration-300 rounded-full h-2 ${
                  index === selectedIndex ? 'w-8 bg-primary' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function FallbackHero() {
  return (
    <section className="bg-[#0B1F33] relative overflow-hidden text-center md:text-left min-h-[500px] lg:min-h-[600px] flex items-center">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F33] via-[#111827] to-[#111827] opacity-100 z-0" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF7A00]/10 rounded-full blur-[100px] z-0 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#146EF5]/10 rounded-full blur-[120px] z-0 pointer-events-none" />

      <Container className="relative z-10 py-16 md:py-24 lg:py-32 flex flex-col md:flex-row items-center justify-between h-full">
        <div className="w-full md:w-1/2 lg:w-5/12 text-white pb-12 md:pb-0 z-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
            Seu carro merece o <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#146EF5] to-[#4A90E2]">pneu certo.</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg mx-auto md:mx-0 font-medium leading-relaxed">
            Encontre pneus pela medida ou pelo seu veículo e compre com segurança.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/pneus" className="w-full sm:w-auto">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold px-8 h-14 text-lg w-full shadow-lg shadow-accent/20 transition-all hover:-translate-y-1">
                ENCONTRAR MEU PNEU
              </Button>
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2 lg:w-7/12 h-[300px] md:h-[450px] lg:h-[550px] relative z-10 flex justify-center md:justify-end">
          <div className="relative w-full h-full transform translate-x-4 md:translate-x-12">
            <Image 
              src="/images/hero/hero-premium.webp" 
              alt="Pneu automotivo premium"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              className="object-contain drop-shadow-2xl"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
