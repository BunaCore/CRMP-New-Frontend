export interface TeamMember {
  id: string
  name: string
  email: string
  role: "Principal Investigator" | "Co-Investigator" | "Research Assistant" | "Graduate Student" | "Postdoctoral Fellow"
  status: "Active" | "Inactive" | "Pending"
  avatar?: string
  department: string
  joinedAt: string
  expertise: string[]
  isOnline?: boolean
  lastSeen?: string
}

export const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Dr. Tsedniya Frezewed",
    email: "tsedniya.f@astu.edu.et",
    role: "Principal Investigator",
    status: "Active",
    department: "Computer Science",
    joinedAt: "2024-01-15",
    expertise: ["Machine Learning", "Data Science", "AI Systems"],
    isOnline: true,
    lastSeen: new Date().toISOString()
  },
  {
    id: "2",
    name: "Betelhem Tekle",
    email: "betelhem.t@astu.edu.et",
    role: "Co-Investigator",
    status: "Active",
    department: "Software Engineering",
    joinedAt: "2024-02-01",
    expertise: ["Web Development", "System Architecture", "Cloud Computing"],
    isOnline: true,
    lastSeen: new Date().toISOString()
  },
  {
    id: "3",
    name: "Dagim Chernet",
    email: "dagim.c@astu.edu.et",
    role: "Research Assistant",
    status: "Active",
    department: "Information Technology",
    joinedAt: "2024-03-10",
    expertise: ["Database Management", "Backend Development"],
    isOnline: true,
    lastSeen: new Date().toISOString()
  },
  {
    id: "4",
    name: "Dagimawi Negusse",
    email: "dagimawi.n@astu.edu.et",
    role: "Graduate Student",
    status: "Active",
    department: "Computer Science",
    joinedAt: "2024-04-05",
    expertise: ["UI/UX Design", "Frontend Development"],
    isOnline: false,
    lastSeen: new Date(Date.now() - 30 * 60000).toISOString()
  },
  {
    id: "5",
    name: "Natnael Tilahun",
    email: "natnael.t@astu.edu.et",
    role: "Graduate Student",
    status: "Pending",
    department: "Software Engineering",
    joinedAt: "2024-05-20",
    expertise: ["Mobile Development", "API Design"],
    isOnline: false,
    lastSeen: new Date(Date.now() - 2 * 3600000).toISOString()
  },
  {
    id: "6",
    name: "Dr. Yoseph Bizuneh",
    email: "yoseph.b@astu.edu.et",
    role: "Co-Investigator",
    status: "Active",
    department: "Computer Science",
    joinedAt: "2024-01-15",
    expertise: ["Research Methodology", "Academic Writing", "Project Management"],
    isOnline: true,
    lastSeen: new Date().toISOString()
  },
  {
    id: "7",
    name: "Hanna Mekonnen",
    email: "hanna.m@astu.edu.et",
    role: "Postdoctoral Fellow",
    status: "Inactive",
    department: "Information Systems",
    joinedAt: "2023-09-01",
    expertise: ["Data Analytics", "Statistical Modeling"],
    isOnline: false,
    lastSeen: new Date(Date.now() - 24 * 3600000).toISOString()
  },
  {
    id: "8",
    name: "Samuel Abebe",
    email: "samuel.a@astu.edu.et",
    role: "Research Assistant",
    status: "Active",
    department: "Computer Science",
    joinedAt: "2024-06-15",
    expertise: ["DevOps", "Infrastructure"],
    isOnline: true,
    lastSeen: new Date().toISOString()
  }
]

export const roleOptions = [
  "Principal Investigator",
  "Co-Investigator",
  "Research Assistant",
  "Graduate Student",
  "Postdoctoral Fellow"
] as const

export const statusOptions = ["Active", "Inactive", "Pending"] as const

export const departmentOptions = [
  "Computer Science",
  "Software Engineering",
  "Information Technology",
  "Information Systems",
  "Electrical Engineering"
] as const

// Group Chat Types
export interface ChatRoom {
  id: string
  name: string
  type: "group" | "direct"
  description?: string
  memberIds: string[]
  createdAt: string
  lastActivity: string
  unreadCount?: number
}

export interface GroupChatMessage {
  id: string
  roomId: string
  senderId: string
  senderName: string
  content: string
  timestamp: string
  isRead: boolean
  readBy: string[]
  reactions?: { emoji: string; userIds: string[] }[]
}

