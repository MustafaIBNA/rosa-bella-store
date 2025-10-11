'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const sliderImages = PlaceHolderImages.filter(img => ['hero-1', 'hero-2', 'hero-3'].includes(img.id));

export function HeroSlider() {
  return (
    <section className="w-full">
      <Carousel
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent>
          {sliderImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full">
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  fill
                  className="object-cover"
                  data-ai-hint={image.imageHint}
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                  <h1 className="text-3xl md:text-5xl font-extrabold font-headline mb-4">
                    {index === 0 ? "Artistry in Every Detail" : index === 1 ? "Handcrafted Elegance" : "Timeless Designs"}
                  </h1>
                  <p className="text-lg md:text-xl max-w-2xl">
                    {index === 0 ? "Discover the unique beauty of Rosabella's handcrafted coasters and home decor." : index === 1 ? "Elevate your space with pieces that blend traditional craftsmanship with modern design." : "From our hands to your home, experience the quality of artisan-made goods."}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
      </Carousel>
    </section>
  );
}
