// ==============================================================================
// ELEVATE INTRANET B2B — TypeScript Types & Interfaces
// ==============================================================================

export type UserRole = 
  | 'super_admin' 
  | 'admin' 
  | 'hr_manager' 
  | 'manager' 
  | 'team_lead' 
  | 'employee';

export type TeamRole = 'lead' | 'member' | 'guest';

export type ReportType = 'bug' | 'improvement' | 'suggestion';
export type ReportStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type ChannelType = 'public' | 'private' | 'dm' | 'group_dm';
export type AnnouncementPriority = 'low' | 'normal' | 'high' | 'urgent';
export type AnnouncementCategory = 'general' | 'hr' | 'it' | 'management' | 'events';
export type NotificationType = 'mention' | 'chat' | 'request' | 'approval' | 'announcement' | 'system';

export interface Organization {
  id: string;
  name: string;
  logo_url: string | null;
  industry: string | null;
  max_users: number;
  is_active: boolean;
  settings_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Department {
  id: string;
  org_id: string;
  name: string;
  parent_department_id: string | null;
  head_user_id: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  head_profile?: Profile | null;
  children?: Department[];
  member_count?: number;
}

export interface Permission {
  id: string;
  resource: string;
  action: string;
  description: string | null;
  created_at?: string;
}

export interface Role {
  id: string;
  org_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  hierarchy_level: number; // 0: SuperAdmin, 1: Admin, 2: Manager, 3: User, >3: Custom
  is_system: boolean;
  created_at?: string;
  updated_at?: string;
  permissions?: Permission[];
}

export interface RolePermission {
  role_id: string;
  permission_id: string;
}

export interface Group {
  id: string;
  org_id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
  member_count?: number;
}

export interface UserGroup {
  user_id: string;
  group_id: string;
  assigned_at?: string;
}

export interface UserPermissionOverride {
  user_id: string;
  permission_id: string;
  is_granted: boolean;
  granted_by?: string | null;
  permission?: Permission;
  created_at?: string;
  updated_at?: string;
}

/**
 * Map of "resource:action" → boolean representing effective permissions.
 * true = allowed, false = explicitly denied.
 * Absence means denied (default deny).
 */
export type UserEffectivePermissions = Record<string, boolean>;

export type PermissionSource = 'super_admin_bypass' | 'user_override' | 'role_permission' | 'denied';

export interface Profile {
  id: string;
  org_id: string;
  username?: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  role_id?: string | null;
  role_details?: Role | null;
  must_change_password?: boolean;
  department_id: string | null;
  job_title: string | null;
  phone: string | null;
  hire_date: string;
  is_active: boolean;
  settings_json: {
    theme?: 'dark' | 'light';
    notifications_enabled?: boolean;
    language?: 'es' | 'en';
  };
  created_at: string;
  updated_at: string;
  department?: Department | null;
  effectivePermissions?: UserEffectivePermissions;
  permissionOverrides?: UserPermissionOverride[];
}

export interface Team {
  id: string;
  org_id: string;
  name: string;
  description: string | null;
  lead_user_id: string | null;
  created_at: string;
  updated_at: string;
  lead_profile?: Profile | null;
  members?: TeamMember[];
}

export interface TeamMember {
  id: string;
  team_id: string;
  profile_id: string;
  role_in_team: TeamRole;
  joined_at: string;
  profile?: Profile;
}

// Chat Types
export interface ChatChannel {
  id: string;
  org_id: string;
  name: string;
  description: string | null;
  type: ChannelType;
  created_by: string | null;
  avatar_url: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  unread_count?: number;
  members_count?: number;
  last_message?: ChatMessage | null;
}

export interface ChatChannelMember {
  id: string;
  channel_id: string;
  profile_id: string;
  role: 'owner' | 'admin' | 'member';
  last_read_at: string;
  is_muted: boolean;
  joined_at: string;
  profile?: Profile;
}

export interface ChatMessage {
  id: string;
  channel_id: string;
  sender_id: string;
  content: string;
  parent_message_id: string | null;
  is_edited: boolean;
  is_deleted: boolean;
  metadata_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  sender?: Profile;
  reactions?: ChatReaction[];
  attachments?: ChatAttachment[];
  thread_count?: number;
  status?: 'sending' | 'sent' | 'error';
}

export interface ChatReaction {
  id: string;
  message_id: string;
  profile_id: string;
  emoji: string;
  created_at: string;
  count?: number;
  user_reacted?: boolean;
}

export interface ChatAttachment {
  id: string;
  message_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

// Announcements & Notifications
export interface Announcement {
  id: string;
  org_id: string;
  author_id: string;
  title: string;
  content: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  is_pinned: boolean;
  target_departments: string[];
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  author?: Profile;
}

export interface Notification {
  id: string;
  org_id: string;
  profile_id: string;
  type: NotificationType;
  title: string;
  body: string;
  is_read: boolean;
  action_url: string | null;
  metadata_json: Record<string, unknown>;
  created_at: string;
}

export interface BugReport {
  id: string;
  org_id?: string | null;
  reporter_id?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  type: ReportType;
  description: string;
  attachment_urls: string[];
  status: ReportStatus;
  created_at: string;
  updated_at: string;
}

export interface NavItem {
  id: string;
  title: string;
  href: string;
  icon: string;
  badge?: string | number;
  requiredRole?: UserRole[];
  isSeparator?: boolean;
  isAction?: boolean;
}

export interface DashboardMetric {
  id: string;
  title: string;
  value: string | number;
  subtitle?: string;
  icon: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export interface ActivityItem {
  id: string;
  user_name: string;
  user_avatar?: string | null;
  action: string;
  target: string;
  timestamp: string;
  type: 'request' | 'announcement' | 'file' | 'attendance' | 'system';
}

export interface KnowledgeArticle {
  id: string;
  org_id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string | null;
  category: 'sop' | 'compliance' | 'hr_policy' | 'technical' | 'guide';
  department_id?: string | null;
  owner_id: string;
  version: string;
  status: 'active' | 'stale' | 'archived' | 'draft';
  tags: string[];
  last_reviewed_at: string;
  next_review_due: string;
  created_at: string;
  updated_at: string;
  owner?: Profile | null;
  department?: Department | null;
}

export interface AnnouncementReadReceipt {
  id: string;
  org_id: string;
  announcement_id: string;
  profile_id: string;
  confirmed_at: string;
  profile?: Profile | null;
}

export interface PeerKudos {
  id: string;
  org_id: string;
  sender_id: string;
  recipient_id: string;
  core_value: 'Innovación' | 'Colaboración' | 'Excelencia' | 'Compromiso' | 'Liderazgo' | 'Integridad';
  message: string;
  reactions_json?: Record<string, number>;
  created_at: string;
  sender?: Profile | null;
  recipient?: Profile | null;
}

export interface OnboardingJourney {
  id: string;
  org_id: string;
  profile_id: string;
  mentor_id?: string | null;
  day1_completed: boolean;
  day7_completed: boolean;
  day30_completed: boolean;
  checklist_json: Array<{ id: string; title: string; done: boolean; category: string }>;
  started_at: string;
  completed_at?: string | null;
  profile?: Profile | null;
  mentor?: Profile | null;
}

export interface ProjectHub {
  id: string;
  org_id: string;
  title: string;
  description?: string | null;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  lead_id?: string | null;
  target_departments: string[];
  roadmap_json: Array<{ id: string; milestone: string; dueDate: string; completed: boolean }>;
  agreements_json: Array<{ id: string; title: string; assignedTo: string; date: string }>;
  created_at: string;
  updated_at: string;
  lead?: Profile | null;
}

