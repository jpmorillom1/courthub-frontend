import api, { API_ENDPOINTS } from "./api";

export const courtIssueService = {
  /**
   * Get all available severity levels
   */
  async getSeverityLevels() {
    try {
      const response = await api.get("/courts/issues/severity-levels");
      return response.data;
    } catch (error) {
      console.error("Error fetching severity levels:", error);
      // Fallback to known severity levels
      return ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
    }
  },

  /**
   * Report a new court issue
   * @param {UUID} courtId - Court ID
   * @param {Object} issueData - Issue data (title, description, severity)
   */
  async reportIssue(courtId, issueData) {
    try {
      const payload = {
        courtId: courtId,
        title: issueData.title,
        description: issueData.description,
        severity: issueData.severity,
      };

      const response = await api.post(`/courts/${courtId}/issues`, payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all issues for a specific court
   * @param {UUID} courtId - Court ID
   */
  async getCourtIssues(courtId) {
    try {
      const response = await api.get(`/courts/${courtId}/issues`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get issue details by ID
   * @param {UUID} issueId - Issue ID
   */
  async getIssueById(issueId) {
    try {
      const response = await api.get(`/courts/issues/${issueId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all pending issues (Admin only)
   */
  async getAllPendingIssues() {
    try {
      const response = await api.get("/courts/issues");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update issue status (Admin only)
   * @param {UUID} issueId - Issue ID
   * @param {Object} statusUpdate - { status: "REPORTED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" }
   */
  async updateIssueStatus(issueId, statusUpdate) {
    try {
      const response = await api.patch(`/courts/issues/${issueId}/status`, statusUpdate);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