// Chat Rooms
export const chatRooms: ChatRoom[] = [
  {
    id: "room-1",
    name: "ASTU Research Platform",
    type: "group",
    description: "Main project discussion channel for the Collaborative Research Management Platform",
    memberIds: ["1", "2", "3", "4", "5", "6", "7", "8"],
    createdAt: "2024-01-15T08:00:00",
    lastActivity: new Date().toISOString(),
    unreadCount: 3
  },
  {
    id: "room-2",
    name: "Development Team",
    type: "group",
    description: "Technical discussions and code reviews",
    memberIds: ["2", "3", "4", "8"],
    createdAt: "2024-02-01T10:00:00",
    lastActivity: new Date(Date.now() - 30 * 60000).toISOString(),
    unreadCount: 0
  },
  {
    id: "room-3",
    name: "Research Committee",
    type: "group",
    description: "Research methodology and findings",
    memberIds: ["1", "6", "7"],
    createdAt: "2024-01-20T09:00:00",
    lastActivity: new Date(Date.now() - 2 * 3600000).toISOString(),
    unreadCount: 1
  },
  // Direct Message Rooms (1-on-1 conversations)
  {
    id: "dm-1-2",
    name: "Dr. Tsedniya Frezewed",
    type: "direct",
    memberIds: ["1", "2"],
    createdAt: "2024-01-20T10:00:00",
    lastActivity: new Date(Date.now() - 20 * 60000).toISOString(),
    unreadCount: 2
  },
  {
    id: "dm-2-3",
    name: "Dagim Chernet",
    type: "direct",
    memberIds: ["2", "3"],
    createdAt: "2024-02-15T14:00:00",
    lastActivity: new Date(Date.now() - 1 * 3600000).toISOString(),
    unreadCount: 0
  },
  {
    id: "dm-2-6",
    name: "Dr. Yoseph Bizuneh",
    type: "direct",
    memberIds: ["2", "6"],
    createdAt: "2024-02-20T09:00:00",
    lastActivity: new Date(Date.now() - 3 * 3600000).toISOString(),
    unreadCount: 1
  },
  {
    id: "dm-2-8",
    name: "Samuel Abebe",
    type: "direct",
    memberIds: ["2", "8"],
    createdAt: "2024-03-01T11:00:00",
    lastActivity: new Date(Date.now() - 45 * 60000).toISOString(),
    unreadCount: 0
  },
  {
    id: "dm-2-4",
    name: "Dagimawi Negusse",
    type: "direct",
    memberIds: ["2", "4"],
    createdAt: "2024-03-05T16:00:00",
    lastActivity: new Date(Date.now() - 5 * 3600000).toISOString(),
    unreadCount: 0
  }
]

