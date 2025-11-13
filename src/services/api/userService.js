import usersData from "@/services/mockData/users.json";

let users = [...usersData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const userService = {
  async getAll() {
    await delay(300);
    return [...users].sort((a, b) => b.karma - a.karma);
  },

  async getById(username) {
    await delay(200);
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!user) {
      throw new Error("User not found");
    }
    return { ...user };
  },

  async getCurrentUser() {
    await delay(150);
    // For demo purposes, return a mock current user
    return {
      username: "current_user",
      karma: 1337,
      joinedAt: Date.now() - (30 * 24 * 60 * 60 * 1000), // 30 days ago
      subscribedCommunities: ["technology", "programming", "science"]
    };
  },

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return users.filter(u => u.username.toLowerCase().includes(searchTerm));
  },

  async create(userData) {
    await delay(400);
    const newUser = {
      username: userData.username.toLowerCase(),
      karma: 0,
      joinedAt: Date.now(),
      subscribedCommunities: []
    };
    
    users.push(newUser);
    return { ...newUser };
  },

  async update(username, data) {
    await delay(300);
    const userIndex = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
    users[userIndex] = { ...users[userIndex], ...data };
    return { ...users[userIndex] };
  },

  async delete(username) {
    await delay(300);
    const userIndex = users.findIndex(u => u.username.toLowerCase() === username.toLowerCase());
    if (userIndex === -1) {
      throw new Error("User not found");
    }
    
    users.splice(userIndex, 1);
    return true;
  }
};