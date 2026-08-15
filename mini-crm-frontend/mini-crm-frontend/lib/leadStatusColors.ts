import { LeadStatus, FollowUpStatus, TaskStatus, TaskPriority, DealStage } from "./types";

export const LEAD_STATUS_COLOR: Record<LeadStatus, "blue" | "indigo" | "purple" | "orange" | "pink" | "green" | "red"> = {
  NEW: "blue",
  CONTACTED: "indigo",
  INTERESTED: "purple",
  PROPOSAL: "orange",
  NEGOTIATION: "pink",
  WON: "green",
  LOST: "red",
};

export const LEAD_STATUS_BAR: Record<LeadStatus, string> = {
  NEW: "bg-blue-500",
  CONTACTED: "bg-indigo-500",
  INTERESTED: "bg-purple-500",
  PROPOSAL: "bg-orange-500",
  NEGOTIATION: "bg-pink-500",
  WON: "bg-emerald-500",
  LOST: "bg-red-400",
};

export const FOLLOWUP_STATUS_COLOR: Record<FollowUpStatus, "blue" | "green" | "orange" | "red" | "gray"> = {
  PENDING: "orange",
  CONFIRMED: "blue",
  COMPLETED: "green",
  OVERDUE: "red",
  CANCELLED: "gray",
};

export const TASK_STATUS_COLOR: Record<TaskStatus, "orange" | "blue" | "green"> = {
  PENDING: "orange",
  IN_PROGRESS: "blue",
  COMPLETED: "green",
};

export const TASK_PRIORITY_COLOR: Record<TaskPriority, "green" | "orange" | "red"> = {
  LOW: "green",
  MEDIUM: "orange",
  HIGH: "red",
};

export const DEAL_STAGE_COLOR: Record<DealStage, "blue" | "orange" | "pink" | "green" | "red"> = {
  QUALIFICATION: "blue",
  PROPOSAL: "orange",
  NEGOTIATION: "pink",
  WON: "green",
  LOST: "red",
};
