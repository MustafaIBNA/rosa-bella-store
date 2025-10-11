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
  const layouts = [
    // Layout 1: Text on Left, Image on Right
    {
      textContainerClasses: "md:w-1/2 justify-center items-start text-left pl-12",
      textTitle: "Artistry in Every Detail",
      textDescription: "Discover the unique beauty of Rosabella's handcrafted coasters and home decor.",
      imageContainerClasses: "md:w-1/2 p-8",
      imageClasses: "object-contain h-full w-full rounded-lg shadow-2xl",
    },
    // Layout 2: Image on Left, Text on Right
    {
      textContainerClasses: "md:w-1/2 justify-center items-end text-right pr-12",
      textTitle: "Handcrafted Elegance",
      textDescription: "Elevate your space with pieces that blend traditional craftsmanship with modern design.",
      imageContainerClasses: "md:w-1/2 p-8",
      imageClasses: "object-contain h-full w-full rounded-lg shadow-2xl",
    },
    // Layout 3: Text centered, Image background
    {
      textContainerClasses: "w-full justify-center items-center text-center px-4",
      textTitle: "Timeless Designs",
      textDescription: "From our hands to your home, experience the quality of artisan-made goods.",
      imageContainerClasses: "absolute inset-0 z-[-1]",
      imageClasses: "object-cover h-full w-full opacity-30",
    }
  ];
  
  // Ensure we have a defined order for the images
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
            const layout = layouts[index % layouts.length];
            const isTextFirst = index % 2 === 1;

            return(
              <CarouselItem key={image.id}>
                <div className="relative h-full w-full overflow-hidden">
                  <div className={`flex h-full w-full flex-col md:flex-row ${isTextFirst ? 'md:flex-row-reverse' : ''}`}>
                    <div className={`flex flex-col text-foreground ${layout.textContainerClasses}`}>
                      <h1 className="text-3xl md:text-5xl font-extrabold font-headline mb-4">
                        {layout.textTitle}
                      </h1>
                      <p className="text-lg md:text-xl max-w-xl">
                        {layout.textDescription}
                      </p>
                    </div>
                    <div className={`relative h-1/2 md:h-full ${layout.imageContainerClasses}`}>
                      <Image
                        src={image.imageUrl}
                        alt={image.description}
                        fill
                        className={layout.imageClasses}
                        data-ai-hint={image.imageHint}
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
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
