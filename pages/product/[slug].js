import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client/react";
import { useState, useMemo, useRef } from "react";
import { GET_PRODUCT, GET_RELATED_PRODUCTS } from "../../graphql/queries/product";
import { ADD_TO_CART } from "../../graphql/mutations/cart";
import ProductCard from "../../components/ProductCard";
import RelatedProductsCarousel from "../../components/RelatedProductsCarousel";

export default function ProductDetailPage() {
  const router = useRouter();
  const { slug } = router.query || {};

  const { loading, error, data } = useQuery(GET_PRODUCT, {
    skip: !slug,
    variables: { slug },
  });

  const [addToCart, { loading: adding }] = useMutation(ADD_TO_CART);

  // Get related products
  const product = data?.product;
  const categorySlugs = product?.productCategories?.nodes?.map(cat => cat.slug) || [];
  const { data: relatedData, loading: relatedLoading } = useQuery(GET_RELATED_PRODUCTS, {
    skip: !product || categorySlugs.length === 0,
    variables: {
      categorySlugs,
      first: 8
    }
  });

  // Slider ref for related products
  const relatedSliderRef = useRef(null);
  const scrollRelatedSlider = (direction) => {
    const container = relatedSliderRef.current;
    if (!container) return;
    const amount = Math.max(300, container.clientWidth * 0.75);
    container.scrollBy({ left: direction === "next" ? amount : -amount, behavior: "smooth" });
  };

  // State for variable products (attributes)
  const isVariable = product?.__typename === "VariableProduct";
  // Derive available attribute options from variations to ensure accuracy
  const { colors, sizes } = useMemo(() => {
    const result = { colors: [], sizes: [] };
    if (!isVariable) return result;
    const toSlug = (val) =>
      (val || "")
        .toString()
        .trim()
        .toLowerCase()
        .replace(/^attribute_/, "")
        .replace(/\s+/g, "-")
        .replace(/_/g, "-");
    const normalizeAttrName = (name) => {
      const n = toSlug(name);
      if (n.startsWith("pa-")) return n; // keep dash form for set keys
      if (n.includes("color")) return "pa-color";
      if (n.includes("size")) return "pa-size";
      return n;
    };
    const colorSet = new Set();
    const sizeSet = new Set();
    const vars = product?.variations?.nodes || [];
    for (const v of vars) {
      const attrs = v.attributes?.nodes || [];
      for (const a of attrs) {
        const key = normalizeAttrName(a?.name);
        const val = toSlug(a?.value);
        if (!val) continue;
        if (key === "pa-color" || key === "pa_color" || key === "color")
          colorSet.add(val);
        if (key === "pa-size" || key === "pa_size" || key === "size")
          sizeSet.add(val);
      }
    }
    // Fallback to product-level lists if variations didn't expose options
    if (colorSet.size === 0) {
      const list = (
        product?.allPaColor?.nodes ||
        product?.allPaColors?.nodes ||
        []
      )
        .map((n) => toSlug(n?.name))
        .filter(Boolean);
      list.forEach((v) => colorSet.add(v));
    }
    if (sizeSet.size === 0) {
      const list = (
        product?.allPaSize?.nodes ||
        product?.allPaSizes?.nodes ||
        []
      )
        .map((n) => toSlug(n?.name))
        .filter(Boolean);
      list.forEach((v) => sizeSet.add(v));
    }
    return { colors: Array.from(colorSet), sizes: Array.from(sizeSet) };
  }, [isVariable, product]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);
  const selectedVariation = useMemo(() => {
    if (!isVariable) return null;
    const vars = product?.variations?.nodes || [];

    const toSlug = (val) =>
      (val || "")
        .toString()
        .trim()
        .toLowerCase()
        .replace(/^attribute_/, "")
        .replace(/\s+/g, "-")
        .replace(/_/g, "-");

    const normalizeAttrName = (name) => {
      const slug = (name || "").toString().trim().toLowerCase();
      if (slug.includes("color")) return "pa_color";
      if (slug.includes("size")) return "pa_size";
      return slug.replace(/^attribute_/, "");
    };

    const selColor = toSlug(selectedColor);
    const selSize = toSlug(selectedSize);

    const match = vars.find((v) => {
      const attrs = (v.attributes?.nodes || []).reduce((acc, a) => {
        if (!a?.name) return acc;
        acc[normalizeAttrName(a.name)] = toSlug(a.value);
        return acc;
      }, {});

      const colorOk = selColor ? attrs["pa_color"] === selColor : true;
      const sizeOk = selSize ? attrs["pa_size"] === selSize : true;

      return colorOk && sizeOk;
    });

    // fallback
    return match || (vars.length === 1 ? vars[0] : null);
  }, [isVariable, product, selectedColor, selectedSize]);

  if (!slug) {
    return <p className="p-8 text-gray-600">Đang tải...</p>;
  }

  if (loading) {
    return <p className="p-8 text-gray-600">Đang tải sản phẩm...</p>;
  }

  if (error) {
    return <p className="p-8 text-red-600">Lỗi: {error.message}</p>;
  }

  // product already defined above

  if (!product) {
    return <p className="p-8">Không tìm thấy sản phẩm.</p>;
  }

  // Lấy giá phù hợp theo loại sản phẩm
  let priceContent = "Liên hệ";
  if (product.__typename === "ExternalProduct") {
    priceContent = `<a href="${product.externalUrl}" target="_blank" rel="noopener noreferrer">Mua tại website</a>`;
  } else if (
    isVariable &&
    selectedVariation &&
    (selectedVariation.price || selectedVariation.regularPrice)
  ) {
    priceContent = selectedVariation.price || selectedVariation.regularPrice;
  } else if (product.price || product.regularPrice) {
    priceContent = product.price || product.regularPrice;
  }

  const CONTACT_CHAT_URL =
    process.env.NEXT_PUBLIC_CONTACT_CHAT_URL || "https://m.me/yourpage";
  const isContactOnly = priceContent === "Liên hệ" || product.__typename === "ExternalProduct";

  async function handleAddToCart() {
    try {
      const safeQty = Math.max(1, Number(qty) || 1);
      const parentId = product?.databaseId;
      console.log(product.variations);
      if (!parentId) return;

      let input = {
        clientMutationId: String(Date.now()) + Math.random().toString(36).slice(2),
        productId: parentId,
        quantity: safeQty,
      };
      if (isVariable) {
        const variationId = selectedVariation?.databaseId;
        console.log("Selected variation:", selectedVariation);
        if (!variationId) {
          alert("Vui lòng chọn đủ thuộc tính trước khi thêm vào giỏ hàng.");
          return;
        }
        // Theo mẫu tham chiếu: dùng variationId làm productId khi là biến thể
        input = {
          clientMutationId: input.clientMutationId,
          productId: variationId,
          quantity: safeQty,
        };
      }

      console.log("AddToCart input:", input);
      console.log("Selected variation:", selectedVariation);
      const res = await addToCart({ variables: { input } });
      console.log("AddToCart result:", res);
      const ok = !!res?.data?.addToCart?.cartItem?.key;
      if (ok) {
        await router.push("/cart");
      }
    } catch (e) {
      console.error("Add to cart error:", e);
      alert(e.message || "Không thể thêm vào giỏ hàng");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Quay lại
          </Link>
        </div>
      </header>

      {/* Main content */}
      <main className="p-8 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Ảnh sản phẩm */}
        <div className="bg-white rounded-2xl shadow p-4">
          {product.image?.sourceUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image.sourceUrl}
              alt={product.name}
              className="w-full h-96 object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-96 bg-gray-200 rounded-xl" />
          )}
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex flex-col bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {product.name}
          </h2>

          {/* Giá hoặc link ngoài */}
          <div
            className="mt-2 text-blue-600 text-xl font-semibold"
            dangerouslySetInnerHTML={{ __html: priceContent }}
          />

          {/* Mô tả */}
          <div
            className="mt-4 prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: product.description || "" }}
          />

          {isVariable && (
            <div className="mt-6 space-y-4">
              {colors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Màu sắc
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-2 rounded-lg border text-sm ${
                          selectedColor === c
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {sizes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kích thước
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-3 py-2 rounded-lg border text-sm ${
                          selectedSize === s
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedVariation && (
                <div className="text-sm text-gray-600">
                  Biến thể đã chọn: {selectedVariation.name}
                </div>
              )}
            </div>
          )}

          {/* Số lượng */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số lượng
            </label>
            <div className="inline-flex items-center rounded-lg border border-gray-200 overflow-hidden">
              <button
                type="button"
                className="px-3 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setQty((q) => Math.max(1, Number(q) - 1))}
              >
                −
              </button>
              <input
                className="w-16 text-center outline-none py-2"
                type="number"
                min={1}
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
              <button
                type="button"
                className="px-3 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setQty((q) => (Number(q) || 1) + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Nút hành động theo giá */}
          {isContactOnly ? (
            <a
              href={CONTACT_CHAT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full inline-block text-center bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 transition"
            >
              Liên hệ
            </a>
          ) : (
            <button
              disabled={adding}
              onClick={handleAddToCart}
              className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-60"
            >
              {adding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
            </button>
          )}
        </div>
      </main>

      {/* Related Products Section */}
      {(() => {
        const related = (relatedData?.products?.nodes || []).filter(p => p?.id !== product?.id);
        if (related.length === 0) return null;
        return (
          <section className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Sản phẩm liên quan</h2>
                <div className="hidden md:flex gap-3">
                  <button
                    type="button"
                    onClick={() => scrollRelatedSlider("prev")}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    aria-label="Prev"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollRelatedSlider("next")}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    aria-label="Next"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </button>
                </div>
              </div>

              <RelatedProductsCarousel items={related} />
            </div>
          </section>
        );
      })()}
    </div>
  );
}
