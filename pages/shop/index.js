import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCTS_WITH_FILTERS } from "../../graphql/queries/products";
import { GET_CATEGORIES } from "../../graphql/queries/categories";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "../../components/ProductCard";

export default function ShopPage() {
  const router = useRouter();
  const { category, q } = router.query || {};

  // Page size (can be adjusted)
  const PAGE_SIZE = 12;

  // Memoized variables to avoid re-renders
  const variables = useMemo(() => ({
    first: PAGE_SIZE,
    search: typeof q === "string" ? q : undefined,
    category: typeof category === "string" ? category : undefined,
  }), [PAGE_SIZE, category, q]);

  const { data: catsData } = useQuery(GET_CATEGORIES, { fetchPolicy: "cache-first" });
  const categories = catsData?.productCategories?.nodes || [];

  const { loading, error, data, fetchMore, networkStatus } = useQuery(GET_PRODUCTS_WITH_FILTERS, {
    variables,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
  });

  const products = data?.products?.nodes || [];
  const pageInfo = data?.products?.pageInfo;

  const isLoadingMore = networkStatus === 3; // Apollo: 3 = setVariables/fetchMore

  // Infinite scroll sentinel
  const loadMoreRef = useRef(null);
  const listScrollRef = useRef(null);

  const handleFetchMore = useCallback(() => {
    if (!pageInfo?.hasNextPage || isLoadingMore) return;
    fetchMore({
      variables: { after: pageInfo.endCursor, ...variables },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          products: {
            __typename: prev.products.__typename,
            pageInfo: fetchMoreResult.products.pageInfo,
            nodes: [...prev.products.nodes, ...fetchMoreResult.products.nodes],
          },
        };
      },
    });
  }, [fetchMore, isLoadingMore, pageInfo, variables]);

  // IntersectionObserver for auto load more (root is the list scroll container)
  useEffect(() => {
    if (!loadMoreRef.current) return;
    if (!pageInfo?.hasNextPage) return;
    const el = loadMoreRef.current;
    const rootEl = listScrollRef.current || null;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        handleFetchMore();
      }
    }, { root: rootEl, rootMargin: "200px" });
    observer.observe(el);
    return () => observer.unobserve(el);
  }, [handleFetchMore, pageInfo?.hasNextPage]);

  const applyCategory = (slug) => {
    const next = { pathname: "/shop", query: { ...router.query, category: slug } };
    router.push(next, undefined, { shallow: true });
  };

  const clearFilters = () => {
    router.push({ pathname: "/shop" }, undefined, { shallow: true });
  };

  // Mobile sidebar toggle
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:block md:col-span-3 space-y-4">
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
          {/* Mobile toolbar */}
          <div className="md:hidden flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-gray-900">Tất cả sản phẩm</h1>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white text-gray-700"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M6 12h12M10 18h4"/></svg>
              Bộ lọc
            </button>
          </div>

          {typeof category === "string" && (
            <div className="hidden md:flex items-center justify-between mb-4">
              <h1 className="text-xl font-semibold text-gray-900">Tất cả sản phẩm</h1>
              <span className="text-sm text-gray-600">Bộ lọc: {category}</span>
            </div>
          )}

          <div ref={listScrollRef} data-scroll-root className="max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
            {loading && products.length === 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className="border border-gray-200 rounded-2xl p-4 animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-lg mb-3" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
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

            {/* Load more / Sentinel */}
            <div className="mt-8 flex justify-center">
              {pageInfo?.hasNextPage ? (
                <button
                  onClick={handleFetchMore}
                  disabled={isLoadingMore}
                  className="px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-60"
                >
                  {isLoadingMore ? "Đang tải..." : "Tải thêm"}
                </button>
              ) : (
                products.length > 0 && <span className="text-sm text-gray-500">Đã hiển thị tất cả sản phẩm</span>
              )}
            </div>

            {/* Invisible sentinel for auto load more */}
            {pageInfo?.hasNextPage && (
              <div ref={loadMoreRef} className="h-1" />
            )}
          </div>
        </section>
      </main>

      {/* Mobile filter drawer */}
      {isFilterOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsFilterOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] bg-white shadow-xl border-r border-gray-200 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-gray-900">Bộ lọc</h2>
              <button onClick={() => setIsFilterOpen(false)} className="p-2 rounded-lg hover:bg-gray-50">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
                <SearchBox defaultValue={typeof q === "string" ? q : ""} onSubmit={(value) => {
                  router.push({ pathname: "/shop", query: { ...router.query, q: value || undefined } }, undefined, { shallow: true });
                }} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Danh mục</h3>
                <div className="max-h-80 overflow-auto space-y-1">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { applyCategory(c.slug); setIsFilterOpen(false); }}
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

              <button onClick={() => { clearFilters(); setIsFilterOpen(false); }} className="w-full px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50">Xóa bộ lọc</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchBox({ defaultValue, onSubmit }) {
  const [value, setValue] = useState(defaultValue || "");
  // Debounce submit for better UX
  useEffect(() => {
    const id = setTimeout(() => {
      onSubmit?.(value.trim());
    }, 350);
    return () => clearTimeout(id);
  }, [value, onSubmit]);
  return (
    <div className="flex items-center gap-2">
      <input
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
        placeholder="Tìm tên sản phẩm..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        onClick={() => onSubmit?.(value.trim())}
        className="px-3 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800"
      >
        Tìm
      </button>
    </div>
  );
}


