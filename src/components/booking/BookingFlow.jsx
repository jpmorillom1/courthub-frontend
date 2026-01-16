import { useBookingLogic } from "../../hooks/useBookingLogic";
import { BookingStepper } from "./BookingStepper";
import { SportSelector } from "./SportSelector";
import { CourtSelector } from "./CourtSelector";
import { TimeSlotGrid } from "./TimeSlotGrid";

export function BookingFlow() {
  const { state, actions } = useBookingLogic();

  return (
    <div className="p-6 min-h-screen bg-gray-50/50">
      <BookingStepper currentStep={state.step} />

      {state.step === 1 && (
        <SportSelector
          sports={state.sports}
          onSelect={actions.handleSportSelect}
        />
      )}

      {state.step === 2 && (
        <CourtSelector
          courts={state.courts}
          selectedCourt={state.selectedCourt}
          onSelect={actions.handleCourtSelect}
          onBack={actions.handleBackToSports}
          sport={state.selectedSport}
        />
      )}

      {state.step === 3 && state.selectedCourt && (
        <TimeSlotGrid
          selectedCourt={state.selectedCourt}
          dateHeaders={state.dateHeaders}
          baseTimeSlots={state.baseTimeSlots}
          firebaseWeekData={state.firebaseWeekData}
          fbLoading={state.fbLoading}
          selectedDate={state.selectedDate}
          selectedTime={state.selectedTime}
          isProcessing={state.isProcessing}
          onBack={actions.handleBackToCourts}
          onPrevWeek={actions.handlePrevWeek}
          onNextWeek={actions.handleNextWeek}
          onDateSelect={actions.setSelectedDate}
          onTimeSelect={actions.setSelectedTime}
          onConfirm={actions.handleConfirm}
        />
      )}
    </div>
  );
}
