import messagesData from '@/services/mockData/messages.json';

// Helper function to simulate network delay
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mock message threads for each conversation
const messageThreads = {
  1: [
    {
      Id: 14,
      conversationId: 1,
      senderId: 1,
      content: "Hey Sarah! Did you see the latest discussion in r/technology?",
      timestamp: "2024-01-20T14:15:00Z",
      isRead: true
    },
    {
      Id: 15,
      conversationId: 1,
      senderId: 2,
      content: "Thanks for sharing that article! Really insightful perspective on community building.",
      timestamp: "2024-01-20T14:30:00Z",
      isRead: false
    }
  ],
  2: [
    {
      Id: 22,
      conversationId: 2,
      senderId: 3,
      content: "Hi John! I need help setting up community guidelines for my new subreddit.",
      timestamp: "2024-01-20T09:45:00Z",
      isRead: true
    },
    {
      Id: 23,
      conversationId: 2,
      senderId: 1,
      content: "Sure, I can help you set up the community guidelines. When works for you?",
      timestamp: "2024-01-20T10:15:00Z",
      isRead: true
    }
  ],
  3: [
    {
      Id: 30,
      conversationId: 3,
      senderId: 1,
      content: "Thanks for reading my post!",
      timestamp: "2024-01-19T16:30:00Z",
      isRead: true
    },
    {
      Id: 31,
      conversationId: 3,
      senderId: 4,
      content: "Hey! Loved your post about sustainable tech. We should collaborate on something similar.",
      timestamp: "2024-01-19T16:45:00Z",
      isRead: false
    }
  ],
  4: [
    {
      Id: 41,
      conversationId: 4,
      senderId: 1,
      content: "Great to see everyone at the meetup! Thanks for coming.",
      timestamp: "2024-01-18T19:10:00Z",
      isRead: true
    },
    {
      Id: 42,
      conversationId: 4,
      senderId: 5,
      content: "The community meetup was great! Thanks for organizing it.",
      timestamp: "2024-01-18T19:20:00Z",
      isRead: true
    }
  ],
  5: [
    {
      Id: 54,
      conversationId: 5,
      senderId: 1,
      content: "Sure, let me know what questions you have about the rollout.",
      timestamp: "2024-01-17T11:20:00Z",
      isRead: true
    },
    {
      Id: 55,
      conversationId: 5,
      senderId: 6,
      content: "Question about the new feature rollout - do you have time for a quick call?",
      timestamp: "2024-01-17T11:30:00Z",
      isRead: false
    },
    {
      Id: 56,
      conversationId: 5,
      senderId: 6,
      content: "Also, I noticed some issues with the mobile interface. Should I create a bug report?",
      timestamp: "2024-01-17T11:32:00Z",
      isRead: false
    },
    {
      Id: 57,
      conversationId: 5,
      senderId: 6,
      content: "Let me know when you're available!",
      timestamp: "2024-01-17T11:35:00Z",
      isRead: false
    }
  ]
};

let conversations = [...messagesData];
let nextConversationId = Math.max(...conversations.map(c => c.Id)) + 1;
let nextMessageId = Math.max(...Object.values(messageThreads).flat().map(m => m.Id)) + 1;

export const messageService = {
  // Get all conversations for current user
  async getConversations() {
    await delay(300);
    return conversations.map(conv => ({ ...conv })).sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  },

  // Get messages for a specific conversation
  async getMessages(conversationId) {
    await delay(200);
    const messages = messageThreads[conversationId] || [];
    return messages.map(msg => ({ ...msg }));
  },

  // Send a new message
  async sendMessage(conversationId, content, senderId = 1) {
    await delay(400);
    
    const newMessage = {
      Id: nextMessageId++,
      conversationId: parseInt(conversationId),
      senderId: parseInt(senderId),
      content: content.trim(),
      timestamp: new Date().toISOString(),
      isRead: false
    };

    // Add message to thread
    if (!messageThreads[conversationId]) {
      messageThreads[conversationId] = [];
    }
    messageThreads[conversationId].push(newMessage);

    // Update conversation last message and timestamp
    const convIndex = conversations.findIndex(c => c.Id === parseInt(conversationId));
    if (convIndex !== -1) {
      conversations[convIndex].lastMessage = { ...newMessage };
      conversations[convIndex].updatedAt = newMessage.timestamp;
      
      // Update unread count for other participants
      if (senderId !== 1) {
        conversations[convIndex].unreadCount = (conversations[convIndex].unreadCount || 0) + 1;
      }
    }

    return newMessage;
  },

  // Start a new conversation
  async startConversation(participantUsername, initialMessage) {
    await delay(500);
    
    // For demo, create a mock participant
    const participant = {
      Id: Math.floor(Math.random() * 1000) + 100,
      username: participantUsername,
      avatar: null
    };

    const newConversation = {
      Id: nextConversationId++,
      participants: [
        { Id: 1, username: "john_doe", avatar: null },
        participant
      ],
      lastMessage: null,
      unreadCount: 0,
      updatedAt: new Date().toISOString()
    };

    conversations.unshift(newConversation);

    // Send initial message if provided
    if (initialMessage?.trim()) {
      const firstMessage = await this.sendMessage(newConversation.Id, initialMessage, 1);
      newConversation.lastMessage = firstMessage;
    }

    return newConversation;
  },

  // Mark messages as read
  async markAsRead(conversationId) {
    await delay(200);
    
    // Mark all messages in conversation as read
    if (messageThreads[conversationId]) {
      messageThreads[conversationId].forEach(msg => {
        if (msg.senderId !== 1) { // Don't mark own messages as read
          msg.isRead = true;
        }
      });
    }

    // Reset unread count for conversation
    const convIndex = conversations.findIndex(c => c.Id === parseInt(conversationId));
    if (convIndex !== -1) {
      conversations[convIndex].unreadCount = 0;
    }

    return true;
  },

  // Get total unread message count
  async getUnreadCount() {
    await delay(100);
    return conversations.reduce((total, conv) => total + (conv.unreadCount || 0), 0);
  },

  // Search conversations
  async searchConversations(query) {
    await delay(300);
    
    if (!query.trim()) {
      return this.getConversations();
    }

    const searchTerm = query.toLowerCase();
    return conversations.filter(conv => {
      // Search in participant usernames
      const hasMatchingParticipant = conv.participants.some(p => 
        p.username.toLowerCase().includes(searchTerm)
      );
      
      // Search in last message content
      const hasMatchingMessage = conv.lastMessage?.content?.toLowerCase().includes(searchTerm);
      
      return hasMatchingParticipant || hasMatchingMessage;
    });
  },

  // Delete conversation
  async deleteConversation(conversationId) {
    await delay(300);
    
    const index = conversations.findIndex(c => c.Id === parseInt(conversationId));
    if (index !== -1) {
      conversations.splice(index, 1);
      delete messageThreads[conversationId];
      return true;
    }
    return false;
  }
};