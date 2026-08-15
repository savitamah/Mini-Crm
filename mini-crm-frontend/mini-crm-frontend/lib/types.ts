// Types mirroring the Spring Boot DTOs exactly (field names/casing must match the backend JSON).

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "INTERESTED"
  | "PROPOSAL"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

export const LEAD_STATUSES: LeadStatus[] = [
  "NEW",
  "CONTACTED",
  "INTERESTED",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST",
];

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  INTERESTED: "Interested",
  PROPOSAL: "Proposal",
  NEGOTIATION: "Negotiation",
  WON: "Won",
  LOST: "Lost",
};

export type DealStage = "QUALIFICATION" | "PROPOSAL" | "NEGOTIATION" | "WON" | "LOST";

export type FollowUpActivityType = "CALL" | "EMAIL" | "MEETING" | "NOTE" | "TASK";

export type FollowUpStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "OVERDUE" | "CANCELLED";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export type ActivityType =
  | "CALL"
  | "EMAIL"
  | "MEETING"
  | "NOTE"
  | "TASK"
  | "LEAD_CREATED"
  | "STAGE_CHANGE"
  | "DEAL_CREATED"
  | "SYSTEM";

export type RoleType = "ADMIN" | "MANAGER" | "SALES_REP";
export type UserStatus = "ACTIVE" | "INACTIVE";

export interface User {
  id: number;
  name: string;
  email: string;
  role: RoleType;
  status?: UserStatus;
}

export interface AuthResponse {
  token: string;
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Contact {
  id: number;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  tags?: string;
  ownerId?: number;
  ownerName?: string;
  createdAt?: string;
}

export interface Lead {
  id: number;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  status: LeadStatus;
  estimatedValue?: number;
  score?: number;
  assignedToId?: number;
  assignedToName?: string;
  createdAt?: string;
}

export interface Deal {
  id: number;
  dealName: string;
  contactId?: number;
  contactName?: string;
  stage: DealStage;
  amount?: number;
  expectedCloseDate?: string;
  probability?: number;
  ownerId?: number;
  ownerName?: string;
}

export interface FollowUp {
  id: number;
  title: string;
  leadId?: number;
  leadName?: string;
  contactId?: number;
  contactName?: string;
  activityType: FollowUpActivityType;
  followUpDate?: string;
  followUpTime?: string;
  reminderOffset?: string;
  notes?: string;
  status: FollowUpStatus;
  assignedToId?: number;
}

export interface TaskItem {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedToId?: number;
  assignedToName?: string;
  relatedLeadId?: number;
  relatedContactId?: number;
}

export interface Activity {
  id: number;
  type: ActivityType;
  description?: string;
  leadId?: number;
  contactId?: number;
  performedByName?: string;
  createdAt?: string;
}

export interface DashboardStats {
  totalLeads: number;
  totalContacts: number;
  followUpsToday: number;
  tasksPending: number;
  overdueTasks: number;
  dealsWon: number;
  dealsLost: number;
  totalRevenue: number;
  leadsByStage: Record<string, number>;
  leadsBySource: Record<string, number>;
  leadsByStatus: Record<string, number>;
  upcomingFollowUps: Array<{
    id: number;
    title: string;
    date: string;
    time?: string;
    leadName?: string;
  }>;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // current page index
  size: number;
}
