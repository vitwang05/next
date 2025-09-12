import { useQuery } from "@apollo/client/react";
import {
  GET_NEW_ARRIVALS,
  GET_POPULAR_PRODUCTS,
} from "../graphql/queries/products";
import { GET_CATEGORIES } from "../graphql/queries/categories";
import ProductCard from "../components/ProductCard";
import Link from "next/link";
import HeroCarousel from "../components/HeroCarousel";
import CategoryCarousel from "../components/CategoryCarousel";

export default function Home() {
  const { data: newArrivalsData } = useQuery(GET_NEW_ARRIVALS, { variables: { first: 8 }, ssr: false });
  const { data: popularData } = useQuery(GET_POPULAR_PRODUCTS, { variables: { first: 8 }, ssr: false });
  const { data: categoriesData } = useQuery(GET_CATEGORIES, { ssr: false });

  const newArrivals = newArrivalsData?.products?.nodes || [];
  const popular = popularData?.products?.nodes || [];
  const categories = (categoriesData?.productCategories?.nodes || []).map(c => ({
    name: c.name,
    image: c.image?.sourceUrl || "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop",
    slug: c.slug,
  }));

  const isNewReady = newArrivals.length > 0;
  const isPopularReady = popular.length > 0;
  const isCatReady = categories.length > 0;

  return (
    <div>
      {/* Hero */}
      <section className="relative reveal show bg-white">
        <div className="container-responsive">
          <HeroCarousel />
        </div>
      </section>

      {/* Category scroller - gray */}
      <section aria-label="Danh mục" className="section reveal bg-gray-100">
        <div className="container-responsive">
          <div className="section-header">
            <h2 className="section-title">Danh mục nổi bật</h2>
            <Link href="/shop" className="text-sm font-medium text-gray-600 hover:text-gray-900">Xem tất cả</Link>
          </div>
          {isCatReady ? (
            <CategoryCarousel items={categories} />
          ) : (
            <div className="flex gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card-surface w-48 sm:w-56 h-36 animate-pulse" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals - white */}
      <section id="new" className="section reveal bg-white">
        <div className="container-responsive">
          <div className="section-header">
            <h2 className="section-title">Hàng mới về</h2>
            <Link href="/shop" className="text-sm font-medium text-gray-600 hover:text-gray-900">Xem tất cả</Link>
          </div>

          {!isNewReady ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card-surface h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {newArrivals.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Popular - gray */}
      <section id="popular" className="section reveal bg-gray-100">
        <div className="container-responsive">
          <div className="section-header">
            <h2 className="section-title">Bán chạy</h2>
            <Link href="/shop" className="text-sm font-medium text-gray-600 hover:text-gray-900">Xem tất cả</Link>
          </div>

        {!isPopularReady ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card-surface h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {popular.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA banner - white */}
      <section className="section reveal bg-white">
        <div className="container-responsive">
          <div className="card-surface p-8 sm:p-10 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold mb-2">Tham gia thành viên</h3>
            <p className="text-gray-600 mb-6">Nhận ưu đãi độc quyền, truy cập sớm và nhiều hơn nữa.</p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/" className="btn-primary">Đăng ký</Link>
              <Link href="/" className="btn-secondary">Đăng nhập</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
