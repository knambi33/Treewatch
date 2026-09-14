import {
  Organisation,
  Project,
  Tree,
  User,
  Verification,
  TimelineEvent,
  ReviewQueueItem,
  NotificationItem,
  TreePhoto,
  CareActivity,
} from '../types.js';

export const SEED_ORGANISATIONS: Organisation[] = [
  {
    id: 'ORG-CSR-01',
    name: 'Green Earth CSR Foundation',
    type: 'CSR',
    contactEmail: 'csr@greenearthcorp.com',
    contactPhone: '+91 44 2833 4900',
    publicSlug: 'green-earth-csr',
    description: 'Corporate sustainability and ESG afforestation initiative aiming for verified native tree survival across Southern India.',
    location: 'Chennai & Coimbatore, Tamil Nadu',
  },
  {
    id: 'ORG-NGO-02',
    name: 'Cauvery Delta Revival NGO',
    type: 'NGO',
    contactEmail: 'projects@cauverydelta.org',
    contactPhone: '+91 4362 278100',
    publicSlug: 'cauvery-delta-revival',
    description: 'Community-led ecological restoration organisation planting riverbank soil-stabilizing native trees.',
    location: 'Thanjavur & Trichy, Tamil Nadu',
  },
  {
    id: 'ORG-SCH-03',
    name: "St. Xavier's Model Matriculation School",
    type: 'School',
    contactEmail: 'eco-club@stxaviers-school.edu.in',
    contactPhone: '+91 44 2499 1820',
    publicSlug: 'st-xaviers-green-campus',
    description: 'Youth environmental stewardship programme where each student class adopts, tags, and nurtures native trees on campus.',
    location: 'Mylapore, Chennai',
  },
  {
    id: 'ORG-PRIVATE',
    name: 'Private / Individual',
    type: 'Community',
    contactEmail: 'individual@treewatch.in',
    contactPhone: '+91 1800 123 4567',
    publicSlug: 'individual-planters',
    description: 'Independent citizens, farmers, homesteaders, and private landowners planting and tracking survival of trees on private and residential lands.',
    location: 'Pan-India / Private Lands',
  },
  {
    id: 'ORG-SCH-KEND',
    name: 'Kendriya Vidyalaya CLRI Green Campus',
    type: 'School',
    contactEmail: 'eco@kvclri-chennai.edu.in',
    contactPhone: '+91 44 2441 5566',
    publicSlug: 'kv-clri-chennai',
    description: 'Central school eco-club monitoring 200+ campus native avenue trees with botanical identification markers.',
    location: 'Adyar, Chennai, Tamil Nadu',
  },
  {
    id: 'ORG-SCH-COIM',
    name: 'Chinmaya Vidyalaya Eco Warriors',
    type: 'School',
    contactEmail: 'green@chinmayacoimbatore.edu.in',
    contactPhone: '+91 422 243 8899',
    publicSlug: 'chinmaya-coimbatore',
    description: 'School biodiversity project planting indigenous medicinal and fruit trees across school grounds.',
    location: 'R.S. Puram, Coimbatore, Tamil Nadu',
  },
  {
    id: 'ORG-CORP-TCS',
    name: 'Titan ESG Afforestation Trust',
    type: 'CSR',
    contactEmail: 'esg@titanafforest.com',
    contactPhone: '+91 80 6660 1200',
    publicSlug: 'titan-esg-trust',
    description: 'Industrial greening and biodiversity restoration along IT corridors and suburban water bodies.',
    location: 'Bengaluru, Karnataka',
  },
  {
    id: 'ORG-NGO-WEST',
    name: 'Western Ghats Agroforestry Alliance',
    type: 'NGO',
    contactEmail: 'stewards@westernghatstrees.org',
    contactPhone: '+91 422 267 3400',
    publicSlug: 'western-ghats-alliance',
    description: 'High-biodiversity native reforestation partnering with tribal communities and smallholder farmers in the Nilgiri biosphere foothills.',
    location: 'Coimbatore & Pollachi, Tamil Nadu',
  },
  {
    id: 'ORG-MUNI-MDU',
    name: 'Madurai Municipal Green Mission',
    type: 'Municipality',
    contactEmail: 'green@maduraicorp.tn.gov.in',
    contactPhone: '+91 452 253 2200',
    publicSlug: 'madurai-green-mission',
    description: 'Civic urban shade corridor along historical temple tanks and city avenues.',
    location: 'Madurai, Tamil Nadu',
  },
];

