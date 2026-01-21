import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, RefreshCw, Home, AlertTriangle } from "lucide-react";

export function PaymentCancel() {
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    // Small delay to provide visual feedback
    setTimeout(() => {
      navigate("/booking");
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Payment Canceled
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Your payment was not completed
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Reservation not confirmed
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                No charge has been processed. Your reservation remains pending
                payment and will be automatically canceled if you do not
                complete the payment.
              </p>
              <p className="text-sm text-gray-700 font-medium">
                What can you do?
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1 ml-4">
                <li className="list-disc">
                  Retry the payment to confirm your reservation
                </li>
                <li className="list-disc">
                  Choose another available court or time slot
                </li>
                <li className="list-disc">
                  Contact support if you are experiencing issues
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-300" />
                Retry Reservation
              </>
            )}
          </button>

          <button
            onClick={() => navigate("/reservations")}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl border-2 border-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
          >
            View My Reservations
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl border-2 border-gray-200 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Need help?{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
