import { userApi } from "./api";

export const userService = {
  async getAllUsers() {
    const resp = await userApi.get("/users");
    return resp.data;
  },

  async getUserById(userId) {
    const resp = await userApi.get(`/users/${userId}`);
    return resp.data;
  },

  async updateUser(userId, userData) {
    const resp = await userApi.put(`/users/${userId}`, userData);
    return resp.data;
  },

  async deleteUser(userId) {
    const resp = await userApi.delete(`/users/${userId}`);
    return resp.data;
  },

  async getCurrentUserProfile() {
    const resp = await userApi.get("/users/me");
    return resp.data;
  },
};