export const SEED_USERS: User[] = [
  {
    id: 'USR-PLANTER-01',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@treewatch.in',
    mobile: '+91 98401 23456',
    role: 'planter',
    roleTitle: 'Community Planter & Caretaker',
    organisationId: 'ORG-CSR-01',
    organisationName: 'Green Earth CSR Foundation',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    badges: ['🌱 Tree Planter', '📷 3-Month Guardian', '🏆 Master Guardian'],
  },
  {
    id: 'USR-STUDENT-02',
    name: 'Arun',
    email: 'arun.class8a@stxaviers-school.edu.in',
    mobile: '+91 94441 98765',
    role: 'school_student',
    roleTitle: 'Eco-Club Student Guardian',
    organisationId: 'ORG-SCH-03',
    organisationName: "St. Xavier's Model Matriculation School",
    studentClass: 'Class VIII-A',
    avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    badges: ['🌱 Tree Planter', '📷 3-Month Guardian', '🌿 6-Month Guardian', '🏆 Tree Guardian'],
  },
  {
    id: 'USR-TEACHER-03',
    name: 'Sister Mary Thomas',
    email: 'principal@stxaviers-school.edu.in',
    mobile: '+91 98410 44321',
    role: 'school_admin',
    roleTitle: 'Principal & Eco-Coordinator',
    organisationId: 'ORG-SCH-03',
    organisationName: "St. Xavier's Model Matriculation School",
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-NGO-04',
    name: 'Priya Sharma',
    email: 'priya.sharma@cauverydelta.org',
    mobile: '+91 98840 55678',
    role: 'ngo_lead',
    roleTitle: 'Field Project Director',
    organisationId: 'ORG-NGO-02',
    organisationName: 'Cauvery Delta Revival NGO',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-CSR-05',
    name: 'Ananya Sen',
    email: 'ananya.sen@greenearthcorp.com',
    mobile: '+91 99620 11223',
    role: 'csr_manager',
    roleTitle: 'Chief Sustainability Officer',
    organisationId: 'ORG-CSR-01',
    organisationName: 'Green Earth CSR Foundation',
    avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-COMMUNITY-06',
    name: 'Suresh Babu',
    email: 'suresh.babu@annanagar-rwa.org',
    mobile: '+91 98408 88990',
    role: 'community_lead',
    roleTitle: 'RWA Greenery Secretary',
    organisationId: 'ORG-CSR-01',
    organisationName: 'Green Earth CSR Foundation',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-ADMIN-07',
    name: 'Dr. K. Ramanathan',
    email: 'arborist.audit@treewatch.in',
    mobile: '+91 94440 12121',
    role: 'admin',
    roleTitle: 'Lead Verification Arborist & System Administrator',
    organisationId: 'ORG-CSR-01',
    organisationName: 'Green Earth CSR Foundation',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'USR-INDIVIDUAL-08',
    name: 'Kavitha Ramachandran',
    email: 'kavitha.nature@gmail.com',
    mobile: '+91 98402 33445',
    role: 'planter',
    roleTitle: 'Private Landowner / Citizen Planter',
    organisationId: 'ORG-PRIVATE',
    organisationName: 'Private / Individual',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    badges: ['🌱 Tree Planter', '🏡 Private Homestead Steward'],
  },
];

