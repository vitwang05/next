import { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

const slides = [
  {
    title: "Just Do It.",
    subtitle: "Bộ sưu tập mới",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2000&auto=format&fit=crop",
    ctaPrimary: { href: "#new", label: "Mua hàng mới" },
    ctaSecondary: { href: "#popular", label: "Bán chạy" },
  },
  {
    title: "Run the Day",
    subtitle: "Hiệu năng tối đa",
    image: "https://images.unsplash.com/photo-1549049950-48d5887197bd?q=80&w=2000&auto=format&fit=crop",
    ctaPrimary: { href: "/shop?category=Chạy", label: "Giày chạy" },
    ctaSecondary: { href: "/shop", label: "Khám phá" },
  },
  {
    title: "Own the Court",
    subtitle: "Bóng rổ",
    image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=2000&auto=format&fit=crop",
    ctaPrimary: { href: "/shop?category=Bóng rổ", label: "Bắt đầu" },
    ctaSecondary: { href: "/shop", label: "Xem thêm" },
  },
];

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
  }, [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
        <div className="flex">
          {slides.map((s, i) => (
            <div className="min-w-0 flex-[0_0_100%]" key={i}>
              <div className="relative h-[56vw] max-h-[560px] bg-gray-900 text-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                <div className="relative px-6 sm:px-12 lg:px-16 py-12 sm:py-16 lg:py-20">
                  <div className="max-w-2xl">
                    <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                      {s.title} <span className="block text-white/90">{s.subtitle}</span>
                    </h1>
                    <div className="mt-6 flex gap-3">
                      <Link href={s.ctaPrimary.href} className="btn-primary">{s.ctaPrimary.label}</Link>
                      <Link href={s.ctaSecondary.href} className="btn-secondary">{s.ctaSecondary.label}</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2 sm:px-4">
        <button onClick={scrollPrev} className="pointer-events-auto btn-secondary !p-2 rounded-full" aria-label="Prev">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
        <button onClick={scrollNext} className="pointer-events-auto btn-secondary !p-2 rounded-full" aria-label="Next">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
}
