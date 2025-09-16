import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_CART } from "../../graphql/queries/cart";
import { GET_PAYMENT_GATEWAYS } from "../../graphql/queries/checkout";
import { CHECKOUT } from "../../graphql/mutations/checkout";
import {withAuth} from "../../utils/withAuth";
function CheckoutPage() {
  const router = useRouter();
  const { data: cartData, loading: cartLoading } = useQuery(GET_CART);
  const { data: paymentData, loading: paymentLoading } = useQuery(GET_PAYMENT_GATEWAYS);
  const [checkout, { loading: checkoutLoading }] = useMutation(CHECKOUT);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    state: "HCM",
    postalCode: "",
    paymentMethod: "",
    notes: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cart = cartData?.cart;
  const items = cart?.contents?.nodes || [];
  const total = cart?.total || "0";
  const subtotal = cart?.subtotal || "0";
  const shipping = "0"; // Free shipping for now
  const itemCount = cart?.contents?.itemCount || 0;

  // Process data for dropdowns
  const paymentMethods = paymentData?.paymentGateways?.nodes || [];

  // Vietnamese provinces/cities
  const vietnamStates = [
    { code: 'HN', name: 'Hà Nội' },
    { code: 'HCM', name: 'Hồ Chí Minh' },
    { code: 'DN', name: 'Đà Nẵng' },
    { code: 'HP', name: 'Hải Phòng' },
    { code: 'CT', name: 'Cần Thơ' },
    { code: 'BD', name: 'Bình Dương' },
    { code: 'AG', name: 'An Giang' },
    { code: 'BR', name: 'Bà Rịa - Vũng Tàu' },
    { code: 'BL', name: 'Bạc Liêu' },
    { code: 'BK', name: 'Bắc Kạn' },
    { code: 'BG', name: 'Bắc Giang' },
    { code: 'BN', name: 'Bắc Ninh' },
    { code: 'BTR', name: 'Bến Tre' },
    { code: 'BĐ', name: 'Bình Định' },
    { code: 'BP', name: 'Bình Phước' },
    { code: 'BTH', name: 'Bình Thuận' },
    { code: 'CM', name: 'Cà Mau' },
    { code: 'CB', name: 'Cao Bằng' },
    { code: 'DL', name: 'Đắk Lắk' },
    { code: 'ĐKN', name: 'Đắk Nông' },
    { code: 'ĐB', name: 'Điện Biên' },
    { code: 'ĐT', name: 'Đồng Tháp' },
    { code: 'GL', name: 'Gia Lai' },
    { code: 'HG', name: 'Hà Giang' },
    { code: 'HNA', name: 'Hà Nam' },
    { code: 'HT', name: 'Hà Tĩnh' },
    { code: 'HD', name: 'Hải Dương' },
    { code: 'HB', name: 'Hòa Bình' },
    { code: 'HY', name: 'Hưng Yên' },
    { code: 'KH', name: 'Khánh Hòa' },
    { code: 'KG', name: 'Kiên Giang' },
    { code: 'KT', name: 'Kon Tum' },
    { code: 'LC', name: 'Lai Châu' },
    { code: 'LĐ', name: 'Lâm Đồng' },
    { code: 'LS', name: 'Lạng Sơn' },
    { code: 'LCA', name: 'Lào Cai' },
    { code: 'LA', name: 'Long An' },
    { code: 'NĐ', name: 'Nam Định' },
    { code: 'NA', name: 'Nghệ An' },
    { code: 'NB', name: 'Ninh Bình' },
    { code: 'NT', name: 'Ninh Thuận' },
    { code: 'PT', name: 'Phú Thọ' },
    { code: 'PY', name: 'Phú Yên' },
    { code: 'QB', name: 'Quảng Bình' },
    { code: 'QNA', name: 'Quảng Nam' },
    { code: 'QG', name: 'Quảng Ngãi' },
    { code: 'QNI', name: 'Quảng Ninh' },
    { code: 'QT', name: 'Quảng Trị' },
    { code: 'ST', name: 'Sóc Trăng' },
    { code: 'SL', name: 'Sơn La' },
    { code: 'TN', name: 'Tây Ninh' },
    { code: 'TB', name: 'Thái Bình' },
    { code: 'TNG', name: 'Thái Nguyên' },
    { code: 'TH', name: 'Thanh Hóa' },
    { code: 'TT', name: 'Thừa Thiên Huế' },
    { code: 'TG', name: 'Tiền Giang' },
    { code: 'TV', name: 'Trà Vinh' },
    { code: 'TQ', name: 'Tuyên Quang' },
    { code: 'VL', name: 'Vĩnh Long' },
    { code: 'VP', name: 'Vĩnh Phúc' },
    { code: 'YB', name: 'Yên Bái' }
  ];

  // Set default payment method if none selected
  useEffect(() => {
    if (!formData.paymentMethod) {
      setFormData(prev => ({
        ...prev,
        paymentMethod: paymentMethods.length > 0 ? paymentMethods[0].id : "cod"
      }));
    }
  }, [paymentMethods, formData.paymentMethod]);


  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && itemCount === 0) {
      router.push("/cart");
    }
  }, [cartLoading, itemCount, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = "Vui lòng nhập tên";
    if (!formData.lastName.trim()) newErrors.lastName = "Vui lòng nhập họ";
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!formData.state) newErrors.state = "Vui lòng chọn tỉnh/thành phố";
    if (!formData.paymentMethod) newErrors.paymentMethod = "Vui lòng chọn phương thức thanh toán";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const checkoutInput = {
        clientMutationId: String(Date.now()),
        billing: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address1: formData.address,
          city: formData.state, // Use state as city
          state: formData.state,
          postcode: formData.postalCode,
          country: "VN",
        },
        shipping: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address1: formData.address,
          city: formData.state, // Use state as city
          state: formData.state,
          postcode: formData.postalCode,
          country: "VN",
        },
        paymentMethod: formData.paymentMethod,
        customerNote: formData.notes,
      };

      const result = await checkout({ variables: { input: checkoutInput } });
      
      if (result.data?.checkout?.order) {
        // Redirect to success page or show success message
        router.push(`/checkout/success?order=${result.data.checkout.order.orderNumber}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng trống</h1>
          <Link href="/shop" className="text-blue-600 hover:underline">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Thanh toán</h1>
            <Link href="/cart" className="text-blue-600 hover:underline">
              Quay lại giỏ hàng
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Thông tin giao hàng</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nhập họ"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Nhập tên"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="example@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0123456789"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Số nhà, tên đường, phường/xã"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              {/* Province and Postal Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {vietnamStates.map((state) => (
                      <option key={state.code} value={state.code}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã bưu điện
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="700000 (tùy chọn)"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Phương thức thanh toán <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {paymentMethods.length > 0 ? (
                    paymentMethods.map((method) => (
                      <label key={method.id} className="flex items-start">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleInputChange}
                          className="mt-1 mr-3"
                        />
                        <div>
                          <span className="font-medium">{method.title}</span>
                          {method.description && (
                            <p className="text-sm text-gray-500 mt-1">{method.description}</p>
                          )}
                        </div>
                      </label>
                    ))
                  ) : (
                    <>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cod"
                          checked={formData.paymentMethod === "cod"}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <span>Thanh toán khi nhận hàng (COD)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="bank_transfer"
                          checked={formData.paymentMethod === "bank_transfer"}
                          onChange={handleInputChange}
                          className="mr-3"
                        />
                        <span>Chuyển khoản ngân hàng</span>
                      </label>
                    </>
                  )}
                </div>
                {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
              </div>


              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú đơn hàng
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ghi chú thêm cho đơn hàng..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || checkoutLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting || checkoutLoading ? "Đang xử lý..." : "Đặt hàng"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>
            
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.key} className="flex items-center space-x-4">
                  {item.product?.image?.sourceUrl && (
                    <img
                      src={item.product.image.sourceUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {item.product?.name}
                    </h3>
                    <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                  </div>
                  <div className="text-sm font-medium text-gray-900" dangerouslySetInnerHTML={{ __html: item.total }} />
                </div>
              ))}
            </div>

            {/* Order Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tạm tính:</span>
                <span dangerouslySetInnerHTML={{ __html: subtotal }} />
              </div>
              <div className="flex justify-between text-sm">
                <span>Phí vận chuyển:</span>
                <span>{shipping === "0" ? "Miễn phí" : <span dangerouslySetInnerHTML={{ __html: shipping }} />}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Tổng cộng:</span>
                <span dangerouslySetInnerHTML={{ __html: total }} />
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-green-800">
                  <p className="font-medium">Bảo mật thông tin</p>
                  <p>Thông tin của bạn được mã hóa và bảo mật tuyệt đối.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default withAuth(CheckoutPage);