// Group Chat Messages with multiple participants
export const groupChatMessages: Record<string, GroupChatMessage[]> = {
  "room-1": [
    {
      id: "gm1",
      roomId: "room-1",
      senderId: "1",
      senderName: "Dr. Tsedniya Frezewed",
      content: "Good morning everyone! I wanted to discuss the progress on the research platform. How are things going?",
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      isRead: true,
      readBy: ["1", "2", "3", "6", "8"]
    },
    {
      id: "gm2",
      roomId: "room-1",
      senderId: "2",
      senderName: "Betelhem Tekle",
      content: "Good morning Dr. Tsedniya! The frontend development is progressing well. We have completed the dashboard and team management modules.",
      timestamp: new Date(Date.now() - 1.9 * 3600000).toISOString(),
      isRead: true,
      readBy: ["1", "2", "3", "6", "8"]
    },
    {
      id: "gm3",
      roomId: "room-1",
      senderId: "3",
      senderName: "Dagim Chernet",
      content: "The database schema is finalized and I have set up the API endpoints. Backend is ready for integration testing.",
      timestamp: new Date(Date.now() - 1.8 * 3600000).toISOString(),
      isRead: true,
      readBy: ["1", "2", "3", "6", "8"]
    },
    {
      id: "gm4",
      roomId: "room-1",
      senderId: "6",
      senderName: "Dr. Yoseph Bizuneh",
      content: "Excellent progress! I have been reviewing the research documentation module requirements. We should ensure it supports multiple citation formats.",
      timestamp: new Date(Date.now() - 1.5 * 3600000).toISOString(),
      isRead: true,
      readBy: ["1", "2", "3", "6", "8"]
    },
    {
      id: "gm5",
      roomId: "room-1",
      senderId: "8",
      senderName: "Samuel Abebe",
      content: "I have configured the CI/CD pipeline. All deployments are now automated and we have staging and production environments ready.",
      timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
      isRead: true,
      readBy: ["1", "2", "6", "8"]
    },
    {
      id: "gm6",
      roomId: "room-1",
      senderId: "1",
      senderName: "Dr. Tsedniya Frezewed",
      content: "Great work team! Let us schedule a demo for next week. @Betelhem can you coordinate with everyone for availability?",
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      isRead: true,
      readBy: ["1", "2", "6"]
    },
    {
      id: "gm7",
      roomId: "room-1",
      senderId: "2",
      senderName: "Betelhem Tekle",
      content: "Of course! I will send out a poll for available times. Also, Dagimawi has been working on some new UI improvements.",
      timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
      isRead: true,
      readBy: ["1", "2"]
    },
    {
      id: "gm8",
      roomId: "room-1",
      senderId: "3",
      senderName: "Dagim Chernet",
      content: "Should I prepare the API documentation for the demo as well?",
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      isRead: false,
      readBy: ["3"]
    },
    {
      id: "gm9",
      roomId: "room-1",
      senderId: "6",
      senderName: "Dr. Yoseph Bizuneh",
      content: "Yes please, that would be helpful. Include examples of the main endpoints.",
      timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
      isRead: false,
      readBy: ["6"]
    },
    {
      id: "gm10",
      roomId: "room-1",
      senderId: "8",
      senderName: "Samuel Abebe",
      content: "I can also prepare a brief overview of the deployment architecture if needed.",
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
      isRead: false,
      readBy: ["8"]
    }
  ],
  "room-2": [
    {
      id: "dm1",
      roomId: "room-2",
      senderId: "2",
      senderName: "Betelhem Tekle",
      content: "Hey team, let us discuss the code review process. I think we should implement stricter PR guidelines.",
      timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "3", "4", "8"]
    },
    {
      id: "dm2",
      roomId: "room-2",
      senderId: "3",
      senderName: "Dagim Chernet",
      content: "I agree. We should require at least two approvals before merging to main.",
      timestamp: new Date(Date.now() - 4.9 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "3", "4", "8"]
    },
    {
      id: "dm3",
      roomId: "room-2",
      senderId: "4",
      senderName: "Dagimawi Negusse",
      content: "That sounds good. Should we also add automated code quality checks?",
      timestamp: new Date(Date.now() - 4.8 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "3", "4", "8"]
    },
    {
      id: "dm4",
      roomId: "room-2",
      senderId: "8",
      senderName: "Samuel Abebe",
      content: "Already on it! I am setting up ESLint and Prettier checks in the CI pipeline.",
      timestamp: new Date(Date.now() - 4.7 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "3", "4", "8"]
    },
    {
      id: "dm5",
      roomId: "room-2",
      senderId: "2",
      senderName: "Betelhem Tekle",
      content: "Perfect! Let us also add test coverage requirements. Minimum 80% coverage for new code.",
      timestamp: new Date(Date.now() - 4.5 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "3", "4", "8"]
    }
  ],
  "room-3": [
    {
      id: "rm1",
      roomId: "room-3",
      senderId: "1",
      senderName: "Dr. Tsedniya Frezewed",
      content: "I have reviewed the latest research methodology proposal. We need to strengthen the literature review section.",
      timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
      isRead: true,
      readBy: ["1", "6", "7"]
    },
    {
      id: "rm2",
      roomId: "room-3",
      senderId: "6",
      senderName: "Dr. Yoseph Bizuneh",
      content: "I can help with that. I have access to several research databases that might be useful.",
      timestamp: new Date(Date.now() - 7.5 * 3600000).toISOString(),
      isRead: true,
      readBy: ["1", "6", "7"]
    },
    {
      id: "rm3",
      roomId: "room-3",
      senderId: "7",
      senderName: "Hanna Mekonnen",
      content: "I have completed the statistical analysis framework. Shall I share the preliminary results?",
      timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
      isRead: true,
      readBy: ["1", "6"]
    },
    {
      id: "rm4",
      roomId: "room-3",
      senderId: "1",
      senderName: "Dr. Tsedniya Frezewed",
      content: "Yes please, that would be very helpful. We can discuss it in our next meeting.",
      timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
      isRead: false,
      readBy: ["1"]
    }
  ]
}

