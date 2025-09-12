import useEmblaCarousel from "embla-carousel-react";
import { useCallback } from "react";
import ProductCard from "./ProductCard";

export default function RelatedProductsCarousel({ items = [] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    align: "start",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (!items || items.length === 0) return null;

  return (
    <div className="relative">
      <div className="overflow-hidden py-6" ref={emblaRef}>
        <div className="flex gap-6">
          {items.map((p) => (
            <div key={p.id} className="flex-[0_0_auto] w-72 sm:w-80">
              <ProductCard product={p} className="w-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="hidden md:flex absolute inset-y-0 left-0 items-center pl-1">
        <button onClick={scrollPrev} className="btn-secondary !p-2 rounded-full shadow-sm" aria-label="Prev">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
      </div>
      <div className="hidden md:flex absolute inset-y-0 right-0 items-center pr-1">
        <button onClick={scrollNext} className="btn-secondary !p-2 rounded-full shadow-sm" aria-label="Next">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
}


