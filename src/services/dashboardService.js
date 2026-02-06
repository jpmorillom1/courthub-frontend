const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const dashboardService = {
  async getKPIs() {
    await delay(600);
    return [
      {
        title: "Real Occupancy Rate",
        value: "68%",
        change: "+5.2%",
        trend: "up",
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        title: "Unique Students Benefited",
        value: "1,247",
        change: "+89 this week",
        trend: "up",
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        title: "No-Show Rate",
        value: "12.3%",
        change: "+2.1%",
        trend: "down",
        color: "text-red-600",
        bgColor: "bg-red-50",
      },
      {
        title: "Maintenance Hours",
        value: "24h",
        change: "This week",
        trend: "neutral",
        color: "text-gray-600",
        bgColor: "bg-gray-50",
      },
    ];
  },

  async getFacultyDistribution() {
    await delay(500);
    return [
      { name: "Engineering", value: 40, color: "#003f8f" },
      { name: "Medicine", value: 20, color: "#cbab42" },
      { name: "Arts", value: 10, color: "#10b981" },
      { name: "Business", value: 15, color: "#8b5cf6" },
      { name: "Sciences", value: 15, color: "#f59e0b" },
    ];
  },

  async getReservationTrends() {
    await delay(500);
    return [
      { month: "Oct", completed: 340, cancelled: 45 },
      { month: "Nov", completed: 380, cancelled: 52 },
      { month: "Dec", completed: 420, cancelled: 38 },
      { month: "Jan", completed: 390, cancelled: 48 },
      { month: "Feb", completed: 450, cancelled: 41 },
      { month: "Mar", completed: 480, cancelled: 35 },
    ];
  },

  async getPeakHours() {
    await delay(400);
    return [
      {
        day: "Mon",
        "08:00": 20,
        "10:00": 45,
        "12:00": 80,
        "14:00": 90,
        "16:00": 95,
        "18:00": 85,
        "20:00": 60,
      },
      {
        day: "Tue",
        "08:00": 25,
        "10:00": 50,
        "12:00": 75,
        "14:00": 85,
        "16:00": 92,
        "18:00": 88,
        "20:00": 65,
      },
      {
        day: "Wed",
        "08:00": 30,
        "10:00": 55,
        "12:00": 82,
        "14:00": 88,
        "16:00": 90,
        "18:00": 80,
        "20:00": 55,
      },
      {
        day: "Thu",
        "08:00": 22,
        "10:00": 48,
        "12:00": 78,
        "14:00": 92,
        "16:00": 98,
        "18:00": 90,
        "20:00": 68,
      },
      {
        day: "Fri",
        "08:00": 18,
        "10:00": 42,
        "12:00": 70,
        "14:00": 75,
        "16:00": 80,
        "18:00": 70,
        "20:00": 50,
      },
    ];
  },

  async getSanctions() {
    await delay(500);
    return [
      {
        name: "Michael Chen",
        faculty: "Engineering",
        noShows: 8,
        status: "Blocked",
      },
      {
        name: "Emma Rodriguez",
        faculty: "Medicine",
        noShows: 6,
        status: "Active",
      },
      {
        name: "James Wilson",
        faculty: "Business",
        noShows: 5,
        status: "Active",
      },
      { name: "Olivia Brown", faculty: "Arts", noShows: 5, status: "Active" },
      {
        name: "Lucas Martinez",
        faculty: "Engineering",
        noShows: 4,
        status: "Active",
      },
    ];
  },

  async getTopStudents() {
    await delay(500);
    return [
      {
        name: "Sarah Johnson",
        faculty: "Engineering",
        reservations: 42,
        attendance: "95%",
      },
      {
        name: "David Lee",
        faculty: "Sciences",
        reservations: 38,
        attendance: "97%",
      },
      {
        name: "Sophia Anderson",
        faculty: "Medicine",
        reservations: 35,
        attendance: "94%",
      },
      {
        name: "Noah Taylor",
        faculty: "Business",
        reservations: 32,
        attendance: "100%",
      },
      {
        name: "Ava Garcia",
        faculty: "Arts",
        reservations: 28,
        attendance: "93%",
      },
    ];
  },

  async getIncidents() {
    await delay(500);
    return [
      {
        court: "Basketball Court 2",
        issue: "Broken net on south basket",
        severity: "Medium",
        date: "2023-12-20",
        status: "In Progress",
      },
      {
        court: "Soccer Field 1",
        issue: "Light out on northwest corner",
        severity: "High",
        date: "2023-12-19",
        status: "Pending",
      },
      {
        court: "Tennis Court 1",
        issue: "Court surface cracking",
        severity: "Low",
        date: "2023-12-18",
        status: "Scheduled",
      },
      {
        court: "Volleyball Court",
        issue: "Net tension adjustment needed",
        severity: "Low",
        date: "2023-12-17",
        status: "Resolved",
      },
    ];
  },
};
