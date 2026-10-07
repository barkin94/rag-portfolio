"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useBreakpoints } from "../../hooks/useBreakpoints";
import type { EmblaCarouselType } from "embla-carousel";

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
  scrollSpeed = 12000,
}: CarouselProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [api, setApi] = useState<EmblaCarouselType | undefined>();

  const isMobile = useBreakpoints(640);
  const isTablet = useBreakpoints(1024);

  const getSlidesPerView = useCallback(() => {
    if (isTablet) return 3;
    if (isMobile) return 2;
    return 1;
  }, [isMobile, isTablet]);

  const getSpaceBetween = useCallback(() => {
    if (isTablet) return 32;
    if (isMobile) return 16;
    return 32;
  }, [isMobile, isTablet]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop, align: "start", slidesToScroll: 1, watchDrag: true, duration: scrollSpeed, containScroll: "keepSnaps", watchResize: true, watchSlides: true, slides: ".embla__slide" },
    [Autoplay({ playOnInit: autoplay, delay: 0, stopOnInteraction: false, stopOnMouseEnter: true, stopOnFocusIn: true })]
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
      setSelectedIndex(api.selectedScrollSnap());
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

  const slidesToShow = getSlidesPerView();
  const spaceBetween = getSpaceBetween();

return (
    <div
      className={`${className} overflow-visible`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-[1200px] mx-auto relative overflow-visible">
        <div
          className="overflow-hidden"
          ref={emblaRef}
        >
          <div
            className="flex"
            style={{
              gap: `${spaceBetween}px`,
              margin: `0 calc(${spaceBetween}px / -2)`,
            }}
          >
            {slides.map((slide, index) => (
              <div
                key={index}
                className="embla__slide flex-[0_0_auto] h-auto overflow-visible"
                style={{
                  width: `calc(100% / ${slidesToShow} - ${spaceBetween}px)`,
                  padding: `0 calc(${spaceBetween}px / 2)`,
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
                  w-2 h-2 rounded-full transition-colors duration-200
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
  );
}