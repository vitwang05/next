import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { GET_CUSTOMER, GET_CUSTOMER_ORDERS } from "../../graphql/queries/customer";
import { UPDATE_CUSTOMER } from "../../graphql/mutations/customer";

export default function AccountPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  // Queries
  const { data: customerData, loading: customerLoading, refetch: refetchCustomer } = useQuery(GET_CUSTOMER, {
    skip: !isAuthenticated
  });
  const { data: ordersData, loading: ordersLoading } = useQuery(GET_CUSTOMER_ORDERS, {
    variables: { first: 20 },
    skip: !isAuthenticated
  });

  // Mutations
  const [updateCustomer, { loading: updateLoading }] = useMutation(UPDATE_CUSTOMER);

  const customer = customerData?.customer || user;
  const orders = ordersData?.customer?.orders?.nodes || [];

  useEffect(() => {
    if (customer) {
      setFormData({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email || "",
        billing: {
          firstName: customer.billing?.firstName || "",
          lastName: customer.billing?.lastName || "",
          company: customer.billing?.company || "",
          address1: customer.billing?.address1 || "",
          address2: customer.billing?.address2 || "",
          city: customer.billing?.city || "",
          state: customer.billing?.state || "",
          postcode: customer.billing?.postcode || "",
          country: customer.billing?.country || "VN",
          phone: customer.billing?.phone || "",
        },
        shipping: {
          firstName: customer.shipping?.firstName || "",
          lastName: customer.shipping?.lastName || "",
          company: customer.shipping?.company || "",
          address1: customer.shipping?.address1 || "",
          address2: customer.shipping?.address2 || "",
          city: customer.shipping?.city || "",
          state: customer.shipping?.state || "",
          postcode: customer.shipping?.postcode || "",
          country: customer.shipping?.country || "VN",
        }
      });
    }
  }, [customer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [section, field] = name.includes('.') ? name.split('.') : ['', name];
    
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
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
    
    if (!formData.firstName?.trim()) newErrors.firstName = "Tên là bắt buộc";
    if (!formData.lastName?.trim()) newErrors.lastName = "Họ là bắt buộc";
    if (!formData.email?.trim()) newErrors.email = "Email là bắt buộc";
    if (!formData.billing?.address1?.trim()) newErrors["billing.address1"] = "Địa chỉ là bắt buộc";
    if (!formData.billing?.city?.trim()) newErrors["billing.city"] = "Thành phố là bắt buộc";
    if (!formData.billing?.phone?.trim()) newErrors["billing.phone"] = "Số điện thoại là bắt buộc";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      await updateCustomer({
        variables: {
          input: {
            id: customer.id,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            billing: formData.billing,
            shipping: formData.shipping
          }
        }
      });
      
      await refetchCustomer();
      setIsEditing(false);
      setErrors({});
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const getOrderStatusColor = (status) => {
    const statusMap = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PROCESSING': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'REFUNDED': 'bg-gray-100 text-gray-800',
      'FAILED': 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getOrderStatusText = (status) => {
    const statusMap = {
      'PENDING': 'Chờ xử lý',
      'PROCESSING': 'Đang xử lý',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy',
      'REFUNDED': 'Đã hoàn tiền',
      'FAILED': 'Thất bại'
    };
    return statusMap[status] || status;
  };

  if (customerLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin tài khoản...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Chưa đăng nhập</h1>
          <p className="text-gray-600 mb-6">Vui lòng đăng nhập để xem thông tin tài khoản</p>
          <Link href="/login" className="btn-primary">
            Đăng nhập
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tài khoản của tôi</h1>
              <p className="text-gray-600 mt-2">Xin chào, {customer.displayName || customer.firstName}!</p>
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="btn-secondary"
            >
              Đăng xuất
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === "profile"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Thông tin cá nhân
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === "orders"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Đơn hàng của tôi
              </button>
               <button
                 onClick={() => setActiveTab("addresses")}
                 className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${
                   activeTab === "addresses"
                     ? "bg-blue-100 text-blue-700"
                     : "text-gray-600 hover:bg-gray-100"
                 }`}
               >
                 Địa chỉ
               </button>
               <Link
                 href="/account/change-password"
                 className="w-full text-left px-4 py-3 rounded-lg font-medium transition-colors text-gray-600 hover:bg-gray-100"
               >
                 Thay đổi mật khẩu
               </Link>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Thông tin cá nhân</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn-secondary"
                    >
                      Chỉnh sửa
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName || ""}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.lastName ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName || ""}
                          onChange={handleInputChange}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.firstName ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email || ""}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={handleSave}
                        disabled={updateLoading}
                        className="btn-primary disabled:opacity-50"
                      >
                        {updateLoading ? "Đang lưu..." : "Lưu thay đổi"}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setErrors({});
                        }}
                        className="btn-secondary"
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Họ</label>
                        <p className="text-gray-900">{customer.lastName || "Chưa cập nhật"}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Tên</label>
                        <p className="text-gray-900">{customer.firstName || "Chưa cập nhật"}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{customer.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tên hiển thị</label>
                      <p className="text-gray-900">{customer.displayName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ngày tạo tài khoản</label>
                      <p className="text-gray-900">
                        {new Date(customer.dateCreated).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Đơn hàng của tôi</h2>
                
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
                    <p className="text-gray-600 mb-6">Bắt đầu mua sắm để xem đơn hàng của bạn ở đây</p>
                    <Link href="/shop" className="btn-primary">
                      Mua sắm ngay
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium text-gray-900">Đơn hàng #{order.orderNumber}</h3>
                            <p className="text-sm text-gray-600">
                              {new Date(order.date).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getOrderStatusColor(order.status)}`}>
                              {getOrderStatusText(order.status)}
                            </span>
                            <p className="text-lg font-semibold text-gray-900 mt-1" dangerouslySetInnerHTML={{ __html: order.total }} />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Phương thức thanh toán:</span>
                            <span className="ml-2 text-gray-900">{order.paymentMethodTitle || order.paymentMethod}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Số sản phẩm:</span>
                            <span className="ml-2 text-gray-900">{order.lineItems?.nodes?.length || 0}</span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              <Link href={`/account/orders/${order.databaseId}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                Xem chi tiết
                              </Link>
                              {order.needsPayment && (
                                <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                                  Thanh toán
                                </button>
                              )}
                            </div>
                            <button className="text-gray-600 hover:text-gray-800 text-sm">
                              Mua lại
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                {/* Billing Address */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Địa chỉ thanh toán</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Chỉnh sửa
                    </button>
                  </div>
                  
                  {customer.billing ? (
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-900">
                        {customer.billing.firstName} {customer.billing.lastName}
                      </p>
                      {customer.billing.company && <p>{customer.billing.company}</p>}
                      <p>{customer.billing.address1}</p>
                      {customer.billing.address2 && <p>{customer.billing.address2}</p>}
                      <p>
                        {customer.billing.city}, {customer.billing.state} {customer.billing.postcode}
                      </p>
                      <p>{customer.billing.country}</p>
                      {customer.billing.phone && <p className="mt-2">ĐT: {customer.billing.phone}</p>}
                    </div>
                  ) : (
                    <p className="text-gray-500">Chưa có địa chỉ thanh toán</p>
                  )}
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Địa chỉ giao hàng</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Chỉnh sửa
                    </button>
                  </div>
                  
                  {customer.shipping ? (
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-900">
                        {customer.shipping.firstName} {customer.shipping.lastName}
                      </p>
                      {customer.shipping.company && <p>{customer.shipping.company}</p>}
                      <p>{customer.shipping.address1}</p>
                      {customer.shipping.address2 && <p>{customer.shipping.address2}</p>}
                      <p>
                        {customer.shipping.city}, {customer.shipping.state} {customer.shipping.postcode}
                      </p>
                      <p>{customer.shipping.country}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">Chưa có địa chỉ giao hàng</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