export const SEED_PROJECTS: Project[] = [
  {
    id: 'PRJ-CHN-01',
    organisationId: 'ORG-CSR-01',
    organisationName: 'Green Earth CSR Foundation',
    name: 'Chennai Coastal Green Belt',
    description: 'Salt-tolerant native tree plantation along the East Coast corridor for cyclone resilience and urban cooling.',
    targetTrees: 15000,
    startDate: '2023-06-05',
    geography: {
      district: 'Chennai',
      state: 'Tamil Nadu',
      centerLat: 13.0827,
      centerLng: 80.2707,
      radiusKm: 18,
    },
    gpsToleranceMeters: 25,
    partnerNgoId: 'ORG-NGO-02',
    partnerNgoName: 'Cauvery Delta Revival NGO',
  },
  {
    id: 'PRJ-CVR-02',
    organisationId: 'ORG-NGO-02',
    organisationName: 'Cauvery Delta Revival NGO',
    name: 'Cauvery River Basin Afforestation',
    description: 'Riparian buffer restoration planting dense native ficus and pongamia groves along flood embankments.',
    targetTrees: 25000,
    startDate: '2024-05-15',
    geography: {
      district: 'Thanjavur',
      state: 'Tamil Nadu',
      centerLat: 10.787,
      centerLng: 79.1378,
      radiusKm: 30,
    },
    gpsToleranceMeters: 25,
  },
  {
    id: 'PRJ-UMF-03',
    organisationId: 'ORG-CSR-01',
    organisationName: 'Green Earth CSR Foundation',
    name: 'Urban Micro-Forests Coimbatore',
    description: 'Dense pocket forests in public parks and neighborhood grounds across Coimbatore city.',
    targetTrees: 5000,
    startDate: '2023-04-15',
    geography: {
      district: 'Coimbatore',
      state: 'Tamil Nadu',
      centerLat: 11.0168,
      centerLng: 76.9558,
      radiusKm: 12,
    },
    gpsToleranceMeters: 20,
    partnerNgoId: 'ORG-NGO-WEST',
    partnerNgoName: 'Western Ghats Agroforestry Alliance',
  },
  {
    id: 'PRJ-SXG-04',
    organisationId: 'ORG-SCH-03',
    organisationName: "St. Xavier's Model Matriculation School",
    name: "St. Xavier's Green Campus 2026",
    description: 'Student-led campus bio-diversity initiative with student guardians monitoring native trees.',
    targetTrees: 500,
    startDate: '2024-06-10',
    geography: {
      district: 'Chennai',
      state: 'Tamil Nadu',
      centerLat: 13.0334,
      centerLng: 80.2677,
      radiusKm: 3,
    },
    gpsToleranceMeters: 15,
  },
  {
    id: 'PRJ-BLR-05',
    organisationId: 'ORG-CORP-TCS',
    organisationName: 'Titan ESG Afforestation Trust',
    name: 'Bengaluru IT Corridor Green Canopy',
    description: 'Corporate tech park perimeter reforestation and roadside avenues in Electronic City and Whitefield.',
    targetTrees: 8000,
    startDate: '2024-07-01',
    geography: {
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      centerLat: 12.9716,
      centerLng: 77.5946,
      radiusKm: 25,
    },
    gpsToleranceMeters: 25,
  },
  {
    id: 'PRJ-IND-06',
    organisationId: 'ORG-PRIVATE',
    organisationName: 'Private / Individual',
    name: 'Independent Citizen & Landowner Plantations',
    description: 'Self-governed individual and private plantation records across residential gardens, homesteads, and farmlands.',
    targetTrees: 5000,
    startDate: '2025-01-01',
    geography: {
      district: 'Pan-India',
      state: 'All States',
      centerLat: 13.0827,
      centerLng: 80.2707,
      radiusKm: 500,
    },
    gpsToleranceMeters: 50,
  },
  {
    id: 'PRJ-MDU-07',
    organisationId: 'ORG-MUNI-MDU',
    organisationName: 'Madurai Municipal Green Mission',
    name: 'Madurai Vaigai River Native Restoration',
    description: 'Ancient heritage avenue trees and riverbank native trees along the sacred Vaigai river banks.',
    targetTrees: 12000,
    startDate: '2023-08-15',
    geography: {
      district: 'Madurai',
      state: 'Tamil Nadu',
      centerLat: 9.9252,
      centerLng: 78.1198,
      radiusKm: 20,
    },
    gpsToleranceMeters: 25,
  },
  {
    id: 'PRJ-WGT-08',
    organisationId: 'ORG-NGO-WEST',
    organisationName: 'Western Ghats Agroforestry Alliance',
    name: 'Western Ghats Biodiversity Foothills Corridor',
    description: 'Indigenous endemic flora restoration supporting elephant corridor borders and native pollinators.',
    targetTrees: 18000,
    startDate: '2023-01-10',
    geography: {
      district: 'Coimbatore',
      state: 'Tamil Nadu',
      centerLat: 10.985,
      centerLng: 76.882,
      radiusKm: 35,
    },
    gpsToleranceMeters: 30,
  },
  {
    id: 'PRJ-SCH-09',
    organisationId: 'ORG-SCH-KEND',
    organisationName: 'Kendriya Vidyalaya CLRI Green Campus',
    name: 'KV CLRI Science & Flora Campus Trail',
    description: 'Botanical tree trail nurtured by school students, focusing on neem, peepal, and fruit tree survival.',
    targetTrees: 450,
    startDate: '2024-02-20',
    geography: {
      district: 'Chennai',
      state: 'Tamil Nadu',
      centerLat: 13.0078,
      centerLng: 80.2442,
      radiusKm: 2,
    },
    gpsToleranceMeters: 15,
  },
  {
    id: 'PRJ-SCH-10',
    organisationId: 'ORG-SCH-COIM',
    organisationName: 'Chinmaya Vidyalaya Eco Warriors',
    name: 'Chinmaya Green School Canopy Drive',
    description: 'Student adoption scheme monitoring shade and bird-attracting native trees inside school premises.',
    targetTrees: 600,
    startDate: '2023-11-14',
    geography: {
      district: 'Coimbatore',
      state: 'Tamil Nadu',
      centerLat: 11.0065,
      centerLng: 76.9482,
      radiusKm: 4,
    },
    gpsToleranceMeters: 15,
  },
];

