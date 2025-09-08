import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS } from "../graphql/queries/products";

export default function Home() {
  const { loading, error, data } = useQuery(GET_PRODUCTS);

  if (loading) return <p className="p-8 text-gray-600">Đang tải sản phẩm...</p>;
  if (error) return <p className="p-8 text-red-600">Lỗi: {error.message}</p>;

  const products = data?.products?.nodes || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow p-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">🛍️ My Shop</h1>
      </header>

      {/* Main */}
      <main className="p-8 max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold mb-6">Sản phẩm nổi bật</h2>

        {products.length === 0 ? (
          <p>Không có sản phẩm nào.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <a
                key={product.id}
                href={`/product/${product.slug}`}
                className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4 flex flex-col"
              >
                {product.image?.sourceUrl && (
                  <img
                    src={product.image.sourceUrl}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                )}
                <h3 className="mt-4 text-lg font-bold line-clamp-1">
                  {product.name}
                </h3>
                <div
                  className="text-sm text-gray-600 mt-2 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
                <p className="mt-auto text-blue-600 font-semibold text-lg" dangerouslySetInnerHTML={{
                  __html: product.price || product.regularPrice || "Liên hệ",
                }} />
                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition">
                  Xem chi tiết
                </button>
              </a>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
