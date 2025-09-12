import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import Link from "next/link";
import { REQUEST_PASSWORD_RESET } from "../../graphql/mutations/customer";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [requestPasswordReset, { loading: resetLoading }] = useMutation(REQUEST_PASSWORD_RESET);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await requestPasswordReset({
        variables: {
          input: {
            username: email
          }
        }
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Password reset error:", error);
      setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Email đã được gửi</h2>
            <p className="mt-2 text-sm text-gray-600">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Vui lòng kiểm tra hộp thư và làm theo hướng dẫn để đặt lại mật khẩu.
            </p>
            <div className="mt-6">
              <Link href="/login" className="btn-primary">
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Quên mật khẩu</h2>
          <p className="mt-2 text-sm text-gray-600">
            Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Nhập email của bạn"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || resetLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading || resetLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang gửi...
                  </div>
                ) : (
                  "Gửi hướng dẫn đặt lại mật khẩu"
                )}
              </button>
            </div>

            <div className="text-center">
              <Link href="/login" className="text-sm text-blue-600 hover:text-blue-500">
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
