import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="container-responsive py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 items-start">
          {/* Brand & Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Shop</h3>
            <p className="text-sm text-gray-600">Giày dép và thời trang thể thao chính hãng. Cam kết chất lượng và dịch vụ tận tâm.</p>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-medium">Địa chỉ:</span> 123 Đường ABC, Quận 1, TP.HCM
              </p>
              <p>
                <span className="font-medium">Điện thoại:</span> <a href="tel:0123456789" className="hover:underline">0123 456 789</a>
              </p>
              <p>
                <span className="font-medium">Email:</span> <a href="mailto:support@example.com" className="hover:underline">support@example.com</a>
              </p>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 pt-2">
              <Link href="https://facebook.com" target="_blank" aria-label="Facebook" className="grid place-items-center h-9 w-9 rounded-full border border-gray-200 hover:bg-gray-50">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 22v-8h2.6l.4-3h-3V9.2c0-.9.3-1.5 1.6-1.5H17V5.1c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.3-3.8 3.9V11H9v3h2v8h2.5z"/></svg>
              </Link>
              <Link href="https://instagram.com" target="_blank" aria-label="Instagram" className="grid place-items-center h-9 w-9 rounded-full border border-gray-200 hover:bg-gray-50">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5zm0 2a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H7zm5 3.5A5.5 5.5 0 1112 18.5 5.5 5.5 0 0112 7.5zm0 2A3.5 3.5 0 1015.5 13 3.5 3.5 0 0012 9.5zm5.75-3.25a1 1 0 11-1 1 1 1 0 011-1z"/></svg>
              </Link>
              <Link href="https://zalo.me" target="_blank" aria-label="Zalo" className="grid place-items-center h-9 w-9 rounded-full border border-gray-200 hover:bg-gray-50">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.03 2 10.76c0 2.98 1.66 5.62 4.24 7.28-.11.8-.49 2.21-1.63 3.58 0 0 2.12-.17 3.93-1.9A10.9 10.9 0 0012 19.52c5.52 0 10-4.03 10-8.76S17.52 2 12 2z"/></svg>
              </Link>
              <Link href="https://tiktok.com" target="_blank" aria-label="TikTok" className="grid place-items-center h-9 w-9 rounded-full border border-gray-200 hover:bg-gray-50">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3c.6 1.7 1.9 3.1 3.5 3.8v3.1c-1.3 0-2.5-.3-3.5-.9v5.6c0 3-2.4 5.4-5.4 5.4S6.3 17.6 6.3 14.6c0-2.7 1.9-5 4.5-5.4v3.2c-.8.3-1.4 1.1-1.4 2.1 0 1.2 1 2.2 2.2 2.2s2.2-1 2.2-2.2V3H17z"/></svg>
              </Link>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Liên kết</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><Link href="/" className="hover:text-gray-900">Trang chủ</Link></li>
              <li><Link href="/shop" className="hover:text-gray-900">Cửa hàng</Link></li>
              <li><Link href="/cart" className="hover:text-gray-900">Giỏ hàng</Link></li>
              <li><Link href="/" className="hover:text-gray-900">Khuyến mãi</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li><Link href="/" className="hover:text-gray-900">Hướng dẫn mua hàng</Link></li>
              <li><Link href="/" className="hover:text-gray-900">Chính sách đổi trả</Link></li>
              <li><Link href="/" className="hover:text-gray-900">Bảo hành</Link></li>
              <li><Link href="/" className="hover:text-gray-900">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Nhận bản tin</h4>
            <p className="text-sm text-gray-600">Đăng ký để nhận thông tin sản phẩm mới và ưu đãi.</p>
            <form className="mt-1 flex flex-col sm:flex-row gap-2 w-full">
              <input type="email" required placeholder="Email của bạn" className="w-full sm:flex-1 rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900" />
              <button type="submit" className="btn-primary sm:whitespace-nowrap">Đăng ký</button>
            </form>
            <p className="text-xs text-gray-500">Bằng việc đăng ký, bạn đồng ý với điều khoản của chúng tôi.</p>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Shop. All rights reserved.</p>
          <div className="mt-2 sm:mt-0 flex items-center gap-4">
            <Link href="/" className="hover:text-gray-700">Điều khoản</Link>
            <span className="text-gray-300">|</span>
            <Link href="/" className="hover:text-gray-700">Bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
