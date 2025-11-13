import postsData from "@/services/mockData/posts.json";

let posts = [...postsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const postService = {
  async getAll(filter = "hot", limit = 10, offset = 0) {
    await delay(300);
    
    let sortedPosts = [...posts];
    
    switch (filter) {
      case "hot":
        sortedPosts.sort((a, b) => {
          const aScore = a.upvotes - a.downvotes + (a.commentCount * 0.5);
          const bScore = b.upvotes - b.downvotes + (b.commentCount * 0.5);
          return bScore - aScore;
        });
        break;
      case "new":
        sortedPosts.sort((a, b) => b.timestamp - a.timestamp);
        break;
      case "top":
        sortedPosts.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        break;
      case "rising":
        const now = Date.now();
        sortedPosts = sortedPosts.filter(post => now - post.timestamp < 24 * 60 * 60 * 1000);
        sortedPosts.sort((a, b) => {
          const aRise = (a.upvotes - a.downvotes) / Math.max((now - a.timestamp) / (60 * 60 * 1000), 1);
          const bRise = (b.upvotes - b.downvotes) / Math.max((now - b.timestamp) / (60 * 60 * 1000), 1);
          return bRise - aRise;
        });
        break;
    }
    
    return sortedPosts.slice(offset, offset + limit);
  },

  async getById(id) {
    await delay(200);
    const post = posts.find(p => p.Id === parseInt(id));
    if (!post) {
      throw new Error("Post not found");
    }
    return { ...post };
  },

  async getByCommunity(communityName, filter = "hot", limit = 10, offset = 0) {
    await delay(300);
    const communityPosts = posts.filter(p => p.communityName.toLowerCase() === communityName.toLowerCase());
    
    let sortedPosts = [...communityPosts];
    
    switch (filter) {
      case "hot":
        sortedPosts.sort((a, b) => {
          const aScore = a.upvotes - a.downvotes + (a.commentCount * 0.5);
          const bScore = b.upvotes - b.downvotes + (b.commentCount * 0.5);
          return bScore - aScore;
        });
        break;
      case "new":
        sortedPosts.sort((a, b) => b.timestamp - a.timestamp);
        break;
      case "top":
        sortedPosts.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        break;
      case "rising":
        const now = Date.now();
        sortedPosts = sortedPosts.filter(post => now - post.timestamp < 24 * 60 * 60 * 1000);
        sortedPosts.sort((a, b) => {
          const aRise = (a.upvotes - a.downvotes) / Math.max((now - a.timestamp) / (60 * 60 * 1000), 1);
          const bRise = (b.upvotes - b.downvotes) / Math.max((now - b.timestamp) / (60 * 60 * 1000), 1);
          return bRise - aRise;
        });
        break;
    }
    
    return sortedPosts.slice(offset, offset + limit);
  },

  async create(postData) {
    await delay(400);
    const newPost = {
      Id: Math.max(...posts.map(p => p.Id)) + 1,
      title: postData.title,
      content: postData.content,
      contentType: postData.contentType || "text",
      thumbnailUrl: postData.thumbnailUrl || null,
      authorUsername: postData.authorUsername,
      communityName: postData.communityName,
      upvotes: 1,
      downvotes: 0,
      commentCount: 0,
      timestamp: Date.now(),
      userVote: "up"
    };
    
    posts.unshift(newPost);
    return { ...newPost };
  },

  async vote(id, voteType) {
    await delay(200);
    const postIndex = posts.findIndex(p => p.Id === parseInt(id));
    if (postIndex === -1) {
      throw new Error("Post not found");
    }
    
    const post = { ...posts[postIndex] };
    const previousVote = post.userVote;
    
    // Remove previous vote if exists
    if (previousVote === "up") {
      post.upvotes--;
    } else if (previousVote === "down") {
      post.downvotes--;
    }
    
    // Apply new vote or remove if same
    if (voteType === previousVote) {
      post.userVote = null;
    } else {
      post.userVote = voteType;
      if (voteType === "up") {
        post.upvotes++;
      } else if (voteType === "down") {
        post.downvotes++;
      }
    }
    
    posts[postIndex] = post;
    return { ...post };
  },

  async update(id, data) {
    await delay(300);
    const postIndex = posts.findIndex(p => p.Id === parseInt(id));
    if (postIndex === -1) {
      throw new Error("Post not found");
    }
    
    posts[postIndex] = { ...posts[postIndex], ...data };
    return { ...posts[postIndex] };
  },

  async delete(id) {
    await delay(300);
    const postIndex = posts.findIndex(p => p.Id === parseInt(id));
    if (postIndex === -1) {
      throw new Error("Post not found");
    }
    
    posts.splice(postIndex, 1);
    return true;
  }
};