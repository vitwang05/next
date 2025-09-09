import Link from "next/link";

export default function ProductCard({ product, className = "" }) {
  if (!product) return null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className={`bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col ${className}`}
    >
      <div className="relative">
        {product.onSale && (
          <span className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-red-100 text-red-700 border border-red-200">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 3l2.4 4.864 5.368.78-3.884 3.787.917 5.348L12 15.896 7.2 17.78l.917-5.348L4.233 8.644l5.368-.78L12 3z" />
            </svg>
            Sale
          </span>
        )}
        {product.image?.sourceUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={product.image.sourceUrl}
          alt={product.name}
          className="w-full h-48 object-cover rounded-xl"
        />
        )}
      </div>

      <h3 className="mt-4 text-base font-semibold line-clamp-1">{product.name}</h3>

      {product.description && (
        <div
          className="text-sm text-gray-600 mt-1 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: product.description }}
        />
      )}

      <div
        className="mt-auto text-blue-600 font-semibold text-lg"
        dangerouslySetInnerHTML={{
          __html: product.price || product.regularPrice || "Liên hệ",
        }}
      />

      <button className="mt-4 w-full bg-gray-900 text-white py-2 rounded-xl hover:bg-gray-800 transition">
        Xem chi tiết
      </button>
    </Link>
  );
}


