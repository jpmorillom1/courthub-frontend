import api, { API_ENDPOINTS } from "./api";

// Helpers for reservations mapping
const pad2 = (n) => String(n).padStart(2, "0");
const normalizeTime = (time) => {
  if (typeof time === "string") {
    const [h = "0", m = "0", s = "0"] = time.split(":");
    return {
      hour: Number.parseInt(h, 10) || 0,
      minute: Number.parseInt(m, 10) || 0,
      second: Number.parseInt(s, 10) || 0,
    };
  }
  if (
    time &&
    typeof time.hour === "number" &&
    typeof time.minute === "number"
  ) {
    return {
      hour: time.hour,
      minute: time.minute,
      second: typeof time.second === "number" ? time.second : 0,
    };
  }
  return { hour: 0, minute: 0, second: 0 };
};
const toTimeString = (timeInput) => {
  const timeObj = normalizeTime(timeInput);
  return `${pad2(timeObj.hour)}:${pad2(timeObj.minute)}`;
};

const toDateTime = (dateStr, timeInput) => {
  const t = normalizeTime(timeInput);

  const [year, month, day] = dateStr.split("-").map(Number);

  const d = new Date(year, month - 1, day);

  d.setHours(t.hour, t.minute, t.second, 0);
  return d;
};
const computeDurationHours = (start, end) => {
  const ms = end.getTime() - start.getTime();
  return Math.max(1, Math.round(ms / (1000 * 60 * 60)));
};
const mapStatus = (status, start, end) => {
  const now = new Date();
  if (String(status).toUpperCase() === "CANCELLED") return "cancelled";
  if (end.getTime() < now.getTime()) return "past";
  return "confirmed";
};
const getCourtDetails = async (courtId) => {
  try {
    const { data } = await api.get(API_ENDPOINTS.COURTS_GET_BY_ID(courtId));
    const name = data?.name || data?.courtName || "Unknown Court";
    const sportRaw =
      data?.sport || data?.sportType || data?.type || "basketball";
    const sport = String(sportRaw).toLowerCase();
    return { courtName: name, sport };
  } catch (e) {
    return { courtName: "Unknown Court", sport: "basketball" };
  }
};
const mapBookingToUi = async (booking) => {
  const start = toDateTime(booking.date, booking.startTime);
  const end = toDateTime(booking.date, booking.endTime);
  const time = toTimeString(booking.startTime);
  const duration = computeDurationHours(start, end);
  const { courtName, sport } = await getCourtDetails(booking.courtId);

  return {
    id: booking.id,
    date: booking.date,
    time,
    duration,
    courtName,
    sport,
    status: mapStatus(booking.status, start, end),
  };
};

export const bookingService = {
  async getSports() {
    try {
      const response = await api.get("/courts/sports");

      return response.data.map((sportName) => ({
        id: sportName.toUpperCase(), // The ID must be the ENUM (SOCCER)
        name: sportName.charAt(0) + sportName.slice(1).toLowerCase(), // Soccer
        image: this._getSportImage(sportName),
      }));
    } catch (error) {
      console.warn("Using sports fallback...");
      const courts = await this.getCourts();
      const uniqueSports = [...new Set(courts.map((c) => c.sport))];
      return uniqueSports.map((sport) => ({
        id: sport.toUpperCase(),
        name: sport.charAt(0) + sport.slice(1).toLowerCase(),
        image: this._getSportImage(sport),
      }));
    }
  },

  async getMyReservations(userId) {
    const { data } = await api.get(API_ENDPOINTS.BOOKINGS_GET_USER(userId));
    if (!Array.isArray(data)) return [];
    const mapped = await Promise.all(data.map((b) => mapBookingToUi(b)));
    return mapped;
  },

  async getReservationById(id) {
    const { data } = await api.get(API_ENDPOINTS.BOOKINGS_GET_BY_ID(id));
    if (!data) return null;
    return await mapBookingToUi(data);
  },

  async cancelReservation(id) {
    const { data } = await api.patch(API_ENDPOINTS.BOOKINGS_CANCEL(id));
    return await mapBookingToUi(data);
  },

  async getCourts(sport = null) {
    try {
      const url = sport
        ? `${API_ENDPOINTS.COURTS_GET_ALL}?sportType=${sport.toUpperCase()}`
        : API_ENDPOINTS.COURTS_GET_ALL;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async createReservation(reservationData) {
    try {
      const payload = {
        courtId: reservationData.courtId,
        date: reservationData.date,
        startTime: reservationData.startTime,
      };

      const response = await api.post(API_ENDPOINTS.BOOKINGS_CREATE, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Visual helpers
  getTimeSlots(dateStr) {
    const dateObj = new Date(dateStr);
    const userTimezoneOffset = dateObj.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(dateObj.getTime() + userTimezoneOffset);

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return {
      day: days[adjustedDate.getDay()],
      date: adjustedDate.getDate(),
      month: months[adjustedDate.getMonth()],
      fullDate: dateStr.split("T")[0],
    };
  },

  _getSportImage(sport) {
    const s = sport ? sport.toUpperCase() : "";
    const images = {
      SOCCER:
        "https://i.ibb.co/Y4TWd2X5/Gemini-Generated-Image-z3xe1hz3xe1hz3xe.png",
      BASKETBALL: "https://i.ibb.co/BKHmTktB/unnamed-5.jpg",
      VOLLEYBALL:
        "https://i.ibb.co/8Dv8z7RH/Gemini-Generated-Image-rk7xsvrk7xsvrk7x.png",
      TENNIS:
        "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=1000&auto=format&fit=crop",
      PADEL:
        "https://images.unsplash.com/photo-1626248386187-57cb5d84c6c2?q=80&w=2000&auto=format&fit=crop",
    };
    return images[s] || "https://via.placeholder.com/200?text=Sport";
  },
};
