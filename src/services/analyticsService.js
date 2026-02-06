import api from "./api";

export const analyticsService = {
  /**
   * Get analytics dashboard data (Admin only)
   * Returns KPIs, heatmap, faculty usage, student rankings, and reservation history
   */
  async getDashboardData() {
    try {
      const response = await api.get("/analytics/dashboard");
      return response.data;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  },
};
