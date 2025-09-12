import { useState } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_CART } from "../../graphql/queries/cart";
import { REMOVE_FROM_CART, UPDATE_CART_ITEM, CLEAR_CART } from "../../graphql/mutations/cart";

export default function CartPage() {
  const router = useRouter();
  const { loading, error, data, refetch } = useQuery(GET_CART, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
  });
  const [removeItem, { loading: removing }] = useMutation(REMOVE_FROM_CART);
  const [updateItem, { loading: updating }] = useMutation(UPDATE_CART_ITEM);
  const [clearCart, { loading: clearing }] = useMutation(CLEAR_CART);
  
  // State để track loading cho checkout
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  
  console.log(data);
  const items = data?.cart?.contents?.nodes || [];
  const total = data?.cart?.total || "0";
  const subtotal = data?.cart?.subtotal || "0";
  const itemCount = data?.cart?.contents?.itemCount || 0;

  async function handleRemove(key) {
    try {
      await removeItem({ variables: { key } });
      await refetch();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleUpdateQuantity(key, quantity) {
    if (quantity < 1) {
      await handleRemove(key);
      return;
    }
    
    try {
      console.log('Updating quantity:', { key, quantity });
      
      const result = await updateItem({ 
        variables: { key, quantity },
        optimisticResponse: {
          updateItemQuantities: {
            updated: [{ key, quantity }],
            removed: []
          }
        }
      });
      
      console.log('Update result:', result);
      
      if (result.error) {
        console.error('GraphQL error:', result.error);
        throw new Error(result.error.message);
      }
      
      if (result.data?.updateItemQuantities?.errors) {
        console.error('Mutation errors:', result.data.updateItemQuantities.errors);
        throw new Error('Có lỗi khi cập nhật số lượng');
      }
      
      // Refetch để đảm bảo data được cập nhật chính xác
      await refetch();
      console.log('Refetch completed');
      
    } catch (e) {
      console.error('Update quantity error:', e);
      console.error('Error details:', {
        message: e.message,
        graphQLErrors: e.graphQLErrors,
        networkError: e.networkError
      });
      alert(`Có lỗi khi cập nhật số lượng: ${e.message}. Vui lòng thử lại.`);
    }
  }

  async function handleClearCart() {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?")) {
      try {
        await clearCart();
        await refetch();
      } catch (e) {
        console.error(e);
      }
    }
  }

  async function handleCheckout() {
    setIsCheckoutLoading(true);
    try {
      // Redirect to checkout page
      await router.push('/checkout');
    } catch (e) {
      console.error('Checkout error:', e);
      alert('Có lỗi khi chuyển đến trang thanh toán. Vui lòng thử lại.');
    } finally {
      setIsCheckoutLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Giỏ hàng ({itemCount} sản phẩm)</h1>
          {items.length > 0 && (
            <button
              onClick={handleClearCart}
              disabled={clearing}
              className="px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-60"
            >
              {clearing ? "Đang xóa..." : "Xóa tất cả"}
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-gray-600">Đang tải giỏ hàng...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <div className="text-red-500 text-6xl mb-4">⚠️</div>
                  <p className="text-red-600 text-lg">Lỗi: {error.message}</p>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 text-gray-700 text-center max-w-md">
                  <svg className="w-20 h-20 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                  </svg>
                  <h3 className="text-xl font-semibold mb-2">Giỏ hàng trống</h3>
                  <p className="text-gray-500">Hãy thêm sản phẩm vào giỏ hàng để bắt đầu mua sắm</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {items.map((item) => {
                  const p = item.product?.node;
                  const priceHtml = p?.price || p?.regularPrice || "";
                  const subtotalHtml = item.subtotal || "";
                  return (
                    <div key={item.key} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-4"> 
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          {p?.image?.sourceUrl ? (
                            <img
                              src={p.image.sourceUrl}
                              alt={p.image.altText || p?.name}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No Image</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-lg mb-1">{p?.name}</h3>
                          <div className="text-sm text-gray-600 mb-2">
                            <span dangerouslySetInnerHTML={{ __html: priceHtml }} />
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3 mb-3">
                            <span className="text-sm text-gray-600">Số lượng:</span>
                            <div className="flex items-center border border-gray-200 rounded-lg">
                              <button
                                onClick={() => handleUpdateQuantity(item.key, item.quantity - 1)}
                                disabled={removing}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                -
                              </button>
                              <span className="px-4 py-1 text-sm font-medium min-w-[3rem] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(item.key, item.quantity + 1)}
                                disabled={removing}
                                className="px-3 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          {/* Subtotal */}
                          <div className="text-sm">
                            <span className="text-gray-600">Thành tiền: </span>
                            <span className="font-medium text-gray-900" dangerouslySetInnerHTML={{ __html: subtotalHtml }} />
                          </div>
                        </div>
                        
                        {/* Remove Button */}
                        <div className="flex-shrink-0">
                          <button
                            disabled={removing}
                            onClick={() => handleRemove(item.key)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Xóa sản phẩm"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          {items.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Tóm tắt đơn hàng</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Số sản phẩm</span>
                    <span className="font-medium text-gray-900">{itemCount} sản phẩm</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-medium text-gray-900" dangerouslySetInnerHTML={{ __html: subtotal }} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium text-green-600">Miễn phí</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">Tổng cộng</span>
                      <span className="text-xl font-bold text-blue-600" dangerouslySetInnerHTML={{ __html: total }} />
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isCheckoutLoading || removing || clearing}
                >
                  {isCheckoutLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 animate-spin mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang xử lý...
                    </div>
                  ) : (
                    "Tiến hành thanh toán"
                  )}
                </button>
                
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-green-700">
                      Miễn phí vận chuyển cho đơn hàng từ 500.000đ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


