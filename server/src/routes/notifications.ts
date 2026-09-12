import { Router } from 'express';
import { store } from '../db/store.js';

export const notificationsRouter = Router();

notificationsRouter.get('/', (req, res) => {
  const userId = req.query.userId as string;
  let items = store.notifications;
  if (userId) {
    items = items.filter((n) => n.userId === userId || n.userId === 'all');
  }

  res.json({
    success: true,
    total: items.length,
    unread: items.filter((i) => !i.read).length,
    notifications: items,
  });
});

notificationsRouter.post('/:id/read', (req, res) => {
  const item = store.notifications.find((n) => n.id === req.params.id);
  if (item) {
    item.read = true;
  }
  res.json({ success: true, item });
});
