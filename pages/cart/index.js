import { useQuery, useMutation } from "@apollo/client/react";
import { GET_CART } from "../../graphql/queries/cart";
import { REMOVE_FROM_CART } from "../../graphql/mutations/cart";

export default function CartPage() {
  const { loading, error, data, refetch } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });
  const [removeItem, { loading: removing }] = useMutation(REMOVE_FROM_CART);
  console.log(data);
  const items = data?.cart?.contents?.nodes || [];
  const total = data?.cart?.total || "0";

  async function handleRemove(key) {
    try {
      await removeItem({ variables: { key } });
      await refetch();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Giỏ hàng</h1>

        {loading ? (
          <p className="text-gray-600">Đang tải giỏ hàng...</p>
        ) : error ? (
          <p className="text-red-600">Lỗi: {error.message}</p>
        ) : items.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 text-gray-700">Giỏ hàng trống.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const p = item.product?.node;
                const priceHtml = p?.price || p?.regularPrice || "";
                return (
                  <div key={item.key} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{p?.name}</div>
                      <div className="text-sm text-gray-600">SL: {item.quantity}</div>
                      <div className="text-sm text-blue-600" dangerouslySetInnerHTML={{ __html: priceHtml }} />
                    </div>
                    <button
                      disabled={removing}
                      onClick={() => handleRemove(item.key)}
                      className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-60"
                    >
                      Xóa
                    </button>
                  </div>
                );
              })}
            </div>
            <div>
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Tổng</span>
                  <span className="text-lg font-semibold text-gray-900" dangerouslySetInnerHTML={{ __html: total }} />
                </div>
                <button className="mt-4 w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800">Thanh toán</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


