import api, { API_ENDPOINTS } from "./api";

export const bookingService = {
  // 1. Gets the list of sports (New endpoint)
  async getSports() {
    try {
      // Assuming your endpoint is /courts/sports and returns a list of strings or objects
      // If it's not ready yet, the catch will use the fallback.
      const response = await api.get("/courts/sports");

      // We map the response to have image (you can adjust this according to your actual response)
      return response.data.map((sportName) => ({
        id: sportName.toUpperCase(), // The ID must be the ENUM (SOCCER)
        name: sportName.charAt(0) + sportName.slice(1).toLowerCase(), // Soccer
        image: this._getSportImage(sportName),
      }));
    } catch (error) {
      console.warn("Using sports fallback...");
      // Fallback: we get all courts and extract unique sports
      const courts = await this.getCourts();
      const uniqueSports = [...new Set(courts.map((c) => c.sport))];
      return uniqueSports.map((sport) => ({
        id: sport.toUpperCase(),
        name: sport.charAt(0) + sport.slice(1).toLowerCase(),
        image: this._getSportImage(sport),
      }));
    }
  },

  // 2. Gets courts filtered by the 'sportType' param from Backend
  async getCourts(sport = null) {
    try {
      // The Java backend expects ?sportType=SOCCER (not ?sport=soccer)
      const url = sport
        ? `${API_ENDPOINTS.COURTS_GET_ALL}?sportType=${sport.toUpperCase()}`
        : API_ENDPOINTS.COURTS_GET_ALL;
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 3. Create Reservation (Adjusted to the Body you gave me)
  async createReservation(reservationData) {
    try {
      // Your backend expects: { courtId, date, startTime }
      // endTime is not necessary according to your JSON example.
      const payload = {
        courtId: reservationData.courtId,
        date: reservationData.date, // "2026-01-19"
        startTime: reservationData.startTime, // "19:00" (sin reemplazar : por -)
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
    // Simple adjustment to avoid timezone offset when displaying day
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
