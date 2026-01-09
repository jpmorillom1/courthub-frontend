const mockCourts = {
  soccer: [
    {
      id: "s1",
      name: "Soccer Field 1",
      available: true,
      surfaceType: "Synthetic",
      capacity: 22,
    },
    {
      id: "s2",
      name: "Soccer Field 2",
      available: false,
      surfaceType: "Natural Grass",
      capacity: 22,
    },
  ],
  basketball: [
    {
      id: "b1",
      name: "Basketball Court 1",
      available: true,
      surfaceType: "Concrete",
      capacity: 10,
    },
    {
      id: "b2",
      name: "Basketball Court 2",
      available: true,
      surfaceType: "Wood",
      capacity: 10,
    },
    {
      id: "b3",
      name: "Basketball Court 3",
      available: false,
      surfaceType: "Concrete",
      capacity: 10,
    },
  ],
  volleyball: [
    {
      id: "v1",
      name: "Volleyball Court",
      available: true,
      surfaceType: "Concrete",
      capacity: 12,
    },
  ],
};

const mockReservations = [
  {
    id: "1",
    userId: "2",
    sport: "basketball",
    courtId: "b1",
    courtName: "Basketball Court 1",
    date: "2023-12-28",
    time: "15:00",
    duration: 2,
    status: "confirmed",
    createdAt: "2023-12-20T10:00:00Z",
  },
  {
    id: "2",
    userId: "2",
    sport: "soccer",
    courtId: "s1",
    courtName: "Soccer Field 1",
    date: "2023-12-30",
    time: "10:00",
    duration: 2,
    status: "confirmed",
    createdAt: "2023-12-21T14:00:00Z",
  },
  {
    id: "3",
    userId: "2",
    sport: "volleyball",
    courtId: "v1",
    courtName: "Volleyball Court",
    date: "2023-12-20",
    time: "08:00",
    duration: 1,
    status: "past",
    createdAt: "2023-12-15T09:00:00Z",
  },
  {
    id: "4",
    userId: "2",
    sport: "basketball",
    courtId: "b2",
    courtName: "Basketball Court 2",
    date: "2023-12-15",
    time: "16:00",
    duration: 2,
    status: "cancelled",
    createdAt: "2023-12-10T11:00:00Z",
  },
];

const unavailableSlots = new Set([
  "Tue-10:00",
  "Tue-14:00",
  "Wed-12:00",
  "Thu-16:00",
  "Sat-18:00",
]);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const bookingService = {
  async getSports() {
    await delay(500);
    return [
      {
        id: "soccer",
        name: "Soccer",
        image:
          "https://i.ibb.co/Y4TWd2X5/Gemini-Generated-Image-z3xe1hz3xe1hz3xe.png",
      },
      {
        id: "basketball",
        name: "Basketball",
        image: "https://i.ibb.co/BKHmTktB/unnamed-5.jpg",
      },
      {
        id: "volleyball",
        name: "Volleyball",
        image:
          "https://i.ibb.co/8Dv8z7RH/Gemini-Generated-Image-rk7xsvrk7xsvrk7x.png",
      },
    ];
  },

  async getCourts(sport) {
    await delay(500);
    return mockCourts[sport] || [];
  },

  async getAvailability(courtId, date) {
    await delay(400);
    const timeSlots = [
      "08:00",
      "10:00",
      "12:00",
      "14:00",
      "16:00",
      "18:00",
      "20:00",
    ];
    return timeSlots.map((time) => ({
      time,
      available: !unavailableSlots.has(`${date}-${time}`),
    }));
  },

  async createReservation(reservationData) {
    await delay(1000);

    const newReservation = {
      id: String(mockReservations.length + 1),
      ...reservationData,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    mockReservations.push(newReservation);
    return newReservation;
  },

  async getMyReservations(userId) {
    await delay(600);
    return mockReservations.filter((r) => r.userId === userId);
  },

  async getReservationById(reservationId) {
    await delay(400);
    const reservation = mockReservations.find((r) => r.id === reservationId);
    if (!reservation) {
      throw new Error("Reservation not found");
    }
    return reservation;
  },

  async cancelReservation(reservationId) {
    await delay(500);
    const reservation = mockReservations.find((r) => r.id === reservationId);
    if (reservation) {
      reservation.status = "cancelled";
      return reservation;
    }
    throw new Error("Reservation not found");
  },

  async getTimeSlots(date) {
    await delay(300);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dateObj = new Date(date);
    const dayIndex = dateObj.getDay();
    const day = days[dayIndex];
    const dateNum = dateObj.getDate();
    const monthNames = [
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
    const month = monthNames[dateObj.getMonth()];

    return {
      day,
      date: dateNum,
      month,
      slots: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
    };
  },
};
