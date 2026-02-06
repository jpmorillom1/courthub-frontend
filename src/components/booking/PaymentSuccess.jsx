import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, ArrowRight, Calendar, Loader2 } from "lucide-react";

export function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(true);
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const timer = setTimeout(() => {
      setProcessing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (processing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <Loader2 className="w-10 h-10 text-green-600 animate-spin" />
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Processing your payment...
          </h2>
          <p className="text-gray-600">
            We are confirming your reservation. Please wait a moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 animate-fade-in">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce-once">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Payment Successful!
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Your payment has been processed successfully
        </p>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">
                Reservation confirmed
              </h3>
              <p className="text-sm text-gray-600">
                Your reservation is being processed. You will receive a
                confirmation email shortly with all the details.
              </p>
            </div>
          </div>
        </div>

        {sessionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-xs text-gray-500 mb-1">Session ID</p>
            <p className="text-sm font-mono text-gray-700 break-all">
              {sessionId}
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => navigate("/reservations")}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <Calendar className="w-5 h-5" />
            View My Reservations
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl border-2 border-gray-200 transition-all duration-200"
          >
            Go to Dashboard
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">courthub</p>
        </div>
      </div>
    </div>
  );
}
