"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertCircle,
  Bell,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronRight,
  Coins,
  FileCheck2,
  FileSearch,
  FileText,
  Files,
  LayoutDashboard,
  Search,
  ShieldAlert,
  UserCog,
  UserPlus,
  Users,
  X,
  Clock,
  Gift,
  TrendingUp,
  Calendar,
  MessageSquare,
  Trash2,
  Settings,
  Eye,
  Send,
  Archive,
  Star,
  Flag,
  DollarSign,
  UserCheck,
  Award,
  AlertTriangle,
} from "lucide-react";

// Mock User Context (for Role-Based UI demo)
const currentUser = {
  name: "Dr. Admin",
  role: "Finance",
  email: "admin@research.edu",
  avatar: "AD",
};

// Notification Types
type NotificationType = 
  | "approval" 
  | "budget" 
  | "deadline" 
  | "system" 
  | "reminder" 
  | "achievement"
  | "alert"
  | "info"
  | "success"
  | "warning";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  read: boolean;
  priority: "high" | "medium" | "low";
  actionLink?: string;
  actionLabel?: string;
  metadata?: {
    projectId?: string;
    userId?: string;
    amount?: number;
    dueDate?: string;
  };
}

// Notification Service
const notificationService = {
  getNotifications: (): Notification[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("dashboard_notifications");
    if (stored) {
      return JSON.parse(stored, (key, value) => {
        if (key === "timestamp") return new Date(value);
        return value;
      });
    }
    return [];
  },
  
  saveNotifications: (notifications: Notification[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("dashboard_notifications", JSON.stringify(notifications));
  },
  
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const notifications = notificationService.getNotifications();
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };
    notifications.unshift(newNotification);
    notificationService.saveNotifications(notifications);
    return newNotification;
  },
  
  markAsRead: (id: string) => {
    const notifications = notificationService.getNotifications();
    const updated = notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    );
    notificationService.saveNotifications(updated);
  },
  
  markAllAsRead: () => {
    const notifications = notificationService.getNotifications();
    const updated = notifications.map(notif => ({ ...notif, read: true }));
    notificationService.saveNotifications(updated);
  },
  
  deleteNotification: (id: string) => {
    const notifications = notificationService.getNotifications();
    const filtered = notifications.filter(notif => notif.id !== id);
    notificationService.saveNotifications(filtered);
  },
  
  deleteAll: () => {
    notificationService.saveNotifications([]);
  },
  
  getUnreadCount: () => {
    const notifications = notificationService.getNotifications();
    return notifications.filter(n => !n.read).length;
  },
  
  getByType: (type: NotificationType) => {
    const notifications = notificationService.getNotifications();
    return notifications.filter(n => n.type === type);
  },
  
  getHighPriority: () => {
    const notifications = notificationService.getNotifications();
    return notifications.filter(n => n.priority === "high" && !n.read);
  },
};

// Notification Icon Component
const NotificationIcon = ({ type }: { type: NotificationType }) => {
  const icons = {
    approval: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    budget: <DollarSign className="h-4 w-4 text-indigo-500" />,
    deadline: <Clock className="h-4 w-4 text-red-500" />,
    system: <Settings className="h-4 w-4 text-slate-500" />,
    reminder: <Bell className="h-4 w-4 text-amber-500" />,
    achievement: <Award className="h-4 w-4 text-purple-500" />,
    alert: <AlertTriangle className="h-4 w-4 text-red-500" />,
    info: <MessageSquare className="h-4 w-4 text-blue-500" />,
    success: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    warning: <AlertCircle className="h-4 w-4 text-amber-500" />,
  };
  return icons[type] || icons.info;
};

