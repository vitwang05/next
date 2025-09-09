import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS } from "../graphql/queries/products";
import ProductCard from "../components/ProductCard";

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
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
