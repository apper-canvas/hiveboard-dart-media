import commentsData from "@/services/mockData/comments.json";

let comments = [...commentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const commentService = {
  async getByPostId(postId) {
    await delay(250);
    const postComments = comments.filter(c => c.postId === postId.toString());
    
    // Sort by timestamp (oldest first for threaded display)
    return postComments.sort((a, b) => a.timestamp - b.timestamp);
  },

  async getAll() {
    await delay(300);
    return [...comments];
  },

  async getById(id) {
    await delay(200);
    const comment = comments.find(c => c.Id === parseInt(id));
    if (!comment) {
      throw new Error("Comment not found");
    }
    return { ...comment };
  },

  async create(commentData) {
    await delay(400);
    const parentComment = commentData.parentId ? 
      comments.find(c => c.Id === parseInt(commentData.parentId)) : null;
    
const newComment = {
      Id: Math.max(...comments.map(c => c.Id)) + 1,
      postId: commentData.postId.toString(),
      content: commentData.content,
      authorUsername: commentData.authorUsername,
      upvotes: 1,
      downvotes: 0,
      timestamp: Date.now(),
      parentId: commentData.parentId || null,
      depth: parentComment ? parentComment.depth + 1 : 0,
      userVote: "up"
    };
    
    // Limit depth to 3 levels
    if (newComment.depth > 2) {
      newComment.depth = 2;
    }
    
    comments.push(newComment);
    return { ...newComment };
  },

  async vote(id, voteType) {
    await delay(200);
    const commentIndex = comments.findIndex(c => c.Id === parseInt(id));
    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }
    
    const comment = { ...comments[commentIndex] };
    const previousVote = comment.userVote;
    
    // Remove previous vote if exists
    if (previousVote === "up") {
      comment.upvotes--;
    } else if (previousVote === "down") {
      comment.downvotes--;
    }
    
    // Apply new vote or remove if same
    if (voteType === previousVote) {
      comment.userVote = null;
    } else {
      comment.userVote = voteType;
      if (voteType === "up") {
        comment.upvotes++;
      } else if (voteType === "down") {
        comment.downvotes++;
      }
    }
    
    comments[commentIndex] = comment;
    return { ...comment };
  },

  async update(id, data) {
    await delay(300);
    const commentIndex = comments.findIndex(c => c.Id === parseInt(id));
    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }
    
    comments[commentIndex] = { ...comments[commentIndex], ...data };
    return { ...comments[commentIndex] };
  },

  async delete(id) {
    await delay(300);
    const commentIndex = comments.findIndex(c => c.Id === parseInt(id));
    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }
    
    comments.splice(commentIndex, 1);
    return true;
  }
};