// Notification Item Component
const NotificationItem = ({ 
  notification, 
  onMarkAsRead, 
  onDelete,
  onMarkUnread,
}: { 
  notification: Notification; 
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkUnread?: (id: string) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    const intervals: { [key: string]: number } = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? "" : "s"} ago`;
      }
    }
    return "Just now";
  };
  
  const priorityColors = {
    high: "border-l-4 border-l-red-500 bg-gradient-to-r from-red-50/50 to-transparent dark:from-red-950/20",
    medium: "border-l-4 border-l-amber-500",
    low: "border-l-4 border-l-blue-500",
  };
  
  const getPriorityBadge = () => {
    if (notification.priority === "high") {
      return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[9px] px-1.5 py-0">High</Badge>;
    }
    if (notification.priority === "medium") {
      return <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[9px] px-1.5 py-0">Medium</Badge>;
    }
    return null;
  };
  
  return (
    <div 
      className={`relative p-4 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
        !notification.read ? "bg-blue-50/30 dark:bg-blue-900/10" : ""
      } ${priorityColors[notification.priority]}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <NotificationIcon type={notification.type} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className={`text-sm font-semibold ${!notification.read ? "text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400"}`}>
                  {notification.title}
                </p>
                {getPriorityBadge()}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 leading-relaxed">
                {notification.message}
              </p>
              {notification.metadata?.amount && (
                <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 dark:bg-emerald-900/20">
                  <DollarSign className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    ${notification.metadata.amount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] font-medium text-slate-400">
                  {getTimeAgo(notification.timestamp)}
                </span>
                {!notification.read && (
                  <button
                    onClick={() => onMarkAsRead(notification.id)}
                    className="text-[10px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 transition-colors"
                  >
                    Mark as read
                  </button>
                )}
                {notification.actionLink && (
                  <button className="text-[10px] font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors">
                    {notification.actionLabel || "View details"} →
                  </button>
                )}
              </div>
            </div>
            {isHovered && (
              <div className="flex gap-1 flex-shrink-0">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onMarkAsRead(notification.id)}
                        className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Eye className="h-3 w-3 text-slate-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Mark as read</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onDelete(notification.id)}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="h-3 w-3 text-slate-400 hover:text-red-600" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>Delete</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Notification Panel Component
const NotificationPanel = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "high">("all");
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    const loadNotifications = () => {
      const notifs = notificationService.getNotifications();
      setNotifications(notifs);
    };
    
    loadNotifications();
    
    // Listen for storage events to sync across tabs
    const handleStorageChange = () => {
      loadNotifications();
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  
  const handleMarkAsRead = (id: string) => {
    notificationService.markAsRead(id);
    setNotifications(notificationService.getNotifications());
  };
  
  const handleDelete = (id: string) => {
    notificationService.deleteNotification(id);
    setNotifications(notificationService.getNotifications());
  };
  
  const handleMarkAllRead = () => {
    notificationService.markAllAsRead();
    setNotifications(notificationService.getNotifications());
  };
  
  const handleDeleteAll = () => {
    if (window.confirm("Are you sure you want to delete all notifications?")) {
      notificationService.deleteAll();
      setNotifications([]);
    }
  };
  
  const getFilteredNotifications = () => {
    if (activeTab === "all") return notifications;
    if (activeTab === "unread") return notifications.filter(n => !n.read);
    if (activeTab === "high") return notifications.filter(n => n.priority === "high");
    return notifications;
  };
  
  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === "high" && !n.read).length;
  const filteredNotifications = getFilteredNotifications();
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative h-10 w-10 shrink-0 rounded-full border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 px-1">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
          {highPriorityCount > 0 && unreadCount === 0 && (
            <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[400px] p-0 overflow-hidden rounded-xl border-slate-200 shadow-xl dark:border-slate-800" 
        align="end"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800 bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Bell className="h-4 w-4 text-blue-600" />
              Notifications
            </h3>
            <p className="text-xs text-slate-500">Stay updated with your research activities</p>
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={handleMarkAllRead}
                    disabled={unreadCount === 0}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Mark all as read</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={handleDeleteAll}
                    disabled={notifications.length === 0}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete all</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={(v) => setActiveTab(v as any)}>
          <div className="border-b border-slate-200 px-4 dark:border-slate-800">
            <TabsList className="h-10 w-full gap-4 bg-transparent p-0">
              <TabsTrigger 
                value="all" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 pb-2 text-sm"
              >
                All
                <Badge variant="secondary" className="ml-2 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {notifications.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="unread" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 pb-2 text-sm"
              >
                Unread
                {unreadCount > 0 && (
                  <Badge className="ml-2 bg-blue-500 text-white border-0">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="high" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-transparent data-[state=active]:shadow-none rounded-none px-0 pb-2 text-sm"
              >
                High Priority
                {highPriorityCount > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white border-0">
                    {highPriorityCount}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <ScrollArea className="h-[500px]">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <Bell className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No notifications</p>
                  <p className="text-xs text-slate-400 mt-1">You're all caught up!</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="unread" className="mt-0">
            <ScrollArea className="h-[500px]">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <CheckCircle2 className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No unread notifications</p>
                  <p className="text-xs text-slate-400 mt-1">Great job staying on top of things!</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="high" className="mt-0">
            <ScrollArea className="h-[500px]">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <CheckCircle2 className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No high priority notifications</p>
                  <p className="text-xs text-slate-400 mt-1">Everything looks good!</p>
                </div>
              ) : (
                filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <div className="border-t border-slate-200 p-2 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="flex items-center justify-between px-2">
            <Button variant="ghost" size="sm" className="text-xs font-medium text-slate-600 dark:text-slate-400">
              <Settings className="h-3 w-3 mr-2" />
              Notification Settings
            </Button>
            <Button variant="ghost" size="sm" className="text-xs font-medium text-blue-600 dark:text-blue-400">
              <Archive className="h-3 w-3 mr-2" />
              View Archive
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

// Initialize sample notifications
const initializeSampleNotifications = () => {
  if (typeof window === "undefined") return;
  
  const existing = notificationService.getNotifications();
  if (existing.length === 0) {
    const sampleNotifications = [
      {
        title: "Proposal Approved for Funding",
        message: "Your research proposal 'Advanced AI in Medical Diagnostics' has been approved for Phase 1 funding.",
        type: "approval" as NotificationType,
        priority: "high" as const,
        metadata: { amount: 250000, projectId: "PRJ-2024-001" }
      },
      {
        title: "Budget Release Confirmed",
        message: "Phase 2 budget of $150,000 has been released for project PRJ-2024-002.",
        type: "budget" as NotificationType,
        priority: "high" as const,
        metadata: { amount: 150000 }
      },
      {
        title: "Upcoming Deadline",
        message: "Progress report for project PRJ-2024-003 is due in 3 days.",
        type: "deadline" as NotificationType,
        priority: "high" as const,
        metadata: { dueDate: "2024-01-15" }
      },
      {
        title: "Reviewer Assigned",
        message: "Dr. Sarah Johnson has been assigned as the primary reviewer for your submission.",
        type: "system" as NotificationType,
        priority: "medium" as const,
      },
      {
        title: "System Maintenance",
        message: "The research portal will be down for scheduled maintenance on Sunday, 2 AM - 4 AM EST.",
        type: "system" as NotificationType,
        priority: "low" as const,
      },
      {
        title: "Achievement Unlocked: Research Excellence",
        message: "Congratulations! You've successfully completed 10 research projects this year.",
        type: "achievement" as NotificationType,
        priority: "medium" as const,
      },
      {
        title: "Extension Request Pending",
        message: "Dr. Michael Chen has requested a 2-month extension for project PRJ-2024-008. Your approval is required.",
        type: "alert" as NotificationType,
        priority: "high" as const,
      },
      {
        title: "New Message from Ethics Committee",
        message: "You have a new message regarding your proposal's ethical compliance review.",
        type: "info" as NotificationType,
        priority: "medium" as const,
      },
      {
        title: "Team Member Added",
        message: "Dr. Lisa Anderson has been added as a Co-Investigator to your project.",
        type: "success" as NotificationType,
        priority: "low" as const,
      },
      {
        title: "Budget Warning",
        message: "Project PRJ-2024-005 is exceeding its allocated budget by 15%.",
        type: "warning" as NotificationType,
        priority: "high" as const,
        metadata: { amount: 45000 }
      },
    ];
    
    sampleNotifications.forEach(notif => {
      notificationService.addNotification(notif);
    });
  }
};

// Call initialization
if (typeof window !== "undefined") {
  initializeSampleNotifications();
}

export default function AdminDashboardPage() {
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    const updateCount = () => {
      setUnreadCount(notificationService.getUnreadCount());
    };
    
    updateCount();
    const interval = setInterval(updateCount, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <TooltipProvider>
      <div className="z-0 flex min-h-screen w-full flex-1 flex-col bg-slate-50/50 p-4 md:p-6 lg:p-8 xl:p-10 dark:bg-slate-950/20">

        {/* ----------------- TOP HEADER ----------------- */}
        <header className="mb-8 flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex flex-col gap-1">
            <h1 className="flex items-center gap-3 font-extrabold text-3xl text-slate-900 tracking-tight dark:text-slate-100">
              <LayoutDashboard className="h-8 w-8 text-blue-600 dark:text-blue-500" />
              Research Control Center
            </h1>
            <p className="font-medium text-[15px] text-slate-500 dark:text-slate-400">
              Welcome back, {currentUser.name}. Here's an overview of the university research ecosystem today.
            </p>
          </div>

          <div className="relative flex w-full items-center gap-4 md:w-auto">
            <div className="relative w-full md:w-[280px]">
              <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search projects, researchers..."
                className="h-10 rounded-full border-slate-200 bg-white pl-9 shadow-sm dark:border-slate-800 dark:bg-slate-900"
              />
            </div>

            {/* Enhanced Notification System */}
            <NotificationPanel />

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Avatar className="h-10 w-10 shrink-0 border-2 border-white shadow-sm cursor-pointer dark:border-slate-800">
                    <AvatarFallback className="bg-blue-600 font-bold text-sm text-white">AD</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Account Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </header>

        {/* ----------------- STAT SUMMARY CARDS ----------------- */}
        <div className="mb-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
          {/* Total Projects */}
          <Card className="border-slate-200/60 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800/60 dark:bg-slate-950">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  <Briefcase className="h-6 w-6" />
                </div>
                <Badge className="pointer-events-none border-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">+12% from last month</Badge>
              </div>
              <p className="mb-1 font-semibold text-slate-500 text-sm uppercase tracking-wider">Total Active Projects</p>
              <h2 className="font-extrabold text-4xl text-slate-900 tracking-tight dark:text-slate-100">142</h2>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card className="border-slate-200/60 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800/60 dark:bg-slate-950">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">
                  <FileCheck2 className="h-6 w-6" />
                </div>
                <Badge className="pointer-events-none border-0 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">Requires Attention</Badge>
              </div>
              <p className="mb-1 font-semibold text-slate-500 text-sm uppercase tracking-wider">Pending Approvals</p>
              <h2 className="font-extrabold text-4xl text-slate-900 tracking-tight dark:text-slate-100">28</h2>
            </CardContent>
          </Card>

          {/* Budget Requests */}
          <Card className="relative overflow-hidden border-slate-200/60 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800/60 dark:bg-slate-950">
            <div className="pointer-events-none absolute top-0 right-0 h-full w-full bg-gradient-to-bl from-blue-500 to-transparent p-4 opacity-5" />
            <CardContent className="relative z-10 p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                  <Coins className="h-6 w-6" />
                </div>
                <Badge className="pointer-events-none border-0 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">6 Awaiting Release</Badge>
              </div>
              <p className="mb-1 font-semibold text-slate-500 text-sm uppercase tracking-wider">Budget Processing</p>
              <h2 className="font-extrabold text-4xl text-slate-900 tracking-tight dark:text-slate-100">
                <span className="mr-1 font-semibold text-2xl text-slate-400">$</span>2.4M
              </h2>
            </CardContent>
          </Card>

          {/* Completed Projects */}
          <Card className="border-slate-200/60 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-800/60 dark:bg-slate-950">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
              <p className="mb-1 font-semibold text-slate-500 text-sm uppercase tracking-wider">Completed (YTD)</p>
              <h2 className="font-extrabold text-4xl text-slate-900 tracking-tight dark:text-slate-100">56</h2>
            </CardContent>
          </Card>
        </div>

        {/* ----------------- TWO-COLUMN MAIN LAYOUT ----------------- */}
        <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">

          {/* ========== LEFT AREA (Larger) ========== */}
          <div className="flex flex-col gap-6 xl:col-span-2 xl:gap-8">

            {/* Charts Row (Mock CSS Bars) */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="border-slate-200/60 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-950">
                <CardHeader className="pb-2">
                  <CardTitle className="font-bold text-lg text-slate-800 dark:text-slate-100">Project Status Distribution</CardTitle>
                  <CardDescription className="font-semibold text-slate-400 text-xs uppercase tracking-wider">Current Lifecycle Stages</CardDescription>
                </CardHeader>
                <CardContent className="mt-2 mb-2 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between font-medium text-sm"><span className="text-slate-600 dark:text-slate-400">Review & Evaluation</span><span className="font-bold">45</span></div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full w-[45%] rounded-full bg-sky-500" /></div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between font-medium text-sm"><span className="text-slate-600 dark:text-slate-400">Active Execution</span><span className="font-bold">78</span></div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full w-[78%] rounded-full bg-blue-600" /></div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between font-medium text-sm"><span className="text-slate-600 dark:text-slate-400">Completed & Closed</span><span className="font-bold">19</span></div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><div className="h-full w-[19%] rounded-full bg-emerald-500" /></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200/60 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-950">
                <CardHeader className="pb-2">
                  <CardTitle className="font-bold text-lg text-slate-800 dark:text-slate-100">Budget Trend Overview</CardTitle>
                  <CardDescription className="font-semibold text-slate-400 text-xs uppercase tracking-wider">Funding Requested vs Approved</CardDescription>
                </CardHeader>
                <CardContent className="mt-4 flex h-[120px] items-end gap-2 pl-4">
                  {[40, 60, 45, 80, 50, 95].map((val, i) => (
                    <div key={val} className="group flex h-full flex-1 flex-col items-center justify-end">
                      <div className="mx-1 w-full rounded-t-md bg-gradient-to-t from-indigo-500 to-blue-400 opacity-80 transition-opacity group-hover:opacity-100" style={{ height: `${val}%` }} />
                      <span className="mt-2 font-bold text-[10px] text-slate-400 uppercase">M{i + 1}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Core Admin Actions Panel */}
            <Card className="border-slate-200/60 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-950">
              <CardHeader className="border-slate-100 border-b pb-4 dark:border-slate-800">
                <CardTitle className="font-bold text-lg text-slate-800 dark:text-slate-100">Administrative Action Hub</CardTitle>
                <CardDescription className="font-medium text-slate-500 text-xs">Fast access to operational workflows based on your clearance.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 divide-y divide-slate-100 p-0 md:grid-cols-4 md:divide-x md:divide-y-0 dark:divide-slate-800">
                <div className="group flex cursor-pointer flex-col items-center p-6 text-center transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
                  <div className="mb-3 rounded-2xl bg-blue-50 p-3 text-blue-600 transition-transform group-hover:scale-110 dark:bg-blue-900/20 dark:text-blue-400">
                    <FileSearch className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm dark:text-slate-100">Evaluations</h4>
                  <p className="mt-1 font-medium text-[11px] text-slate-500">Assign Reviewers</p>
                </div>
                <div className="group flex cursor-pointer flex-col items-center p-6 text-center transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
                  <div className="mb-3 rounded-2xl bg-emerald-50 p-3 text-emerald-600 transition-transform group-hover:scale-110 dark:bg-emerald-900/20 dark:text-emerald-400">
                    <Coins className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm dark:text-slate-100">Budget Release</h4>
                  <p className="mt-1 font-medium text-[11px] text-slate-500">Approve Tranches</p>
                </div>
                <div className="group relative flex cursor-pointer flex-col items-center p-6 text-center transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
                  <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                  <div className="mb-3 rounded-2xl bg-amber-50 p-3 text-amber-600 transition-transform group-hover:scale-110 dark:bg-amber-900/20 dark:text-amber-400">
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm dark:text-slate-100">Terminations</h4>
                  <p className="mt-1 font-medium text-[11px] text-slate-500">Handle Extensions</p>
                </div>
                <div className="group flex cursor-pointer flex-col items-center p-6 text-center transition-colors hover:bg-slate-50 dark:hover:bg-slate-900">
                  <div className="mb-3 rounded-2xl bg-indigo-50 p-3 text-indigo-600 transition-transform group-hover:scale-110 dark:bg-indigo-900/20 dark:text-indigo-400">
                    <UserCog className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm dark:text-slate-100">User Roles</h4>
                  <p className="mt-1 font-medium text-[11px] text-slate-500">Manage Personnel</p>
                </div>
              </CardContent>
            </Card>

            {/* Pending Reviews Table */}
            <Card className="overflow-hidden border-slate-200/60 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-950">
              <CardHeader className="flex flex-row items-center justify-between border-slate-100 border-b pb-4 dark:border-slate-800">
                <div>
                  <CardTitle className="font-bold text-lg text-slate-800 dark:text-slate-100">Recent Proposal Submissions</CardTitle>
                  <CardDescription className="mt-1 font-medium text-slate-500 text-xs">Ready for high-level administrative review.</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="h-8 font-semibold text-blue-600 dark:text-blue-400">View All Register <ChevronRight className="ml-1 h-4 w-4" /></Button>
              </CardHeader>
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-900/30">
                  <TableRow className="border-slate-100 dark:border-slate-800">
                    <TableHead className="h-10 w-[45%] font-semibold text-slate-600 text-xs dark:text-slate-400">Project Title</TableHead>
                    <TableHead className="h-10 font-semibold text-slate-600 text-xs dark:text-slate-400">Lead PI</TableHead>
                    <TableHead className="h-10 w-[120px] font-semibold text-slate-600 text-xs dark:text-slate-400">Status</TableHead>
                    <TableHead className="h-10 text-right font-semibold text-slate-600 text-xs dark:text-slate-400">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { title: "Advanced Deep Learning For Medical Imagery", pi: "Dr. L. Vance", status: "Under Review", badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
                    { title: "Sustainable Renewable Energy Systems", pi: "Prof. E. Stark", status: "Pending Release", badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
                    { title: "Quantum Computing Algorithms", pi: "Dr. A. Turing", status: "Completed", badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
                  ].map((row) => (
                    <TableRow key={row.title} className="group border-slate-100 hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-900/30">
                      <TableCell className="max-w-0 truncate font-semibold text-[13px] text-slate-900 dark:text-slate-100">{row.title}</TableCell>
                      <TableCell className="max-w-[100px] truncate font-medium text-[12px] text-slate-500">{row.pi}</TableCell>
                      <TableCell>
                        <Badge className={`${row.badge} pointer-events-none border-0 px-2 py-0.5 font-bold text-[10px] uppercase shadow-none`}>{row.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" className="h-7 rounded font-semibold text-xs transition-colors group-hover:border-blue-200 group-hover:bg-blue-50 group-hover:text-blue-600 dark:group-hover:border-blue-800 dark:group-hover:bg-blue-900/20 dark:group-hover:text-blue-400">Inspect</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

          </div>

          {/* ========== RIGHT AREA (Smaller) ========== */}
          <div className="flex flex-col gap-6 xl:gap-8">

            {/* Urgent Priority Tasks */}
            <Card className="border-red-200/50 bg-gradient-to-b from-white to-red-50/30 shadow-sm dark:border-red-900/30 dark:from-slate-950 dark:to-red-950/10">
              <CardHeader className="border-red-100 border-b pb-3 dark:border-red-900/20">
                <CardTitle className="flex items-center gap-2 font-bold text-md text-slate-900 dark:text-slate-100">
                  <AlertCircle className="h-5 w-5 text-red-500" /> Action Required
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 p-4">
                <div className="flex cursor-pointer items-start gap-3 rounded-lg border border-red-100 bg-white p-3 shadow-sm transition-colors hover:border-red-300 dark:border-red-900/30 dark:bg-slate-900 dark:hover:border-red-800">
                  <div className="shrink-0 rounded-md bg-red-100 p-2 text-red-600 dark:bg-red-900/40 dark:text-red-400">
                    <Files className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[13px] text-slate-900 dark:text-slate-200">Extension Request: PRJ-901</h4>
                    <p className="mt-0.5 font-medium text-[11px] text-slate-500 leading-tight">Dr. Carter requested a 3-month timeline extension. Review needed.</p>
                  </div>
                </div>
                <div className="flex cursor-pointer items-start gap-3 rounded-lg border border-amber-100 bg-white p-3 shadow-sm transition-colors hover:border-amber-300 dark:border-amber-900/30 dark:bg-slate-900 dark:hover:border-amber-800">
                  <div className="shrink-0 rounded-md bg-amber-100 p-2 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[13px] text-slate-900 dark:text-slate-200">Team Replacement Conflict</h4>
                    <p className="mt-0.5 font-medium text-[11px] text-slate-500 leading-tight">Pending approval to replace Co-PI in Active Project P-204.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Timeline / Activity */}
            <Card className="h-full min-h-[#300px] flex-1 flex-col border-slate-200/60 bg-white shadow-sm dark:border-slate-800/60 dark:bg-slate-950">
              <CardHeader className="border-slate-100 border-b pb-4 dark:border-slate-800">
                <CardTitle className="font-bold text-md text-slate-800 dark:text-slate-100">Live System Activity</CardTitle>
              </CardHeader>
              <CardContent className="relative ml-6 flex flex-1 flex-col gap-8 border-slate-100 border-l-2 pt-6 pr-2 pb-6 pl-6 dark:border-slate-800">
                <div className="relative">
                  <span className="-left-[35px] absolute top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-100 text-emerald-600 shadow-sm dark:border-slate-950 dark:bg-emerald-900/40 dark:text-emerald-400">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <p className="mb-1 font-bold text-[10px] text-slate-400 uppercase tracking-wider">10 mins ago</p>
                  <p className="mb-0.5 font-semibold text-[13px] text-slate-800 leading-tight dark:text-slate-200">Project P-908 Budget Finalized</p>
                  <p className="font-medium text-slate-500 text-xs">Finance Dept released Phase II funding.</p>
                </div>
                <div className="relative">
                  <span className="-left-[35px] absolute top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-blue-600 shadow-sm dark:border-slate-950 dark:bg-blue-900/40 dark:text-blue-400">
                    <FileText className="h-3.5 w-3.5" />
                  </span>
                  <p className="mb-1 font-bold text-[10px] text-slate-400 uppercase tracking-wider">1 hr ago</p>
                  <p className="mb-0.5 font-semibold text-[13px] text-slate-800 leading-tight dark:text-slate-200">New Proposal Uploaded</p>
                  <p className="font-medium text-slate-500 text-xs">Submitted by Dr. Emily Wong (Chemistry).</p>
                </div>
                <div className="relative">
                  <span className="-left-[35px] absolute top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-slate-600 shadow-sm dark:border-slate-950 dark:bg-slate-800 dark:text-slate-400">
                    <UserPlus className="h-3.5 w-3.5" />
                  </span>
                  <p className="mb-1 font-bold text-[10px] text-slate-400 uppercase tracking-wider">Yesterday</p>
                  <p className="mb-0.5 font-semibold text-[13px] text-slate-800 leading-tight dark:text-slate-200">Reviewer Access Granted</p>
                  <p className="font-medium text-slate-500 text-xs">Assigned Prof X to Evaluate Sub-023.</p>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}