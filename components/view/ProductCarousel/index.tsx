"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ImageEdge } from "@/types/shopify-graphql";

export default function ProductCarousel({ images }: { images: ImageEdge[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [mainCarouselRef, mainEmblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const scrollPrev = useCallback(() => {
    if (mainEmblaApi) mainEmblaApi.scrollPrev();
  }, [mainEmblaApi]);

  const scrollNext = useCallback(() => {
    if (mainEmblaApi) mainEmblaApi.scrollNext();
  }, [mainEmblaApi]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainEmblaApi) return;
      mainEmblaApi.scrollTo(index);
      setSelectedIndex(index);
    },
    [mainEmblaApi]
  );

  const onSelect = useCallback(() => {
    if (!mainEmblaApi) return;
    setSelectedIndex(mainEmblaApi.selectedScrollSnap());
  }, [mainEmblaApi]);

  useEffect(() => {
    if (!mainEmblaApi) return;
    onSelect();
    mainEmblaApi.on("select", onSelect);
    return () => {
      mainEmblaApi.off("select", onSelect);
    };
  }, [mainEmblaApi, onSelect]);

  if (!images?.length) return null;

  return (
    <div className="flex gap-4 md:gap-6 lg:gap-8 h-full lg:sticky lg:top-28">
      {/* Thumbnail Column - Visible from MD up */}
      <div className="hidden md:flex flex-col gap-3 w-16 lg:w-20 shrink-0">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => onThumbClick(index)}
            className={cn(
              "relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg transition-all duration-300",
              selectedIndex === index
                ? "ring-2 ring-black ring-offset-2 opacity-100"
                : "opacity-40 hover:opacity-100"
            )}
          >
            <Image
              fill
              src={image.node.url}
              alt={image.node.altText ?? ""}
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* Main Image Viewport */}
      <div className="relative flex-1 group">
        <div className="overflow-hidden rounded-3xl bg-gray-50 h-full aspect-[3/4] md:h-[500px] lg:h-[700px]" ref={mainCarouselRef}>
          <div className="flex h-full">
            {images.map((image, index) => (
              <div className="relative flex-[0_0_100%] min-w-0" key={index}>
                <Image
                  fill
                  src={image.node.url}
                  alt={image.node.altText ?? ""}
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Controls (Subtle) */}
        {images.length > 1 && (
          <>
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white active:scale-90"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white active:scale-90"
              onClick={scrollNext}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Mobile Pagination Dots - Only visible on small screens */}
        <div className="flex md:hidden justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                selectedIndex === index ? "bg-black w-4" : "bg-gray-300"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

