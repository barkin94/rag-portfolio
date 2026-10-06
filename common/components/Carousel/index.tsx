"use client";

import React, { useRef, useCallback } from "react";
import { Swiper as SwiperComponent, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, FreeMode } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import type { SwiperRef } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

interface CarouselProps {
  children: React.ReactNode;
  autoplay?: boolean;
  loop?: boolean;
  showIndicators?: boolean;
  className?: string;
  scrollSpeed?: number;
}

export default function Carousel({
  children,
  autoplay = true,
  loop = true,
  showIndicators = true,
  className = "",
  scrollSpeed = 12000,
}: CarouselProps) {
  const swiperRef = useRef<SwiperRef | null>(null);
  const slides = React.Children.toArray(children);

  const handleMouseEnter = useCallback(() => {
    swiperRef.current?.swiper.autoplay.stop();
  }, []);

  const handleMouseLeave = useCallback(() => {
    swiperRef.current?.swiper.autoplay.start();
  }, []);

  return (
    <div
      className={`${className} overflow-visible`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SwiperComponent
        ref={swiperRef}
        modules={[Autoplay, Pagination, FreeMode]}
        spaceBetween={32}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 32,
          },
        }}
        freeMode={{ sticky: false }}
        autoplay={{
          enabled: autoplay,
          delay: 1,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        speed={scrollSpeed}
        loop={loop}
        pagination={{
          enabled: showIndicators,
          clickable: true,
          bulletClass:
            "swiper-pagination-bullet w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 transition-colors duration-200",
          bulletActiveClass: "swiper-pagination-bullet-active bg-slate-900 dark:bg-slate-100",
        }}
        wrapperClass="overflow-visible"
        className="max-w-[1200px] mx-auto relative overflow-visible"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="h-auto overflow-visible">
            {slide}
          </SwiperSlide>
        ))}
      </SwiperComponent>
    </div>
  );
}
