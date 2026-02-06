import { Loader2, CreditCard } from "lucide-react";

export function PaymentProcessing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
              <CreditCard className="w-10 h-10 text-blue-600" />
            </div>
            <div className="absolute -bottom-2 -right-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Redirecting to Payment Gateway...
        </h2>

        <p className="text-gray-600 mb-4">
          please wait while we securely process your payment
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-gray-600">
            🔒 Your payment information is protected with bank-level encryption
          </p>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
