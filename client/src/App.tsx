import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OfflineProvider } from './context/OfflineContext';
import { ViewProvider, useView } from './context/ViewContext';
import { ActiveTreeBackground } from './components/common/ActiveTreeBackground';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';
import { DeviceFrameToggle } from './components/layout/DeviceFrameToggle';
import { QRScannerModal } from './components/common/QRScannerModal';
import { VerificationWizard } from './components/verification/VerificationWizard';
import { RegistrationModal } from './components/common/RegistrationModal';

import { PlanterHome } from './pages/PlanterHome';
import { TreeDirectory } from './pages/TreeDirectory';
import { TreeMapView } from './components/map/TreeMapView';
import { ProjectsPage } from './pages/ProjectsPage';
import { CSRDashboard } from './pages/CSRDashboard';
import { NGODashboard } from './pages/NGODashboard';
import { SchoolDashboard } from './pages/SchoolDashboard';
import { AdminReviewQueue } from './pages/AdminReviewQueue';
import { AnalyticsView } from './pages/AnalyticsView';
import { PublicTransparency } from './pages/PublicTransparency';
import { ReportsPage } from './pages/ReportsPage';
import { TreeDetail } from './pages/TreeDetail';
import { RegisterTree } from './pages/RegisterTree';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { AdminConfigModal } from './components/common/AdminConfigModal';
import { InstallPWAModal } from './components/common/InstallPWAModal';

import { fetchTrees, fetchProjects, fetchOrganisations, fetchTreeDetails } from './api';
import { Tree, Project, Organisation, TimelineEvent, Verification, TreePhoto } from './types';