interface SpeciesMeta {
  species: string;
  common: string;
  scientific: string;
}

const SPECIES_LIST: SpeciesMeta[] = [
  { species: 'Neem', common: 'Vembu / Margosa', scientific: 'Azadirachta indica' },
  { species: 'Pongamia', common: 'Pungai / Indian Beech', scientific: 'Millettia pinnata' },
  { species: 'Peepal', common: 'Arasa Maram / Sacred Fig', scientific: 'Ficus religiosa' },
  { species: 'Banyan', common: 'Aala Maram / Indian Banyan', scientific: 'Ficus benghalensis' },
  { species: 'Rain Tree', common: 'Thoongumoonji / Samanea', scientific: 'Samanea saman' },
  { species: 'Teak', common: 'Thekku / Teak', scientific: 'Tectona grandis' },
  { species: 'Mango', common: 'Maa Maram / Indian Mango', scientific: 'Mangifera indica' },
  { species: 'Gulmohar', common: 'Mayil Kondrai / Flamboyant', scientific: 'Delonix regia' },
  { species: 'Mahua', common: 'Iluppai / Butter Tree', scientific: 'Madhuca longifolia' },
  { species: 'Jamun', common: 'Naaval / Black Plum', scientific: 'Syzygium cumini' },
];

const PHOTO_SAMPLES = {
  healthyNeem: [
    'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80',
  ],
  healthySapling: [
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&auto=format&fit=crop&q=80',
  ],
  stressedTree: [
    'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=600&auto=format&fit=crop&q=80',
  ],
  deadTree: [
    'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&auto=format&fit=crop&q=80',
  ],
};

