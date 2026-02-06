import { ChevronLeft, Lock } from "lucide-react";
import { CourtCard3D } from "./CourtCard3D";

export function CourtSelector({
  courts,
  selectedCourt,
  onSelect,
  onBack,
  sport,
}) {
  return (
    <div className="max-w-7xl mx-auto">
      <button
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-gray-500 hover:text-[#cbab42]"
      >
        <ChevronLeft size={20} /> Change sport
      </button>

      <CourtCard3D
        courts={courts.filter((c) => c.status === "ACTIVE")}
        selectedCourt={selectedCourt}
        onCourtSelect={onSelect}
        sport={sport}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {courts.map((court) => {
          const active = court.status === "ACTIVE";
          return (
            <div
              key={court.id}
              onClick={() => active && onSelect(court)}
              className={`relative p-6 rounded-2xl border-2 transition-all
                ${
                  active
                    ? "bg-white hover:shadow-lg cursor-pointer"
                    : "bg-gray-50 opacity-70 grayscale cursor-not-allowed"
                }
                ${
                  selectedCourt?.id === court.id
                    ? "border-[#cbab42] bg-[#cbab42]/5"
                    : "border-gray-100"
                }`}
            >
              {!active && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur rounded-2xl">
                  <div className="bg-gray-900 text-white px-4 py-2 rounded-full flex items-center gap-2">
                    <Lock size={14} /> Inactive
                  </div>
                </div>
              )}
              <h3 className="font-bold text-lg">{court.name}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}
