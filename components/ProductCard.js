import Link from "next/link";

export default function ProductCard({ product, className = "" }) {
  if (!product) return null;

  return (
    <div className={`group bg-white rounded-3xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden ${className}`}>
      
      {/* Image container */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-3xl">
        {product.onSale && (
          <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 shadow-sm">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3l2.4 4.864 5.368.78-3.884 3.787.917 5.348L12 15.896 7.2 17.78l.917-5.348L4.233 8.644l5.368-.78L12 3z" />
            </svg>
            SALE
          </span>
        )}
        {product.image?.sourceUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image.sourceUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Hover gradient overlay (desktop only) */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />

        {/* Hover action buttons (desktop only) */}
        <div className="hidden md:flex absolute inset-x-0 bottom-4 items-center justify-center gap-3 md:opacity-0 md:group-hover:opacity-100 md:translate-y-3 md:group-hover:translate-y-0 transition-all duration-300">
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 backdrop-blur-md text-gray-900 hover:bg-white font-medium"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </Link>
          <Link
            href={`/product/${product.slug}`}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-800 font-medium"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3h2l.4 2M7 13h10l3-8H6.4"/>
              <circle cx="9" cy="19" r="2"/>
              <circle cx="17" cy="19" r="2"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* Product details */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{product.name}</h3>

        {/* {product.description && (
          <div
            className="text-sm text-gray-600 mt-2 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )} */}

        <div className="mt-4 flex items-center justify-between">
          <div className="text-blue-600 font-bold text-lg" dangerouslySetInnerHTML={{
            __html: product.price || product.regularPrice || "Liên hệ"
          }} />

          {product.onSale && product.salePrice && (
            <span className="text-gray-400 line-through text-sm" dangerouslySetInnerHTML={{ __html: product.regularPrice }} />
          )}
        </div>

        {/* Mobile detail button (no hover on mobile) */}
        <Link
          href={`/product/${product.slug}`}
          className="md:hidden mt-4 w-full bg-gray-900 text-white py-2 rounded-xl hover:bg-gray-800 text-center block"
        >
          Xem chi tiết
        </Link>
      </div>
    </div>
  );
}
