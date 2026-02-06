import { Check } from "lucide-react";

export function BookingStepper({ currentStep }) {
  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="flex items-center justify-between">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  currentStep >= s
                    ? "bg-[#cbab42] text-white shadow-lg"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > s ? <Check size={18} /> : s}
              </div>
              <p className="mt-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                {s === 1 ? "Sport" : s === 2 ? "Court" : "Schedule"}
              </p>
            </div>
            {s < 3 && (
              <div
                className={`h-1 flex-1 mx-2 rounded-full ${
                  currentStep > s ? "bg-[#cbab42]" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
