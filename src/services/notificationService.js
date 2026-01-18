import api, { API_ENDPOINTS } from "./api";

/**
 * Notification Service
 * Handles all notification-related API calls
 */

/**
 * Get user notifications from MongoDB
 * @param {string} userId - User UUID
 * @returns {Promise<Array>} List of notifications
 */
export const getUserNotifications = async (userId) => {
  try {
    const response = await api.get(
      API_ENDPOINTS.NOTIFICATIONS_GET_USER(userId),
    );
    return response.data || [];
  } catch (error) {
    console.error("Error fetching user notifications:", error);
    throw error;
  }
};

/**
 * Get combined report with user data + notifications
 * Merges PostgreSQL user data with MongoDB notifications
 * @param {string} userId - User UUID
 * @returns {Promise<Object>} Combined report with userName, userEmail, totalNotifications, and notifications array
 */
export const getNotificationReport = async (userId) => {
  try {
    const response = await api.get(
      API_ENDPOINTS.NOTIFICATIONS_GET_REPORT(userId),
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching notification report:", error);
    throw error;
  }
};

/**
 * Format notification timestamp to readable format
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted time string
 */
export const formatNotificationTime = (timestamp) => {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  } catch (error) {
    return timestamp;
  }
};

/**
 * Get notification icon based on type
 * @param {string} type - Notification type (FORMAL, INFO, WARNING, ERROR)
 * @returns {string} Icon name for lucide-react
 */
export const getNotificationIcon = (type) => {
  const icons = {
    FORMAL: "Mail",
    INFO: "Info",
    WARNING: "AlertTriangle",
    ERROR: "AlertCircle",
    EMAIL: "Mail",
  };
  return icons[type] || "Bell";
};

/**
 * Get notification color based on type
 * @param {string} type - Notification type
 * @returns {string} Tailwind color class
 */
export const getNotificationColor = (type) => {
  const colors = {
    FORMAL: "bg-blue-50 border-blue-200",
    INFO: "bg-cyan-50 border-cyan-200",
    WARNING: "bg-yellow-50 border-yellow-200",
    ERROR: "bg-red-50 border-red-200",
    EMAIL: "bg-purple-50 border-purple-200",
  };
  return colors[type] || "bg-gray-50 border-gray-200";
};

export default {
  getUserNotifications,
  getNotificationReport,
  formatNotificationTime,
  getNotificationIcon,
  getNotificationColor,
};