function MainApp() {
  const { currentUser } = useAuth();
  const { deviceMode } = useView();

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [trees, setTrees] = useState<Tree[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal states
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [treeDetailData, setTreeDetailData] = useState<{
    timeline: TimelineEvent[];
    verifications: Verification[];
    photos: TreePhoto[];
  } | null>(null);

  const [verifyingTree, setVerifyingTree] = useState<Tree | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [showQRScanner, setShowQRScanner] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [showAdminConfigModal, setShowAdminConfigModal] = useState<boolean>(false);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPWAInstalled, setIsPWAInstalled] = useState<boolean>(false);

  // Capture PWA installation triggers and shortcut URLs
  useEffect(() => {
    // Check if running in standalone PWA mode
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsPWAInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      console.log('[TreeWatch PWA] beforeinstallprompt captured');
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      console.log('[TreeWatch PWA] App was successfully installed');
      setIsPWAInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Handle home screen shortcuts launched from manifest (e.g. ?action=plant)
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    const tab = params.get('tab');

    if (action === 'plant') {
      setShowRegisterModal(true);
    } else if (action === 'camera') {
      setShowQRScanner(true);
    } else if (tab) {
      setCurrentTab(tab);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Fetch initial data
  const loadData = async () => {
    try {
      const [treesRes, projsRes, orgsRes] = await Promise.all([
        fetchTrees({ limit: 120 }),
        fetchProjects(),
        fetchOrganisations(),
      ]);
      setTrees(treesRes.trees || []);
      setProjects(projsRes || []);
      setOrganisations(orgsRes || []);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // When a tree is selected for full profile
  const handleSelectTree = async (tree: Tree) => {
    setSelectedTree(tree);
    try {
      const details = await fetchTreeDetails(tree.id);
      setTreeDetailData({
        timeline: details.timeline || [],
        verifications: details.verifications || [],
        photos: details.photos || [],
      });
      setCurrentTab('treeDetail');
    } catch (err) {
      console.error(err);
      setCurrentTab('treeDetail');
    }
  };

  const handleVerifyTree = (tree: Tree) => {
    setVerifyingTree(tree);
  };

  const handleTreeRegistered = (newTree: Tree) => {
    setTrees((prev) => [newTree, ...prev]);
    handleSelectTree(newTree);
  };

  const handleVerificationSuccess = () => {
    loadData();
    if (selectedTree) {
      handleSelectTree(selectedTree);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col text-stone-900 selection:bg-emerald-200">
      {/* Active Living Tree Background with Floating Leaves */}
      <ActiveTreeBackground />

      {/* Top Navbar with Role Switcher, Device Toggle, Offline Sync */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setSelectedTree(null);
          setCurrentTab(tab);
        }}
        onOpenQRScanner={() => setShowQRScanner(true)}
        onOpenRegisterModal={() => setShowOnboardingModal(true)}
        onOpenAdminConfig={() => setShowAdminConfigModal(true)}
        onOpenInstallPWA={!isPWAInstalled ? () => setShowInstallModal(true) : undefined}
      />

      {/* Main Content Viewport wrapped in Device Frame Toggle */}
      <DeviceFrameToggle>
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 relative z-10">
          {loading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-bold text-stone-600">
                Loading TreeWatch Geotag Registry...
              </p>
            </div>
          ) : (
            <>
              {currentTab === 'home' && (
                <PlanterHome
                  trees={trees}
                  onSelectTree={handleSelectTree}
                  onVerifyTree={handleVerifyTree}
                  onPlantTreeClick={() => setShowRegisterModal(true)}
                  onScanQRClick={() => setShowQRScanner(true)}
                  onOpenLeaderboard={() => setCurrentTab('leaderboard')}
                />
              )}

              {currentTab === 'trees' && (
                <TreeDirectory
                  trees={trees}
                  projects={projects}
                  onSelectTree={handleSelectTree}
                  onVerifyTree={handleVerifyTree}
                  onPlantTreeClick={() => setShowRegisterModal(true)}
                />
              )}

              {currentTab === 'map' && (
                <TreeMapView
                  trees={trees}
                  projects={projects}
                  organisations={organisations}
                  onSelectTree={handleSelectTree}
                  onVerifyTree={handleVerifyTree}
                />
              )}

              {currentTab === 'projects' && (
                <ProjectsPage
                  projects={projects}
                  trees={trees}
                  onSelectProject={(pId) => {
                    setCurrentTab('trees');
                  }}
                />
              )}

              {currentTab === 'csr' && (
                <CSRDashboard
                  projects={projects}
                  trees={trees}
                  onSelectTree={handleSelectTree}
                />
              )}

              {currentTab === 'ngo' && (
                <NGODashboard
                  projects={projects}
                  trees={trees}
                  onSelectTree={handleSelectTree}
                  onRefresh={loadData}
                />
              )}

              {currentTab === 'school' && (
                <SchoolDashboard
                  trees={trees}
                  onSelectTree={handleSelectTree}
                  onVerifyTree={handleVerifyTree}
                />
              )}

              {currentTab === 'leaderboard' && (
                <LeaderboardPage
                  onSelectTree={(treeId) => {
                    const found = trees.find((t) => t.id === treeId);
                    if (found) handleSelectTree(found);
                  }}
                  onOpenMethodology={() => setCurrentTab('methodology')}
                />
              )}

              {currentTab === 'methodology' && (
                <MethodologyPage
                  onBackToHome={() => setCurrentTab('home')}
                  onExploreLeaderboard={() => setCurrentTab('leaderboard')}
                />
              )}

              {currentTab === 'review' && <AdminReviewQueue />}

              {currentTab === 'analytics' && <AnalyticsView />}

              {currentTab === 'public' && <PublicTransparency />}

              {currentTab === 'reports' && (
                <ReportsPage
                  projects={projects}
                  trees={trees}
                  onSelectTree={handleSelectTree}
                />
              )}

              {currentTab === 'treeDetail' && selectedTree && (
                <TreeDetail
                  tree={selectedTree}
                  timeline={treeDetailData?.timeline || []}
                  verifications={treeDetailData?.verifications || []}
                  photos={treeDetailData?.photos || []}
                  onBack={() => setCurrentTab('home')}
                  onVerifyClick={() => handleVerifyTree(selectedTree)}
                />
              )}
            </>
          )}
        </main>
      </DeviceFrameToggle>

      {/* Mobile Bottom Navigation (active on mobile viewports or phone mode) */}
      {(deviceMode === 'mobile' || window.innerWidth < 768) && (
        <MobileNav
          currentTab={currentTab}
          setCurrentTab={(t) => {
            setSelectedTree(null);
            setCurrentTab(t);
          }}
          onPlantTreeClick={() => setShowRegisterModal(true)}
          onScanQRClick={() => setShowQRScanner(true)}
        />
      )}

      {/* Modals */}
      {verifyingTree && (
        <VerificationWizard
          tree={verifyingTree}
          onClose={() => setVerifyingTree(null)}
          onSuccess={handleVerificationSuccess}
        />
      )}

      {showRegisterModal && (
        <RegisterTree
          projects={projects}
          onClose={() => setShowRegisterModal(false)}
          onSuccess={handleTreeRegistered}
        />
      )}

      {showQRScanner && (
        <QRScannerModal
          trees={trees}
          onSelectTree={handleSelectTree}
          onClose={() => setShowQRScanner(false)}
        />
      )}

      {showOnboardingModal && (
        <RegistrationModal
          organisations={organisations}
          onClose={() => setShowOnboardingModal(false)}
          onSuccess={loadData}
        />
      )}

      {showAdminConfigModal && (
        <AdminConfigModal
          onClose={() => setShowAdminConfigModal(false)}
          onConfigSaved={loadData}
        />
      )}

      {showInstallModal && (
        <InstallPWAModal
          onClose={() => setShowInstallModal(false)}
          deferredPrompt={deferredPrompt}
          onInstallAccepted={() => {
            setIsPWAInstalled(true);
            setShowInstallModal(false);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <OfflineProvider>
        <ViewProvider>
          <MainApp />
        </ViewProvider>
      </OfflineProvider>
    </AuthProvider>
  );
}
