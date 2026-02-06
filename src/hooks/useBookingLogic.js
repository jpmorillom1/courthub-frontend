import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { bookingService } from "../services/bookingService";
import { paymentService } from "../services/paymentService";
import { useAvailability } from "./useAvailability";
import { useCourts, useSports } from "./queryHooks";

const COURT_CONFIG = {
  startHour: 8,
  endHour: 22,
  duration: 1,
};

export function useBookingLogic() {
  const navigate = useNavigate();

  // Main states
  const [step, setStep] = useState(1);
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [selectedTime, setSelectedTime] = useState(null);

  // Data
  const [dateHeaders, setDateHeaders] = useState([]);
  const [baseTimeSlots, setBaseTimeSlots] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  /* =======================
     WEEK RANGE (Firebase)
     ======================= */
  const { weekStartStr, weekEndStr } = useMemo(() => {
    const start = new Date(currentWeekStart);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return {
      weekStartStr: start.toISOString().split("T")[0],
      weekEndStr: end.toISOString().split("T")[0],
    };
  }, [currentWeekStart]);

  /* =======================
     INITIAL DATA
     ======================= */
  const { data: sports = [] } = useSports();
  const { data: courts = [] } = useCourts(selectedSport);

  /* =======================
     AVAILABILITY (Firebase)
     ======================= */
  const { slotsData: firebaseWeekData, loading: fbLoading } = useAvailability(
    selectedCourt?.id,
    weekStartStr,
    weekEndStr,
  );

  /* =======================
     GENERATE GRID
     ======================= */
  useEffect(() => {
    if (step !== 3) return;

    const slots = [];
    for (let h = COURT_CONFIG.startHour; h < COURT_CONFIG.endHour; h++) {
      slots.push(`${h.toString().padStart(2, "0")}:00`);
    }
    setBaseTimeSlots(slots);

    const headers = [];
    const baseDate = new Date(currentWeekStart);
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + i);
      headers.push(bookingService.getTimeSlots(d.toISOString()));
    }
    setDateHeaders(headers);
  }, [step, currentWeekStart]);

  /* =======================
     HANDLERS
     ======================= */
  const handleSportSelect = (id) => {
    setSelectedSport(id);
    setSelectedCourt(null);
    setStep(2);
  };

  const handleCourtSelect = (court) => {
    if (court.status === "ACTIVE") {
      setSelectedCourt(court);
      setStep(3);
    }
  };

  const handleNextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };

  const handlePrevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    setCurrentWeekStart(prev >= today ? prev : today);
  };

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      const bookingResponse = await bookingService.createReservation({
        courtId: selectedCourt.id,
        date: selectedDate,
        startTime: selectedTime,
      });

      const paymentResponse = await paymentService.createCheckoutSession(
        bookingResponse.id,
      );

      if (paymentResponse.checkoutUrl) {
        window.location.href = paymentResponse.checkoutUrl;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (e) {
      console.error("Error in the booking and payment process:", e);
      const errorMessage =
        e.response?.data?.message ||
        e.message ||
        "Error processing the reservation. Please try again.";
      alert(errorMessage);
      setIsProcessing(false);
    }
  };

  const handleBackToSports = () => {
    setStep(1);
  };

  const handleBackToCourts = () => {
    setStep(2);
  };

  /* =======================
     RETURN
     ======================= */
  return {
    state: {
      step,
      selectedSport,
      selectedCourt,
      selectedDate,
      selectedTime,
      sports,
      courts,
      dateHeaders,
      baseTimeSlots,
      firebaseWeekData,
      fbLoading,
      isProcessing,
    },
    actions: {
      handleSportSelect,
      handleCourtSelect,
      handleNextWeek,
      handlePrevWeek,
      handleConfirm,
      handleBackToSports,
      handleBackToCourts,
      setSelectedDate,
      setSelectedTime,
    },
  };
}
