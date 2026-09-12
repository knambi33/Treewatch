import { Router } from 'express';
import { store } from '../db/store.js';

export const authRouter = Router();

// List all available persona users for easy switching
authRouter.get('/users', (req, res) => {
  res.json({
    success: true,
    users: store.users,
  });
});

// Get user profile by ID
authRouter.get('/users/:id', (req, res) => {
  const user = store.users.find((u) => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, user });
});

// Simulate login with OTP / credentials
authRouter.post('/login', (req, res) => {
  const { userId, mobile, otp } = req.body;

  let user = store.users.find((u) => u.id === userId);
  if (!user && mobile) {
    user = store.users.find((u) => u.mobile.replace(/\s+/g, '') === mobile.replace(/\s+/g, ''));
  }

  // If new phone number entered in demo, create quick planter user
  if (!user && mobile) {
    user = {
      id: `USR-${Date.now()}`,
      name: 'Field Planter',
      email: `${mobile}@treewatch.in`,
      mobile,
      role: 'planter',
      roleTitle: 'Community Planter',
      organisationId: 'ORG-CSR-01',
      organisationName: 'Green Earth CSR Foundation',
    };
    store.users.push(user);
  }

  if (!user) {
    user = store.users[0]; // default to Ravi Kumar
  }

  res.json({
    success: true,
    user,
    token: `token-${user.id}-${Date.now()}`,
    message: 'Authenticated successfully via OTP',
  });
});

// POST /api/auth/register - Self-registration for individuals, students, NGO coordinators
authRouter.post('/register', (req, res) => {
  const { name, mobile, email, role, roleTitle, organisationId, studentClass } = req.body;

  if (!name || !mobile) {
    return res.status(400).json({ success: false, message: 'Name and mobile number are required.' });
  }

  const isPrivate = !organisationId || organisationId === 'ORG-PRIVATE' || organisationId === 'private' || organisationId === 'individual';
  const existingOrg = store.organisations.find((o) => o.id === organisationId);

  const finalOrgId = isPrivate ? 'ORG-PRIVATE' : (organisationId || 'ORG-PRIVATE');
  const finalOrgName = isPrivate ? 'Private / Individual' : (existingOrg?.name || 'Private / Individual');

  const newUser = {
    id: `USR-${Date.now().toString().slice(-6)}`,
    name,
    mobile,
    email: email || `${mobile.replace(/[^0-9]/g, '')}@treewatch.in`,
    role: role || 'planter',
    roleTitle: roleTitle || (
      isPrivate
        ? 'Independent Planter / Landowner'
        : role === 'ngo_lead'
          ? 'NGO Project Lead'
          : role === 'school_student'
            ? 'Student Guardian'
            : 'Community Caretaker'
    ),
    organisationId: finalOrgId,
    organisationName: finalOrgName,
    studentClass,
    avatarUrl: `https://images.unsplash.com/photo-${1535713875000 + Math.floor(Math.random() * 5000)}?w=150&auto=format&fit=crop&q=80`,
    badges: isPrivate ? ['🌱 Tree Planter', '🏡 Private Steward'] : ['🌱 Tree Planter'],
  };

  store.users.unshift(newUser);

  res.status(201).json({
    success: true,
    message: `Account created successfully for ${name}!`,
    user: newUser,
    token: `token-${newUser.id}-${Date.now()}`,
  });
});
