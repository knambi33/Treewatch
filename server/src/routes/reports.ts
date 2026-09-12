import { Router } from 'express';
import { store } from '../db/store.js';
import { calculateSurvivalMetrics, generateProjectCsv, generateTreeAuditReport } from '../services/reportService.js';

export const reportsRouter = Router();

// GET /api/reports/project/:id/csv - Download project CSV
reportsRouter.get('/project/:id/csv', (req, res) => {
  const project = store.projects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  const trees = store.trees.filter((t) => t.projectId === project.id);
  const csvData = generateProjectCsv(project, trees);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${project.name.replace(/\s+/g, '_')}_Survival_Report.csv"`);
  res.send(csvData);
});

// GET /api/reports/project/:id/summary
reportsRouter.get('/project/:id/summary', (req, res) => {
  const project = store.projects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  const trees = store.trees.filter((t) => t.projectId === project.id);
  const metrics = calculateSurvivalMetrics(trees);

  res.json({
    success: true,
    project,
    metrics,
    generatedAt: new Date().toISOString(),
  });
});

// GET /api/reports/tree/:id/audit - Tree Level Audit Certificate
reportsRouter.get('/tree/:id/audit', (req, res) => {
  const tree = store.getTreeById(req.params.id);
  if (!tree) {
    return res.status(404).json({ success: false, message: 'Tree not found' });
  }

  const verifications = store.getTreeVerifications(tree.id);
  const report = generateTreeAuditReport(tree, verifications);

  res.json({
    success: true,
    report,
  });
});
