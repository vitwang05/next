import useEmblaCarousel from "embla-carousel-react";
import Link from "next/link";
import { useCallback } from "react";

export default function CategoryCarousel({ items }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    dragFree: true,
    align: "start",
    slidesToScroll: 1,
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {items.map((cat) => (
            <Link key={cat.name} href={{ pathname: "/shop", query: { category: cat.name } }} className="group flex-[0_0_auto] w-48 sm:w-56">
              <div className="relative h-36 rounded-2xl overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white font-semibold">{cat.name}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="hidden sm:flex absolute inset-y-0 left-0 items-center pl-1">
        <button onClick={scrollPrev} className="btn-secondary !p-2 rounded-full shadow-sm" aria-label="Prev">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
        </button>
      </div>
      <div className="hidden sm:flex absolute inset-y-0 right-0 items-center pr-1">
        <button onClick={scrollNext} className="btn-secondary !p-2 rounded-full shadow-sm" aria-label="Next">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  );
}
