import { NotificationItem } from '../types.js';

export class NotificationService {
  private notifications: NotificationItem[] = [];

  public createNotification(params: {
    userId: string;
    treeId: string;
    treeCode: string;
    type: 'monthly_reminder' | 'pending_3day' | 'pending_7day' | 'overdue_escalation' | 'review_update';
    title?: string;
    message?: string;
    priority?: 'normal' | 'high' | 'urgent';
  }): NotificationItem {
    let title = params.title;
    let message = params.message;
    let priority = params.priority || 'normal';

    if (!title || !message) {
      switch (params.type) {
        case 'monthly_reminder':
          title = '🌱 Time to check your tree';
          message = `${params.treeCode} is due for its monthly survival check-in. Please photograph the tree this month.`;
          priority = 'normal';
          break;
        case 'pending_3day':
          title = '⏳ Monthly Check-in Pending';
          message = `Reminder: Your monthly verification for ${params.treeCode} is 3 days pending.`;
          priority = 'normal';
          break;
        case 'pending_7day':
          title = '⚠️ Verification Awaiting Photo';
          message = `Please complete this month's tree verification for ${params.treeCode}. It takes less than 1 minute!`;
          priority = 'high';
          break;
        case 'overdue_escalation':
          title = '🚨 Verification Overdue Escalation';
          message = `Verification for ${params.treeCode} is overdue by >14 days. Project manager notified.`;
          priority = 'urgent';
          break;
        case 'review_update':
          title = '📋 Tree Review Decision';
          message = `The arborist review team has reviewed the verification record for ${params.treeCode}.`;
          priority = 'normal';
          break;
      }
    }

    const item: NotificationItem = {
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: params.userId,
      treeId: params.treeId,
      treeCode: params.treeCode,
      title,
      message,
      type: params.type,
      sentAt: new Date().toISOString(),
      read: false,
      priority,
    };

    this.notifications.unshift(item);
    return item;
  }

  public getForUser(userId: string): NotificationItem[] {
    return this.notifications.filter((n) => n.userId === userId || n.userId === 'all');
  }

  public markRead(id: string) {
    const item = this.notifications.find((n) => n.id === id);
    if (item) item.read = true;
  }

  public seedNotifications(items: NotificationItem[]) {
    this.notifications = [...items, ...this.notifications];
  }
}

export const notificationService = new NotificationService();
