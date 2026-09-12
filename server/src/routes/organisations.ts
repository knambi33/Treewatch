import { Router } from 'express';
import { store } from '../db/store.js';
import { calculateSurvivalMetrics } from '../services/reportService.js';

export const organisationsRouter = Router();

organisationsRouter.get('/', (req, res) => {
  const orgsWithStats = store.organisations.map((org) => {
    const orgTrees = store.trees.filter((t) => t.organisationId === org.id);
    const metrics = calculateSurvivalMetrics(orgTrees);
    const orgProjects = store.projects.filter((p) => p.organisationId === org.id);
    return {
      ...org,
      totalProjects: orgProjects.length,
      metrics,
    };
  });

  res.json({ success: true, organisations: orgsWithStats });
});

organisationsRouter.get('/:id', (req, res) => {
  const org = store.organisations.find((o) => o.id === req.params.id || o.publicSlug === req.params.id);
  if (!org) {
    return res.status(404).json({ success: false, message: 'Organisation not found' });
  }

  const orgTrees = store.trees.filter((t) => t.organisationId === org.id);
  const metrics = calculateSurvivalMetrics(orgTrees);
  const projects = store.projects.filter((p) => p.organisationId === org.id);

  res.json({
    success: true,
    organisation: {
      ...org,
      projects,
      metrics,
    },
  });
});

// POST /api/organisations/register - Register a new NGO, School, or CSR organisation
organisationsRouter.post('/register', (req, res) => {
  const { name, type, contactEmail, contactPhone, description, location } = req.body;

  if (!name || !type) {
    return res.status(400).json({ success: false, message: 'Organisation name and type are required.' });
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const newOrg = {
    id: `ORG-${type.toUpperCase()}-${Date.now().toString().slice(-4)}`,
    name,
    type: type as any,
    contactEmail: contactEmail || 'contact@' + slug + '.org',
    contactPhone: contactPhone || '+91 90000 00000',
    publicSlug: slug,
    description: description || 'Registered afforestation partner on TreeWatch.',
    location: location || 'India',
  };

  store.organisations.push(newOrg);

  res.status(201).json({
    success: true,
    message: `Organisation "${name}" registered successfully!`,
    organisation: newOrg,
  });
});
