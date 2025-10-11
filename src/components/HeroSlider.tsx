'use client';

import Image from 'next/image';
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
    const slideData = [
    {
      textTitle: "Artistry in Every Detail",
      textDescription: "Discover the unique beauty of Rosabella's handcrafted coasters and home decor.",
    },
    {
      textTitle: "Handcrafted Elegance",
      textDescription: "Elevate your space with pieces that blend traditional craftsmanship with modern design.",
    },
    {
      textTitle: "Timeless Designs",
      textDescription: "From our hands to your home, experience the quality of artisan-made goods.",
    }
  ];
  
  const orderedImages = ['hero-1', 'hero-2', 'hero-3'].map(id => sliderImages.find(img => img.id === id)).filter(Boolean) as typeof sliderImages;

  return (
    <section className="w-full bg-background">
      <Carousel
        className="w-full"
        opts={{
          loop: true,
        }}
      >
        <CarouselContent className="h-[400px] md:h-[500px] lg:h-[600px]">
          {orderedImages.map((image, index) => {
            const slide = slideData[index % slideData.length];
            return(
              <CarouselItem key={image.id}>
                <div className="relative h-full w-full overflow-hidden">
                   <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover h-full w-full brightness-75"
                      data-ai-hint={image.imageHint}
                      sizes="100vw"
                    />
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-white text-center pb-12">
                      <div className='bg-black/40 p-6 rounded-lg'>
                        <h1 className="text-3xl md:text-5xl font-extrabold font-headline mb-4">
                            {slide.textTitle}
                        </h1>
                        <p className="text-lg md:text-xl max-w-xl">
                            {slide.textDescription}
                        </p>
                      </div>
                  </div>
                </div>
              </CarouselItem>
            )
          })}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
      </Carousel>
    </section>
  );
}