export function generateSeedData(): {
  organisations: Organisation[];
  projects: Project[];
  users: User[];
  trees: Tree[];
  photos: TreePhoto[];
  verifications: Verification[];
  timelineEvents: TimelineEvent[];
  reviewQueue: ReviewQueueItem[];
  notifications: NotificationItem[];
  careActivities: CareActivity[];
} {
  const trees: Tree[] = [];
  const photos: TreePhoto[] = [];
  const verifications: Verification[] = [];
  const timelineEvents: TimelineEvent[] = [];
  const reviewQueue: ReviewQueueItem[] = [];
  const notifications: NotificationItem[] = [];
  const careActivities: CareActivity[] = [];

  // Dedicated Student Tree for Arun (Class VIII-A, St. Xavier's) - Established Tree Demo (Section 34, 35)
  const studentTree: Tree = {
    id: 'TREE-SCH-00125',
    treeCode: 'SCH-00125',
    projectId: 'PRJ-SXG-04',
    projectName: "St. Xavier's Green Campus 2026",
    organisationId: 'ORG-SCH-03',
    organisationName: "St. Xavier's Model Matriculation School",
    species: 'Neem',
    commonName: 'Vembu / Margosa',
    scientificName: 'Azadirachta indica',
    plantedDate: '2024-06-10',
    latitude: 13.0335,
    longitude: 80.2678,
    gpsAccuracyMeters: 4,
    planterId: 'USR-STUDENT-02',
    planterName: 'Arun',
    caretakerId: 'USR-STUDENT-02',
    caretakerName: 'Arun',
    landCategory: 'School',
    status: 'Verified Alive',
    currentHealth: 'Healthy',
    evidenceQuality: 'High',
    baselinePhotoUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&auto=format&fit=crop&q=80',
    latestPhotoUrl: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&auto=format&fit=crop&q=80',
    lastVerifiedDate: '2026-08-15',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=SCH-00125',
    notes: 'DEMO DATA: Adopted by Arun, Class VIII-A. Regular organic composting and mulch applied beside biology laboratory quadrangle.',
    ageMonths: 26,
    checkInCount: 24,
    studentClass: 'Class VIII-A',
    studentName: 'Arun',
    createdAt: '2024-06-10T09:30:00Z',
  };
  trees.push(studentTree);

  // Arun's baseline photo
  photos.push({
    id: 'PHT-SCH-01',
    treeId: studentTree.id,
    photoUrl: studentTree.baselinePhotoUrl,
    capturedAt: '2024-06-10T09:30:00Z',
    latitude: 13.0335,
    longitude: 80.2678,
    gpsAccuracyMeters: 4,
    captureMethod: 'In-App Camera',
    photoType: 'Baseline',
    imageHash: 'hash-sch-001-baseline',
  });

  // Arun's care activities
  careActivities.push(
    {
      id: 'CARE-SCH-01',
      treeId: studentTree.id,
      activityType: 'Care Plan Assigned',
      date: '2024-06-10',
      recordedByUserId: 'USR-STUDENT-02',
      recordedByUserName: 'Arun (Class VIII-A)',
      notes: 'Weekly watering and tree guard allocated.',
    },
    {
      id: 'CARE-SCH-02',
      treeId: studentTree.id,
      activityType: 'Watering',
      date: '2026-08-10',
      recordedByUserId: 'USR-STUDENT-02',
      recordedByUserName: 'Arun (Class VIII-A)',
      notes: 'Deep root watering completed.',
    },
    {
      id: 'CARE-SCH-03',
      treeId: studentTree.id,
      activityType: 'Mulching',
      date: '2026-08-12',
      recordedByUserId: 'USR-STUDENT-02',
      recordedByUserName: 'Arun (Class VIII-A)',
      notes: 'Dry leaf ring placed around root zone.',
    },
    {
      id: 'CARE-SCH-04',
      treeId: studentTree.id,
      activityType: 'Protection',
      date: '2024-06-15',
      recordedByUserId: 'USR-STUDENT-02',
      recordedByUserName: 'Arun (Class VIII-A)',
      notes: 'Bamboo tree guard installed against campus football grounds.',
    }
  );

  // Generate 24 historical verifications for Arun's tree
  for (let m = 1; m <= 24; m++) {
    const vDate = new Date(2024, 5 + m, 15).toISOString().split('T')[0];
    verifications.push({
      id: `VRF-SCH-${m}`,
      treeId: studentTree.id,
      treeCode: studentTree.treeCode,
      photoId: `PHT-SCH-${m}`,
      photoUrl: studentTree.latestPhotoUrl,
      verificationMonth: vDate.substring(0, 7),
      submittedAt: `${vDate}T10:00:00Z`,
      submittedByUserId: 'USR-STUDENT-02',
      submittedByUserName: 'Arun',
      currentLat: 13.03351,
      currentLng: 80.26781,
      gpsDistanceMeters: 2,
      gpsToleranceMeters: 15,
      gpsStatus: 'Verified',
      gpsAccuracyMeters: 4,
      sameTreeConfidenceScore: 94 + (m % 5),
      sameTreeClassification: 'High confidence',
      sameTreePersistentFeatures: ['Trunk bifurcation matched', 'Campus quadrangle wall in background aligned'],
      speciesDetected: 'Neem',
      speciesConfidenceScore: 95,
      healthAssessment: 'Healthy',
      healthIndicators: {
        foliageDensity: 'Dense / Normal',
        canopyCondition: 'Vibrant Green',
        trunkCondition: 'Intact & Sturdy',
        growthObservation: `Active vertical branch development. Verification month ${m}.`,
      },
      evidenceQuality: 'High',
      verificationStatus: 'Auto-Approved',
      flags: [],
      verifiedAt: `${vDate}T10:05:00Z`,
    });
  }

  // Generate 520 realistic trees across all 10 projects (Section 65)
  const TOTAL_TREES_TARGET = 520;
  let treeCounter = 1;

  SEED_PROJECTS.forEach((proj, pIdx) => {
    // Trees per project: between 45 and 65
    const countForProj = Math.floor(TOTAL_TREES_TARGET / SEED_PROJECTS.length);

    for (let i = 0; i < countForProj; i++) {
      treeCounter++;
      const paddedId = treeCounter.toString().padStart(6, '0');
      const stateCode = proj.geography.state === 'Karnataka' ? 'KA' : proj.geography.state === 'Maharashtra' ? 'MH' : 'TN';
      const distCode = proj.geography.district.substring(0, 3).toUpperCase();
      const treeCode = `TREE-${stateCode}-${distCode}-${paddedId}`;

      const speciesMeta = SPECIES_LIST[(i + pIdx) % SPECIES_LIST.length];
      const planter = SEED_USERS[(i + pIdx) % SEED_USERS.length];
      const caretaker = planter;

      // Coordinate jitter around project center
      const latOffset = (Math.random() - 0.5) * (proj.geography.radiusKm / 111);
      const lngOffset = (Math.random() - 0.5) * (proj.geography.radiusKm / 111);
      const lat = Math.round((proj.geography.centerLat + latOffset) * 10000) / 10000;
      const lng = Math.round((proj.geography.centerLng + lngOffset) * 10000) / 10000;

      // Lifecycle status distribution:
      // ~15% Established Champions (age 36-38 months, 24+ checks)
      // ~60% Thriving / Surviving (age 6-24 months, healthy)
      // ~10% Young (age 1-3 months)
      // ~4% Newly Planted (age 0 months)
      // ~5% Verification Pending
      // ~3% Stressed / Poor Health
      // ~3% Dead (verified dead, preserved lifetime score)
      // ~2% Verification Exception (GPS mismatch / duplicate photo)
      const randType = Math.random();

      let status: any = 'Verified Alive';
      let health: any = 'Healthy';
      let ageMonths = 12;
      let checkInCount = 10;
      let plantedDate = '2025-09-01';
      let baselineUrl = PHOTO_SAMPLES.healthySapling[i % PHOTO_SAMPLES.healthySapling.length];
      let latestUrl = PHOTO_SAMPLES.healthyNeem[i % PHOTO_SAMPLES.healthyNeem.length];
      let isException = false;
      let exceptionReason = '';

      if (randType < 0.15) {
        // Established Tree (36-38 months, 24+ verifications)
        ageMonths = 36 + Math.floor(Math.random() * 3);
        checkInCount = 24 + Math.floor(Math.random() * 6);
        plantedDate = '2023-06-15';
        status = 'Verified Alive';
        health = 'Healthy';
      } else if (randType < 0.70) {
        // Thriving / Surviving (6 - 24 months)
        ageMonths = 6 + Math.floor(Math.random() * 18);
        checkInCount = Math.max(4, Math.floor(ageMonths * 0.9));
        plantedDate = new Date(Date.now() - ageMonths * 30.4375 * 24 * 3600 * 1000).toISOString().split('T')[0];
        status = 'Verified Alive';
        health = i % 7 === 0 ? 'Moderate Stress' : 'Healthy';
        if (health === 'Moderate Stress') latestUrl = PHOTO_SAMPLES.stressedTree[0];
      } else if (randType < 0.80) {
        // Young (1 - 3 months)
        ageMonths = 1 + Math.floor(Math.random() * 3);
        checkInCount = ageMonths;
        plantedDate = new Date(Date.now() - ageMonths * 30.4375 * 24 * 3600 * 1000).toISOString().split('T')[0];
        status = 'Verified Alive';
        health = 'Healthy';
      } else if (randType < 0.85) {
        // Newly Planted (0 months, brand new)
        ageMonths = 0;
        checkInCount = 0;
        plantedDate = new Date().toISOString().split('T')[0];
        status = 'Planted';
        health = 'Healthy';
        latestUrl = baselineUrl;
      } else if (randType < 0.90) {
        // Verification Pending (overdue check-in, NOT dead!)
        ageMonths = 8;
        checkInCount = 5;
        plantedDate = '2025-12-01';
        status = 'Verification Pending';
        health = 'Healthy';
      } else if (randType < 0.94) {
        // Stressed / Poor Health
        ageMonths = 10;
        checkInCount = 8;
        plantedDate = '2025-10-15';
        status = 'Needs Attention';
        health = i % 2 === 0 ? 'Moderate Stress' : 'Poor Health';
        latestUrl = PHOTO_SAMPLES.stressedTree[1 % PHOTO_SAMPLES.stressedTree.length];
      } else if (randType < 0.97) {
        // Verified Dead (survived for 14 months then died, lifetime score preserved)
        ageMonths = 16;
        checkInCount = 14;
        plantedDate = '2025-05-10';
        status = 'Dead';
        health = 'Dead / Missing';
        latestUrl = PHOTO_SAMPLES.deadTree[0];
      } else {
        // Verification Exception (GPS Mismatch / Duplicate Photo)
        ageMonths = 7;
        checkInCount = 5;
        plantedDate = '2026-01-15';
        status = 'Verification Exception';
        health = 'Healthy';
        isException = true;
        exceptionReason = i % 2 === 0 ? 'GPS Mismatch (185m > 25m allowed radius)' : 'Possible reused photograph detected';
      }

      const tree: Tree = {
        id: `TREE-DEMO-${paddedId}`,
        treeCode,
        projectId: proj.id,
        projectName: proj.name,
        organisationId: proj.organisationId,
        organisationName: proj.organisationName,
        species: speciesMeta.species,
        commonName: speciesMeta.common,
        scientificName: speciesMeta.scientific,
        plantedDate,
        latitude: lat,
        longitude: lng,
        gpsAccuracyMeters: isException && exceptionReason.includes('GPS') ? 35 : Math.floor(4 + Math.random() * 6),
        planterId: planter.id,
        planterName: planter.name,
        caretakerId: caretaker.id,
        caretakerName: caretaker.name,
        landCategory: (proj.organisationId.includes('SCH') ? 'School' : i % 4 === 0 ? 'Private' : i % 3 === 0 ? 'Roadside' : 'Park') as any,
        status,
        currentHealth: health,
        evidenceQuality: isException ? 'Low' : 'High',
        baselinePhotoUrl: baselineUrl,
        latestPhotoUrl: latestUrl,
        lastVerifiedDate: status === 'Verification Pending' ? '2026-06-15' : '2026-08-25',
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${treeCode}`,
        notes: `DEMO DATA: Tree planted under project ${proj.name}. Monitored with GPS and AI verification.`,
        ageMonths,
        checkInCount,
        studentClass: proj.organisationId.includes('SCH') ? 'Class IX-B' : undefined,
        studentName: proj.organisationId.includes('SCH') ? planter.name : undefined,
        createdAt: `${plantedDate}T08:00:00Z`,
      };
      trees.push(tree);

      // Baseline photo
      photos.push({
        id: `PHT-${tree.id}-BASE`,
        treeId: tree.id,
        photoUrl: baselineUrl,
        capturedAt: `${plantedDate}T08:15:00Z`,
        latitude: lat,
        longitude: lng,
        gpsAccuracyMeters: tree.gpsAccuracyMeters,
        captureMethod: 'In-App Camera',
        photoType: 'Baseline',
        imageHash: `hash-${tree.id}-base`,
      });

      // Care Activities (Watering, Mulch, Guarding)
      if (status !== 'Planted') {
        careActivities.push({
          id: `CARE-${tree.id}-01`,
          treeId: tree.id,
          activityType: 'Care Plan Assigned',
          date: plantedDate,
          recordedByUserId: planter.id,
          recordedByUserName: planter.name,
          notes: 'Standard watering and monitoring schedule assigned.',
        });

        if (checkInCount >= 2) {
          careActivities.push({
            id: `CARE-${tree.id}-02`,
            treeId: tree.id,
            activityType: 'Watering',
            date: '2026-08-15',
            recordedByUserId: planter.id,
            recordedByUserName: planter.name,
            notes: 'Deep watering carried out.',
          });
        }

        if (tree.landCategory === 'School' || tree.landCategory === 'Private') {
          careActivities.push({
            id: `CARE-${tree.id}-03`,
            treeId: tree.id,
            activityType: 'Protection',
            date: plantedDate,
            recordedByUserId: planter.id,
            recordedByUserName: planter.name,
            notes: 'Protective tree guard installed.',
          });
        }
      }

      // Generate verification trail
      if (checkInCount > 0) {
        const numChecksToGenerate = Math.min(checkInCount, 6); // Keep last 6 verifications per tree for compact payload
        for (let c = 1; c <= numChecksToGenerate; c++) {
          const isLastCheck = c === numChecksToGenerate;
          const checkMonth = `2026-0${Math.min(8, 2 + c)}`;
          const checkDate = `${checkMonth}-20`;

          const checkGpsStatus = isLastCheck && isException && exceptionReason.includes('GPS') ? 'Mismatch' : 'Verified';
          const checkDist = checkGpsStatus === 'Mismatch' ? 185 : Math.floor(2 + Math.random() * 8);

          const verify: Verification = {
            id: `VRF-${tree.id}-${c}`,
            treeId: tree.id,
            treeCode: tree.treeCode,
            photoId: `PHT-${tree.id}-${c}`,
            photoUrl: isLastCheck ? latestUrl : baselineUrl,
            verificationMonth: checkMonth,
            submittedAt: `${checkDate}T11:00:00Z`,
            submittedByUserId: planter.id,
            submittedByUserName: planter.name,
            currentLat: checkGpsStatus === 'Mismatch' ? lat + 0.002 : lat,
            currentLng: checkGpsStatus === 'Mismatch' ? lng + 0.002 : lng,
            gpsDistanceMeters: checkDist,
            gpsToleranceMeters: proj.gpsToleranceMeters,
            gpsStatus: checkGpsStatus,
            gpsAccuracyMeters: checkGpsStatus === 'Mismatch' ? 28 : 5,
            sameTreeConfidenceScore: isException && exceptionReason.includes('reused') ? 99 : isException ? 45 : Math.floor(88 + Math.random() * 9),
            sameTreeClassification: isException && !exceptionReason.includes('reused') ? 'Low confidence' : 'High confidence',
            sameTreePersistentFeatures: ['Bark pattern matches baseline', 'Crown shape aligned'],
            speciesDetected: speciesMeta.species,
            speciesConfidenceScore: 92,
            healthAssessment: isLastCheck ? health : 'Healthy',
            healthIndicators: {
              foliageDensity: health === 'Dead / Missing' ? 'No Foliage' : health.includes('Stress') ? 'Sparse / Defoliated' : 'Dense / Normal',
              canopyCondition: health === 'Dead / Missing' ? 'Severe Browning / Dried' : health.includes('Stress') ? 'Moderate Wilting / Yellowing' : 'Vibrant Green',
              trunkCondition: health === 'Dead / Missing' ? 'Severely Damaged / Broken' : 'Intact & Sturdy',
              growthObservation: `Progressive seasonal foliage check. Month ${checkMonth}.`,
            },
            evidenceQuality: isException ? 'Low' : 'High',
            verificationStatus: isException ? 'Pending Review' : 'Auto-Approved',
            flags: isException ? [exceptionReason] : [],
          };
          verifications.push(verify);

          // Add Review Queue item for exceptions
          if (isLastCheck && isException) {
            reviewQueue.push({
              id: `REV-${tree.id}`,
              treeId: tree.id,
              treeCode: tree.treeCode,
              verificationId: verify.id,
              species: tree.species,
              projectName: proj.name,
              organisationName: proj.organisationName,
              submittedAt: verify.submittedAt,
              submittedByName: planter.name,
              flags: [exceptionReason],
              baselinePhotoUrl: baselineUrl,
              currentPhotoUrl: latestUrl,
              registeredCoords: { lat: tree.latitude, lng: tree.longitude },
              currentCoords: { lat: verify.currentLat, lng: verify.currentLng },
              distanceMeters: checkDist,
              gpsToleranceMeters: proj.gpsToleranceMeters,
              aiSameTreeConfidence: verify.sameTreeConfidenceScore,
              aiHealthAssessment: health,
              aiSpeciesDetected: speciesMeta.species,
              status: 'Pending',
            });
          }
        }
      }

      // Notifications for overdue or stressed trees
      if (status === 'Verification Pending') {
        notifications.push({
          id: `NOTIF-${tree.id}`,
          userId: planter.id,
          treeId: tree.id,
          treeCode: tree.treeCode,
          title: '🌱 Monthly Tree Check-in Due',
          message: `${tree.treeCode} (${speciesMeta.species}) needs its monthly photograph. Please check in today.`,
          type: 'monthly_reminder',
          sentAt: '2026-08-15T09:00:00Z',
          read: false,
          priority: 'normal',
        });
      }

      // Timeline events
      timelineEvents.push({
        id: `TL-${tree.id}-01`,
        treeId: tree.id,
        timestamp: tree.createdAt,
        eventType: 'Planted',
        title: `🌱 Tree Planted by ${planter.name}`,
        description: `${speciesMeta.species} planted under project ${proj.name}. Baseline photo & GPS geotagged.`,
        photoUrl: baselineUrl,
        badge: 'Planted',
        actorName: planter.name,
      });

      if (checkInCount > 0) {
        timelineEvents.push({
          id: `TL-${tree.id}-02`,
          treeId: tree.id,
          timestamp: '2026-08-20T10:00:00Z',
          eventType: 'AI Verification',
          title: `📷 Verification Audit — ${status}`,
          description: `GPS verified. Health evaluated as ${health}. Check-ins recorded: ${checkInCount}.`,
          badge: status,
        });
      }
    }
  });

  console.log(`[SeedData] Generated ${trees.length} trees across ${SEED_PROJECTS.length} projects and ${SEED_ORGANISATIONS.length} organisations.`);

  return {
    organisations: SEED_ORGANISATIONS,
    projects: SEED_PROJECTS,
    users: SEED_USERS,
    trees,
    photos,
    verifications,
    timelineEvents,
    reviewQueue,
    notifications,
    careActivities,
  };
}
