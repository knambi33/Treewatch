import {
  Organisation,
  Project,
  Tree,
  User,
  Verification,
  TimelineEvent,
  TreePhoto,
  ReviewQueueItem,
  NotificationItem,
  SurvivalMetrics,
} from './types';

const rawApiUrl = (import.meta.env.VITE_API_URL as string || '').trim().replace(/\/$/, '');
const normalizedApiUrl = rawApiUrl ? (rawApiUrl.startsWith('http://') || rawApiUrl.startsWith('https://') ? rawApiUrl : `https://${rawApiUrl}`) : '';
export const API_BASE = (normalizedApiUrl ? normalizedApiUrl : '') + '/api';

export async function fetchUsers(): Promise<User[]> {
  const res = await fetch(`${API_BASE}/auth/users`);
  const data = await res.json();
  return data.users || [];
}

export async function loginUser(userId: string): Promise<User> {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  });
  const data = await res.json();
  return data.user;
}

export async function registerUser(payload: {
  name: string;
  mobile: string;
  email?: string;
  role?: string;
  roleTitle?: string;
  organisationId?: string;
  studentClass?: string;
}): Promise<{ success: boolean; user: User; message: string }> {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function registerOrganisation(payload: {
  name: string;
  type: 'NGO' | 'CSR' | 'School' | 'Community' | 'Municipality';
  description?: string;
  contactEmail?: string;
  contactPhone?: string;
  location?: string;
}): Promise<{ success: boolean; organisation: Organisation; message: string }> {
  const res = await fetch(`${API_BASE}/organisations/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function fetchOrganisations(): Promise<Organisation[]> {
  const res = await fetch(`${API_BASE}/organisations`);
  const data = await res.json();
  return data.organisations || [];
}

export async function fetchOrganisation(id: string): Promise<{ organisation: Organisation }> {
  const res = await fetch(`${API_BASE}/organisations/${id}`);
  return res.json();
}

export async function fetchProjects(orgId?: string): Promise<Project[]> {
  const url = orgId ? `${API_BASE}/projects?organisationId=${orgId}` : `${API_BASE}/projects`;
  const res = await fetch(url);
  const data = await res.json();
  return data.projects || [];
}

export async function fetchProjectDetails(id: string): Promise<{ project: Project; monthlyTrends: any[]; recentTrees: Tree[] }> {
  const res = await fetch(`${API_BASE}/projects/${id}`);
  const data = await res.json();
  return data;
}

export async function bulkUploadTrees(projectId: string, rows: any[], planterName: string) {
  const res = await fetch(`${API_BASE}/projects/${projectId}/bulk-upload`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rows, planterName }),
  });
  return res.json();
}

export async function fetchTrees(filters?: {
  projectId?: string;
  organisationId?: string;
  species?: string;
  status?: string;
  health?: string;
  caretakerId?: string;
  search?: string;
  limit?: number;
}): Promise<{ total: number; trees: Tree[] }> {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== '') params.append(k, String(v));
    });
  }
  const res = await fetch(`${API_BASE}/trees?${params.toString()}`);
  return res.json();
}

export async function fetchTreeDetails(id: string): Promise<{
  tree: Tree;
  timeline: TimelineEvent[];
  verifications: Verification[];
  photos: TreePhoto[];
}> {
  const res = await fetch(`${API_BASE}/trees/${id}`);
  return res.json();
}

export async function registerTree(data: Partial<Tree>): Promise<{ success: boolean; tree: Tree; message?: string }> {
  const res = await fetch(`${API_BASE}/trees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function submitVerification(payload: {
  treeId: string;
  photoUrl: string;
  currentLat: number;
  currentLng: number;
  gpsAccuracyMeters?: number;
  captureMethod?: 'In-App Camera' | 'Gallery Upload';
  userId?: string;
  userName?: string;
  overrideHealth?: string;
  overrideReason?: string;
  simulatedCondition?: string;
  simulatedSameTreeConfidence?: number;
}) {
  const res = await fetch(`${API_BASE}/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function fetchReviewQueue(status?: string): Promise<ReviewQueueItem[]> {
  const url = status ? `${API_BASE}/reviews?status=${status}` : `${API_BASE}/reviews`;
  const res = await fetch(url);
  const data = await res.json();
  return data.reviewQueue || [];
}

export async function actionReviewQueueItem(
  id: string,
  payload: {
    action: 'Approved' | 'Rejected' | 'Photo-Requested';
    correctedStatus?: string;
    correctedHealth?: string;
    correctedSpecies?: string;
    reviewerRemarks: string;
    reviewerId?: string;
    reviewerName?: string;
  }
) {
  const res = await fetch(`${API_BASE}/reviews/${id}/action`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function fetchAnalyticsSummary(filters?: { projectId?: string; organisationId?: string }): Promise<{
  metrics: SurvivalMetrics;
  speciesBreakdown: any[];
  projectBreakdown: any[];
  districtBreakdown: any[];
  monthlyTrend: any[];
  insight: string;
}> {
  const params = new URLSearchParams();
  if (filters?.projectId) params.append('projectId', filters.projectId);
  if (filters?.organisationId) params.append('organisationId', filters.organisationId);
  const res = await fetch(`${API_BASE}/analytics/summary?${params.toString()}`);
  return res.json();
}

export async function fetchNotifications(userId?: string): Promise<{ notifications: NotificationItem[]; unread: number }> {
  const url = userId ? `${API_BASE}/notifications?userId=${userId}` : `${API_BASE}/notifications`;
  const res = await fetch(url);
  return res.json();
}

export async function markNotificationRead(id: string) {
  const res = await fetch(`${API_BASE}/notifications/${id}/read`, { method: 'POST' });
  return res.json();
}

export async function fetchPublicTransparency(slug: string) {
  const res = await fetch(`${API_BASE}/public/organisations/${slug}`);
  return res.json();
}