// Direct Message Conversations (1-on-1)
export const directMessages: Record<string, GroupChatMessage[]> = {
  "dm-1-2": [
    {
      id: "dm12-1",
      roomId: "dm-1-2",
      senderId: "1",
      senderName: "Dr. Tsedniya Frezewed",
      content: "Hi Betelhem, do you have a moment to discuss the project timeline?",
      timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
      isRead: true,
      readBy: ["1", "2"]
    },
    {
      id: "dm12-2",
      roomId: "dm-1-2",
      senderId: "2",
      senderName: "Betelhem Tekle",
      content: "Of course, Dr. Tsedniya! What would you like to discuss?",
      timestamp: new Date(Date.now() - 2.9 * 3600000).toISOString(),
      isRead: true,
      readBy: ["1", "2"]
    },
    {
      id: "dm12-3",
      roomId: "dm-1-2",
      senderId: "1",
      senderName: "Dr. Tsedniya Frezewed",
      content: "I was thinking we might need to extend the deadline for the user authentication module. The requirements have grown more complex.",
      timestamp: new Date(Date.now() - 2.8 * 3600000).toISOString(),
      isRead: true,
      readBy: ["1", "2"]
    },
    {
      id: "dm12-4",
      roomId: "dm-1-2",
      senderId: "2",
      senderName: "Betelhem Tekle",
      content: "I understand. With the additional security requirements, I think an extra week would be reasonable.",
      timestamp: new Date(Date.now() - 2.7 * 3600000).toISOString(),
      isRead: true,
      readBy: ["1", "2"]
    },
    {
      id: "dm12-5",
      roomId: "dm-1-2",
      senderId: "1",
      senderName: "Dr. Tsedniya Frezewed",
      content: "That sounds fair. I will update the project plan and inform the stakeholders.",
      timestamp: new Date(Date.now() - 2.5 * 3600000).toISOString(),
      isRead: true,
      readBy: ["1", "2"]
    },
    {
      id: "dm12-6",
      roomId: "dm-1-2",
      senderId: "2",
      senderName: "Betelhem Tekle",
      content: "Thank you for understanding. I will make sure we deliver quality work.",
      timestamp: new Date(Date.now() - 2.4 * 3600000).toISOString(),
      isRead: true,
      readBy: ["1", "2"]
    },
    {
      id: "dm12-7",
      roomId: "dm-1-2",
      senderId: "1",
      senderName: "Dr. Tsedniya Frezewed",
      content: "Also, could you prepare a brief progress report for tomorrow's meeting?",
      timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
      isRead: false,
      readBy: ["1"]
    },
    {
      id: "dm12-8",
      roomId: "dm-1-2",
      senderId: "1",
      senderName: "Dr. Tsedniya Frezewed",
      content: "The university board will be attending, so we need to highlight our achievements.",
      timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
      isRead: false,
      readBy: ["1"]
    }
  ],
  "dm-2-3": [
    {
      id: "dm23-1",
      roomId: "dm-2-3",
      senderId: "3",
      senderName: "Dagim Chernet",
      content: "Hey Betelhem, I finished setting up the new API endpoints. Ready for you to integrate.",
      timestamp: new Date(Date.now() - 4 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "3"]
    },
    {
      id: "dm23-2",
      roomId: "dm-2-3",
      senderId: "2",
      senderName: "Betelhem Tekle",
      content: "Perfect timing! I just wrapped up the frontend components. What is the base URL?",
      timestamp: new Date(Date.now() - 3.9 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "3"]
    },
    {
      id: "dm23-3",
      roomId: "dm-2-3",
      senderId: "3",
      senderName: "Dagim Chernet",
      content: "It is /api/v1/ on the staging server. I have also added Swagger documentation at /api/docs",
      timestamp: new Date(Date.now() - 3.8 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "3"]
    },
    {
      id: "dm23-4",
      roomId: "dm-2-3",
      senderId: "2",
      senderName: "Betelhem Tekle",
      content: "Great! I will start integrating right away. Thanks for the docs, that will help a lot.",
      timestamp: new Date(Date.now() - 3.7 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "3"]
    },
    {
      id: "dm23-5",
      roomId: "dm-2-3",
      senderId: "3",
      senderName: "Dagim Chernet",
      content: "Let me know if you run into any issues. I will be online most of the day.",
      timestamp: new Date(Date.now() - 1 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "3"]
    }
  ],
  "dm-2-6": [
    {
      id: "dm26-1",
      roomId: "dm-2-6",
      senderId: "6",
      senderName: "Dr. Yoseph Bizuneh",
      content: "Betelhem, I have reviewed your documentation on the research module. Very thorough work!",
      timestamp: new Date(Date.now() - 6 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "6"]
    },
    {
      id: "dm26-2",
      roomId: "dm-2-6",
      senderId: "2",
      senderName: "Betelhem Tekle",
      content: "Thank you, Dr. Yoseph! I tried to cover all the use cases we discussed.",
      timestamp: new Date(Date.now() - 5.9 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "6"]
    },
    {
      id: "dm26-3",
      roomId: "dm-2-6",
      senderId: "6",
      senderName: "Dr. Yoseph Bizuneh",
      content: "I have just a few minor suggestions. Could we add support for DOI references?",
      timestamp: new Date(Date.now() - 5.8 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "6"]
    },
    {
      id: "dm26-4",
      roomId: "dm-2-6",
      senderId: "2",
      senderName: "Betelhem Tekle",
      content: "Absolutely! That is a great suggestion. I will add it to the next sprint.",
      timestamp: new Date(Date.now() - 5.7 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "6"]
    },
    {
      id: "dm26-5",
      roomId: "dm-2-6",
      senderId: "6",
      senderName: "Dr. Yoseph Bizuneh",
      content: "One more thing - can we meet tomorrow to discuss the citation formats in more detail?",
      timestamp: new Date(Date.now() - 3 * 3600000).toISOString(),
      isRead: false,
      readBy: ["6"]
    }
  ],
  "dm-2-8": [
    {
      id: "dm28-1",
      roomId: "dm-2-8",
      senderId: "8",
      senderName: "Samuel Abebe",
      content: "Hi Betelhem! The staging deployment is complete. You can test the new features now.",
      timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "8"]
    },
    {
      id: "dm28-2",
      roomId: "dm-2-8",
      senderId: "2",
      senderName: "Betelhem Tekle",
      content: "Awesome! What is the URL again?",
      timestamp: new Date(Date.now() - 1.9 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "8"]
    },
    {
      id: "dm28-3",
      roomId: "dm-2-8",
      senderId: "8",
      senderName: "Samuel Abebe",
      content: "staging.astu-research.edu.et - I have also set up SSL certificates.",
      timestamp: new Date(Date.now() - 1.8 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "8"]
    },
    {
      id: "dm28-4",
      roomId: "dm-2-8",
      senderId: "2",
      senderName: "Betelhem Tekle",
      content: "Perfect! I will run through the test cases this afternoon.",
      timestamp: new Date(Date.now() - 1.7 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "8"]
    },
    {
      id: "dm28-5",
      roomId: "dm-2-8",
      senderId: "8",
      senderName: "Samuel Abebe",
      content: "Let me know if you find any issues. I have enabled detailed logging for debugging.",
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      isRead: true,
      readBy: ["2", "8"]
    }
  ],
  "dm-2-4": [
    {
      id: "dm24-1",
      roomId: "dm-2-4",
      senderId: "4",
      senderName: "Dagimawi Negusse",
      content: "Hi Betelhem! I finished the new dashboard mockups. Want to take a look?",
      timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "4"]
    },
    {
      id: "dm24-2",
      roomId: "dm-2-4",
      senderId: "2",
      senderName: "Betelhem Tekle",
      content: "Yes please! Where can I find them?",
      timestamp: new Date(Date.now() - 7.9 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "4"]
    },
    {
      id: "dm24-3",
      roomId: "dm-2-4",
      senderId: "4",
      senderName: "Dagimawi Negusse",
      content: "I have uploaded them to the shared Figma workspace. Check the 'Dashboard V2' project.",
      timestamp: new Date(Date.now() - 7.8 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "4"]
    },
    {
      id: "dm24-4",
      roomId: "dm-2-4",
      senderId: "2",
      senderName: "Betelhem Tekle",
      content: "These look amazing! I especially like the new color scheme and the card layouts.",
      timestamp: new Date(Date.now() - 7.5 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "4"]
    },
    {
      id: "dm24-5",
      roomId: "dm-2-4",
      senderId: "4",
      senderName: "Dagimawi Negusse",
      content: "Thanks! I tried to make it more consistent with the university branding. Let me know if you have any feedback.",
      timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
      isRead: true,
      readBy: ["2", "4"]
    }
  ]
}

// Simulated auto-reply messages for real-time effect
export const autoReplyMessages = [
  "That is a great point! Let me think about it.",
  "I will look into this and get back to you.",
  "Thanks for sharing! This is very helpful.",
  "Agreed! We should move forward with this approach.",
  "Let me check the documentation and confirm.",
  "Good idea! I will implement this in the next sprint.",
  "Can we schedule a quick call to discuss this further?",
  "I have updated the task in our project board.",
  "The changes have been pushed to the repository.",
  "I will prepare a summary document for review."
]
