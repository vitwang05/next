import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import { GET_PRODUCT } from "../../graphql/queries/product";

export default function ProductDetailPage() {
  const router = useRouter();
  const { slug } = router.query || {};

  const { loading, error, data } = useQuery(GET_PRODUCT, {
    skip: !slug,
    variables: { slug },
  });

  if (!slug) {
    return <p className="p-8 text-gray-600">Đang tải...</p>;
  }

  if (loading) {
    return <p className="p-8 text-gray-600">Đang tải sản phẩm...</p>;
  }

  if (error) {
    return <p className="p-8 text-red-600">Lỗi: {error.message}</p>;
  }

  const product = data?.product;

  if (!product) {
    return <p className="p-8">Không tìm thấy sản phẩm.</p>;
  }

  // Lấy giá phù hợp theo loại sản phẩm
  let priceContent = "Liên hệ";
  if (product.__typename === "ExternalProduct") {
    priceContent = `<a href="${product.externalUrl}" target="_blank" rel="noopener noreferrer">Mua tại website</a>`;
  } else if (product.price || product.regularPrice) {
    priceContent = product.price || product.regularPrice;
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

          {/* Nút thêm giỏ hàng (ẩn nếu ExternalProduct) */}
          {product.__typename !== "ExternalProduct" && (
            <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition">
              Thêm vào giỏ hàng
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
