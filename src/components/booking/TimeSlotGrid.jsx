import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

export function TimeSlotGrid({
  selectedCourt,
  dateHeaders,
  baseTimeSlots,
  firebaseWeekData,
  fbLoading,
  selectedDate,
  selectedTime,
  isProcessing,
  onBack,
  onPrevWeek,
  onNextWeek,
  onDateSelect,
  onTimeSelect,
  onConfirm,
}) {
  return (
    <div className="max-w-[90rem] mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-[#cbab42]"
      >
        <ChevronLeft size={20} /> Change court
      </button>

      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex justify-between mb-6">
          <h2 className="text-3xl font-black flex items-center gap-3">
            <CalendarDays className="text-[#cbab42]" />
            {selectedCourt.name}
          </h2>
          <div className="flex gap-2">
            <button onClick={onPrevWeek}>
              <ChevronLeft />
            </button>
            <button onClick={onNextWeek}>
              <ChevronRight />
            </button>
          </div>
        </div>

        {fbLoading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <div className="flex gap-0 overflow-x-auto">
            {dateHeaders.map((day) => {
              const slots = firebaseWeekData[day.fullDate] || {};
              return (
                <div key={day.fullDate} className="min-w-[140px]">
                  <div
                    onClick={() => onDateSelect(day.fullDate)}
                    className={`text-center p-4 rounded-2xl mb-4 cursor-pointer ${
                      selectedDate === day.fullDate
                        ? "bg-[#cbab42] text-white shadow-lg scale-105"
                        : "bg-gray-50 text-gray-400"
                    }`}
                  >
                    <p className="text-xs uppercase font-bold">{day.day}</p>
                    <p className="text-2xl font-black">{day.date}</p>
                  </div>

                  {baseTimeSlots.map((time) => {
                    const key = time.replace(":", "-");
                    const status = slots[key]?.status;
                    const available = status === "AVAILABLE";
                    const booked = status === "BOOKED";
                    const unassigned = !status;
                    const selected =
                      selectedTime === time && selectedDate === day.fullDate;

                    return (
                      <button
                        key={time}
                        disabled={!available}
                        onClick={() => {
                          onTimeSelect(time);
                          onDateSelect(day.fullDate);
                        }}
                        className={`w-full py-3 mb-2 rounded-xl font-bold transition-all ${
                          selected
                            ? "bg-[#cbab42] text-white ring-2 ring-offset-2 ring-[#cbab42]"
                            : available
                              ? "bg-emerald-50 text-emerald-700 hover:bg-[#cbab42] hover:text-white"
                              : booked
                                ? "bg-red-50 text-red-400 cursor-not-allowed line-through"
                                : "bg-gray-50 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}

        {selectedTime && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className={`px-8 py-4 rounded-xl font-bold shadow-xl transition-all ${
                isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#cbab42] text-white hover:scale-105"
              }`}
            >
              {isProcessing ? "Redirecting to payment..." : "Confirm and Pay"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
