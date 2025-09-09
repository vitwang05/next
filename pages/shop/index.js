import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS_WITH_FILTERS } from "../../graphql/queries/products";
import { GET_CATEGORIES } from "../../graphql/queries/categories";
import { useState } from "react";
import ProductCard from "../../components/ProductCard";

export default function ShopPage() {
  const router = useRouter();
  const { category, q } = router.query || {};

  const { data: catsData } = useQuery(GET_CATEGORIES);
  const categories = catsData?.productCategories?.nodes || [];

  const { loading, error, data, fetchMore } = useQuery(GET_PRODUCTS_WITH_FILTERS, {
    variables: {
      first: 24,
      search: typeof q === "string" ? q : undefined,
      category: typeof category === "string" ? category : undefined,
    },
    notifyOnNetworkStatusChange: true,
  });

  const products = data?.products?.nodes || [];
  const pageInfo = data?.products?.pageInfo;

  const applyCategory = (slug) => {
    const next = { pathname: "/shop", query: { ...router.query, category: slug } };
    router.push(next, undefined, { shallow: true });
  };

  const clearFilters = () => {
    router.push({ pathname: "/shop" }, undefined, { shallow: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-3 space-y-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-900">Bộ lọc</h2>
              <button className="text-sm text-gray-500 hover:text-gray-700" onClick={clearFilters}>Xóa</button>
            </div>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                <SearchBox defaultValue={typeof q === "string" ? q : ""} onSubmit={(value) => {
                  router.push({ pathname: "/shop", query: { ...router.query, q: value || undefined } }, undefined, { shallow: true });
                }} />
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Danh mục</h3>
            <div className="max-h-80 overflow-auto space-y-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => applyCategory(c.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg border transition ${category === c.slug ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"}`}
                >
                  {c.name}
                </button>
              ))}
              {categories.length === 0 && (
                <div className="text-sm text-gray-500">Không có danh mục</div>
              )}
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <section className="md:col-span-9">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Tất cả sản phẩm</h1>
            {typeof category === "string" && (
              <span className="text-sm text-gray-600">Bộ lọc: {category}</span>
            )}
          </div>

          {loading && products.length === 0 ? (
            <p className="p-4 text-gray-600">Đang tải...</p>
          ) : error ? (
            <p className="p-4 text-red-600">Lỗi: {error.message}</p>
          ) : products.length === 0 ? (
            <p className="p-4 text-gray-600">Không có sản phẩm phù hợp.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pageInfo?.hasNextPage && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => fetchMore({ variables: { after: pageInfo.endCursor } })}
                className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50"
              >
                Tải thêm
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function SearchBox({ defaultValue, onSubmit }) {
  const [value, setValue] = useState(defaultValue || "");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(value.trim());
      }}
      className="flex items-center gap-2"
    >
      <input
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
        placeholder="Tìm tên sản phẩm..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button className="px-3 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800">Tìm</button>
    </form>
  );
}


