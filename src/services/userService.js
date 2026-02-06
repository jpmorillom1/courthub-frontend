import api, { API_ENDPOINTS } from "./api";

/**
 * User Service
 * Handles all user-related API calls through the API Gateway
 * Users are returned as UserDto: { id (UUID), email, name, faculty, roles (Set) }
 */
export const userService = {
  /**
   * Get current authenticated user profile
   * @returns {Promise<Object>} UserDto object
   */
  async getCurrentUserProfile() {
    try {
      const response = await api.get(API_ENDPOINTS.USERS_PROFILE);
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },

  /**
   * Get user by ID
   * @param {string} userId - UUID of the user
   * @returns {Promise<Object>} UserDto object
   */
  async getUserById(userId) {
    try {
      const response = await api.get(API_ENDPOINTS.USERS_GET_BY_ID(userId));
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Get all users (Admin only)
   * @returns {Promise<Array>} Array of UserDto objects
   */
  async getAllUsers() {
    try {
      const response = await api.get("/users/internal/users/all");
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  /**
   * Update user information
   * @param {string} userId - UUID of the user
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated UserDto object
   */
  async updateUser(userId, userData) {
    try {
      const response = await api.put(
        API_ENDPOINTS.USERS_GET_BY_ID(userId),
        userData
      );
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Delete user account
   * @param {string} userId - UUID of the user
   * @returns {Promise<Object>} Deletion confirmation
   */
  async deleteUser(userId) {
    try {
      const response = await api.delete(API_ENDPOINTS.USERS_GET_BY_ID(userId));
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Get current user from localStorage (cached)
   * @returns {Object|null} Cached user object or null
   */
  getCurrentUser() {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  },

  /**
   * Check if user has specific role
   * @param {Object} user - User object
   * @param {string} role - Role to check (e.g., 'ADMIN',  'USER')
   * @returns {boolean} True if user has role
   */
  hasRole(user, role) {
    if (!user || !user.roles) {
      return false;
    }
    // Roles might be a Set or array
    if (user.roles instanceof Set) {
      return user.roles.has(role);
    }
    return Array.isArray(user.roles) && user.roles.includes(role);
  },

  /**
   * Check if user is admin
   * @param {Object} user - User object
   * @returns {boolean} True if user is admin
   */
  isAdmin(user) {
    return this.hasRole(user, "ADMIN");
  },

  /**
   * Check if user is staff/manager
   * @param {Object} user - User object
   * @returns {boolean} True if user is staff or manager
   */
  isStaff(user) {
    return this.hasRole(user, "STAFF") || this.hasRole(user, "MANAGER");
  },

  /**
   * Format user display name
   * @param {Object} user - User object
   * @returns {string} Formatted display name
   */
  getDisplayName(user) {
    if (!user) return "Unknown User";
    return user.name || user.email || "Unknown User";
  },
};
