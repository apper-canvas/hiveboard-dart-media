import notificationsData from "@/services/mockData/notifications.json";

let notifications = [...notificationsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const notificationService = {
  async getAll() {
    await delay(300);
    return [...notifications].sort((a, b) => b.timestamp - a.timestamp);
  },

  async getUnreadCount() {
    await delay(100);
    return notifications.filter(n => !n.isRead).length;
  },

  async getByType(type) {
    await delay(200);
    return notifications.filter(n => n.type === type).sort((a, b) => b.timestamp - a.timestamp);
  },

  async getUnread() {
    await delay(200);
    return notifications.filter(n => !n.isRead).sort((a, b) => b.timestamp - a.timestamp);
  },

  async markAsRead(id) {
    await delay(150);
    const notificationIndex = notifications.findIndex(n => n.Id === id);
    if (notificationIndex === -1) {
      throw new Error("Notification not found");
    }
    
    notifications[notificationIndex] = { 
      ...notifications[notificationIndex], 
      isRead: true 
    };
    return { ...notifications[notificationIndex] };
  },

  async markAsUnread(id) {
    await delay(150);
    const notificationIndex = notifications.findIndex(n => n.Id === id);
    if (notificationIndex === -1) {
      throw new Error("Notification not found");
    }
    
    notifications[notificationIndex] = { 
      ...notifications[notificationIndex], 
      isRead: false 
    };
    return { ...notifications[notificationIndex] };
  },

  async markAllAsRead() {
    await delay(200);
    notifications = notifications.map(n => ({ ...n, isRead: true }));
    return true;
  },

  async delete(id) {
    await delay(150);
    const notificationIndex = notifications.findIndex(n => n.Id === id);
    if (notificationIndex === -1) {
      throw new Error("Notification not found");
    }
    
    notifications.splice(notificationIndex, 1);
    return true;
  },

  async clearAll() {
    await delay(200);
    notifications = [];
    return true;
  },

  async create(notificationData) {
    await delay(200);
    const newNotification = {
      Id: Math.max(...notifications.map(n => n.Id)) + 1,
      ...notificationData,
      isRead: false,
      timestamp: Date.now()
    };
    
    notifications.unshift(newNotification);
    return { ...newNotification };
  },

  // Utility method to get notification icon based on type
  getNotificationIcon(type) {
    const iconMap = {
      upvote_post: 'ArrowUp',
      upvote_comment: 'ArrowUp',
      reply: 'MessageCircle',
      mention: 'AtSign',
      new_follower: 'UserPlus',
      award: 'Award',
      content_removed: 'Trash2',
      ban: 'Shield',
      mod_invite: 'Crown',
      message: 'Mail'
    };
    return iconMap[type] || 'Bell';
  },

  // Utility method to get notification color based on type
  getNotificationColor(type) {
    const colorMap = {
      upvote_post: 'text-green-600',
      upvote_comment: 'text-green-600',
      reply: 'text-blue-600',
      mention: 'text-purple-600',
      new_follower: 'text-indigo-600',
      award: 'text-yellow-600',
      content_removed: 'text-red-600',
      ban: 'text-red-600',
      mod_invite: 'text-green-600',
      message: 'text-gray-600'
    };
    return colorMap[type] || 'text-gray-600';
  },

  // Get formatted notification type name
  getTypeDisplayName(type) {
    const displayMap = {
      upvote_post: 'Post Upvote',
      upvote_comment: 'Comment Upvote',
      reply: 'Reply',
      mention: 'Mention',
      new_follower: 'New Follower',
      award: 'Award',
      content_removed: 'Content Removed',
      ban: 'Ban',
      mod_invite: 'Mod Invite',
      message: 'Message'
    };
    return displayMap[type] || 'Notification';
  }
};