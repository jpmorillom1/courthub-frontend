import api from "./api";

/**
 * Payment Service - Handles payment processing with Stripe
 */
export const paymentService = {
  /**
   * Create a Stripe checkout session for a booking
   * @param {string} bookingId - The booking ID to create payment for
   * @returns {Promise<Object>} Payment response with checkout URL
   */
  async createCheckoutSession(bookingId) {
    const response = await api.post("/api/payments/checkout", {
      bookingId,
    });
    return response.data;
  },

  /**
   * Get payment information for a specific booking
   * @param {string} bookingId - The booking ID
   * @returns {Promise<Object>} Payment details
   */
  async getPaymentByBooking(bookingId) {
    const response = await api.get(`/api/payments/booking/${bookingId}`);
    return response.data;
  },

  /**
   * Get all payments for the current user
   * @returns {Promise<Array>} List of user payments
   */
  async getUserPayments() {
    const response = await api.get("/api/payments/user");
    return response.data;
  },
};
