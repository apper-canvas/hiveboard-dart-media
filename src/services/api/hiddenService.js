import { postService } from './postService';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const hiddenService = {
  // Get all hidden posts
  async getHiddenPosts() {
    return await postService.getHiddenPosts();
  },
  
  // Hide post
  async hidePost(postId) {
    return await postService.hidePost(postId);
  },
  
  // Unhide post
  async unhidePost(postId) {
    return await postService.unhidePost(postId);
  },
  
  // Bulk operations
  async bulkUnhide(postIds) {
    await delay(400);
    const results = [];
    
    for (const postId of postIds) {
      try {
        await postService.unhidePost(postId);
        results.push({ id: postId, success: true });
      } catch (error) {
        results.push({ id: postId, success: false, error: error.message });
      }
    }
    
    return results;
  },
  
  async bulkDelete(postIds) {
    await delay(400);
    // For now, we'll just unhide them since we don't have permanent delete
    return await this.bulkUnhide(postIds);
  }
};