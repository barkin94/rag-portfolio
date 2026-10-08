"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import type { EmblaCarouselType } from "embla-carousel";

export interface CarouselLayout {
  slidesPerView: { base: number; sm?: number; md?: number; lg?: number };
  gap: number;
}

interface CarouselProps {
  slides: React.ReactNode[];
  autoplay?: boolean;
  loop?: boolean;
  showIndicators?: boolean;
  className?: string;
  scrollSpeed?: number;
  layout: CarouselLayout;
}

function computeSlideWidths(
  layout: CarouselLayout,
  containerWidth: number
): { width: string; media?: string }[] {
  const { slidesPerView, gap } = layout;
  const gapPx = gap * 4;
  const breakpoints = { sm: 640, md: 768, lg: 1024 };
  const result: { width: string; media?: string }[] = [];

  const baseWidth = `calc((100% - ${gapPx * (slidesPerView.base - 1)}px) / ${slidesPerView.base})`;
  result.push({ width: baseWidth });

  if (slidesPerView.sm) {
    const w = `calc((100% - ${gapPx * (slidesPerView.sm - 1)}px) / ${slidesPerView.sm})`;
    result.push({ width: w, media: `(min-width: ${breakpoints.sm}px)` });
  }
  if (slidesPerView.md) {
    const w = `calc((100% - ${gapPx * (slidesPerView.md - 1)}px) / ${slidesPerView.md})`;
    result.push({ width: w, media: `(min-width: ${breakpoints.md}px)` });
  }
  if (slidesPerView.lg) {
    const w = `calc((100% - ${gapPx * (slidesPerView.lg - 1)}px) / ${slidesPerView.lg})`;
    result.push({ width: w, media: `(min-width: ${breakpoints.lg}px)` });
  }

  return result;
}

export default function Carousel({
  slides,
  autoplay = true,
  loop = true,
  showIndicators = true,
  className = "",
  scrollSpeed = 800,
  layout,
}: CarouselProps) {
  const gapPx = layout.gap * 4;
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
      slides: "[data-embla-slide]",
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

  const slideWidthConfigs = computeSlideWidths(layout, 0);

  const styleSheet = slideWidthConfigs
    .filter((c) => c.media)
    .map((c) => `@media ${c.media} { [data-embla-slide] { width: ${c.width}; } }`)
    .join(" ");

  const baseWidth = slideWidthConfigs[0]?.width || "auto";

  const css = `[data-embla-slide]{width:${baseWidth};flex-shrink:0}${styleSheet}`;

  return (
    <>
      <style
        id="carousel-layout"
        dangerouslySetInnerHTML={{ __html: css }}
      />
      <div
        className={`${className} overflow-visible`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="overflow-visible">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex" style={{ columnGap: `${gapPx}px` }}>
              {slides.map((slide, index) => (
                <div
                  key={index}
                  data-embla-slide
                  className="h-auto overflow-visible"
                  style={{
                    padding: `0 calc(${gapPx}px / 2) 24px`,
                  }}
                >
                  {slide}
                </div>
              ))}
            </div>
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
    </>
  );
}
