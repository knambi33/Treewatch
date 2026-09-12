import { Router } from 'express';
import { store } from '../db/store.js';

export const reviewsRouter = Router();

// GET /api/reviews - Get all review queue items
reviewsRouter.get('/', (req, res) => {
  const status = req.query.status as string;
  let items = store.reviewQueue;
  if (status) {
    items = items.filter((i) => i.status.toLowerCase() === status.toLowerCase());
  }

  res.json({
    success: true,
    total: items.length,
    reviewQueue: items,
  });
});

// POST /api/reviews/:id/action - Arborist review decision
reviewsRouter.post('/:id/action', (req, res) => {
  const { action, correctedStatus, correctedHealth, correctedSpecies, reviewerRemarks, reviewerId, reviewerName } = req.body;

  if (!action || !['Approved', 'Rejected', 'Photo-Requested'].includes(action)) {
    return res.status(400).json({ success: false, message: 'Valid action is required' });
  }

  const updated = store.handleReviewAction({
    queueItemId: req.params.id,
    action,
    correctedStatus,
    correctedHealth,
    correctedSpecies,
    reviewerRemarks: reviewerRemarks || 'Reviewed and updated by verification arborist.',
    reviewerId: reviewerId || 'USR-ADMIN-07',
    reviewerName: reviewerName || 'Dr. K. Ramanathan',
  });

  if (!updated) {
    return res.status(404).json({ success: false, message: 'Review queue item not found' });
  }

  res.json({
    success: true,
    message: `Review decision "${action}" recorded successfully.`,
    item: updated,
  });
});
