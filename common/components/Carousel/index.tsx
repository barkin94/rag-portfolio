"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaCarouselType } from "embla-carousel";

const carouselStyles = `
  .embla__slide {
    flex: 0 0 320px;
    min-width: 320px;
    max-width: 320px;
  }
`;

interface CarouselProps {
  slides: React.ReactNode[];
  autoplay?: boolean;
  loop?: boolean;
  showIndicators?: boolean;
  className?: string;
  scrollSpeed?: number;
}

export default function Carousel({
  slides,
  autoplay = true,
  loop = true,
  showIndicators = true,
  className = "",
  scrollSpeed = 800,
}: CarouselProps) {
  const spaceBetween = 32;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [api, setApi] = useState<EmblaCarouselType | undefined>();

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop,
      align: "start",
      slidesToScroll: 1,
      watchDrag: true,
      duration: scrollSpeed,
      containScroll: "keepSnaps",
      watchResize: true,
      watchSlides: true,
      slides: ".embla__slide",
      startIndex: 0,

    },
    [
      Autoplay({
        playOnInit: autoplay,
        delay: 3000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
      }),
    ],
  );

  useEffect(() => {
    if (emblaApi) setApi(emblaApi);
  }, [emblaApi]);

  const autoplayApi = api?.plugins().autoplay;

  const handleMouseEnter = useCallback(() => {
    autoplayApi?.stop();
  }, [autoplayApi]);

  const handleMouseLeave = useCallback(() => {
    autoplayApi?.play();
  }, [autoplayApi]);

  useEffect(() => {
    if (!api) return;

    const onInit = () => {
      const snaps = api.scrollSnapList();
      setScrollSnaps(snaps);
      setSelectedIndex(api.selectedScrollSnap());
    };
    const onSelect = () => {
      const newIndex = api.selectedScrollSnap();
      setSelectedIndex((prev) => (prev === newIndex ? prev : newIndex));
    };
    const onResize = () => {
      const snaps = api.scrollSnapList();
      setScrollSnaps(snaps);
    };

    api.on("init", onInit);
    api.on("select", onSelect);
    api.on("resize", onResize);

    onInit();

    return () => {
      api.off("init", onInit);
      api.off("select", onSelect);
      api.off("resize", onResize);
    };
  }, [api]);

return (
    <>
      <style
        dangerouslySetInnerHTML={{ __html: carouselStyles }}
      />
      <div
        className={`${className} overflow-visible`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="container px-4 max-w-4xl relative overflow-visible">
          <div className="overflow-hidden" ref={emblaRef}>
          <div
            className="flex"
            style={{
              columnGap: `${spaceBetween}px`,
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className="embla__slide flex-[0_0_auto] h-auto overflow-visible shrink-0"
                style={{
                  padding: `0 calc(${spaceBetween}px / 2) 24px`,
                }}
              >
                {slide}
              </div>
            ))}
          </div>
        </div>

        {showIndicators && scrollSnaps.length > 1 && (
          <div
            className="flex justify-center gap-2 mt-6"
            role="tablist"
            aria-label="Carousel pagination"
          >
            {scrollSnaps.map((_, snapIndex) => (
              <button
                  key={snapIndex}
                  className={`
                    w-2 h-2 rounded-full transition-colors duration-200 cursor-pointer
                    ${selectedIndex === snapIndex
                      ? "bg-slate-900 dark:bg-slate-100"
                      : "bg-slate-300 dark:bg-slate-600"
                    }
                  `}
                  onClick={() => api?.scrollTo(snapIndex)}
                  role="tab"
                  aria-selected={selectedIndex === snapIndex}
                  aria-label={`Go to slide ${snapIndex + 1}`}
                />
            ))}
          </div>
        )}
      </div>
    </div>
  </>
  );
}
