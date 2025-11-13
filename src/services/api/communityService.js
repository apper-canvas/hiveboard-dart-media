import communitiesData from "@/services/mockData/communities.json";

let communities = [...communitiesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const communityService = {
  async getAll() {
    await delay(250);
    return [...communities].sort((a, b) => b.memberCount - a.memberCount);
  },

  async getById(name) {
    await delay(200);
    const community = communities.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (!community) {
      throw new Error("Community not found");
    }
    return { ...community };
  },

  async getPopular(limit = 10) {
    await delay(300);
    return [...communities]
      .sort((a, b) => b.memberCount - a.memberCount)
      .slice(0, limit);
  },

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return communities.filter(c => 
      c.name.toLowerCase().includes(searchTerm) || 
      c.description.toLowerCase().includes(searchTerm)
    );
  },

  async create(communityData) {
    await delay(400);
    const newCommunity = {
      name: communityData.name.toLowerCase(),
      description: communityData.description,
      memberCount: 1,
      postCount: 0,
      createdAt: Date.now()
    };
    
    communities.push(newCommunity);
    return { ...newCommunity };
  },

  async update(name, data) {
    await delay(300);
    const communityIndex = communities.findIndex(c => c.name.toLowerCase() === name.toLowerCase());
    if (communityIndex === -1) {
      throw new Error("Community not found");
    }
    
    communities[communityIndex] = { ...communities[communityIndex], ...data };
    return { ...communities[communityIndex] };
  },

  async delete(name) {
    await delay(300);
    const communityIndex = communities.findIndex(c => c.name.toLowerCase() === name.toLowerCase());
    if (communityIndex === -1) {
      throw new Error("Community not found");
    }
    
    communities.splice(communityIndex, 1);
    return true;
  }
};