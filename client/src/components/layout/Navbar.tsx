import React, { useState, useEffect } from 'react';
import {
  Sprout,
  Users,
  Smartphone,
  Monitor,
  Wifi,
  WifiOff,
  Bell,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Globe,
  Sparkles,
  RefreshCw,
  UserPlus,
  Camera,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useOffline } from '../../context/OfflineContext';
import { useView } from '../../context/ViewContext';
import { fetchNotifications } from '../../api';
import { NotificationItem } from '../../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenQRScanner: () => void;
  onOpenRegisterModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenQRScanner,
  onOpenRegisterModal,
}) => {
  const { currentUser, allUsers, switchUser } = useAuth();
  const { isOffline, setIsOffline, pendingQueue, isSyncing, syncPendingItems } = useOffline();
  const { deviceMode, toggleDeviceMode } = useView();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  useEffect(() => {
    fetchNotifications(currentUser?.id)
      .then((data) => {
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread || 0);
      })
      .catch(() => {});
  }, [currentUser]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-900/10 shadow-2xs">
      {/* Top Banner for Active Persona and Quick Controls */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-2">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentTab('home')}
            className="flex items-center gap-2 group text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-all">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-emerald-950 font-sans">
                  Tree<span className="text-emerald-600">Watch</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-bold rounded-md">
                  v1.0
                </span>
              </div>
              <p className="hidden md:block text-[10.5px] text-stone-600 font-medium leading-none mt-0.5">
                Every Tree Counts. Keep It Alive.
              </p>
            </div>
          </button>
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-2">
          {/* Device Frame Toggle (Mobile Preview vs Desktop) */}
          <button
            onClick={toggleDeviceMode}
            title={deviceMode === 'mobile' ? 'Switch to Full Desktop View' : 'Switch to Mobile Phone Preview'}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              deviceMode === 'mobile'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
            }`}
          >
            {deviceMode === 'mobile' ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Phone Mode</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop Mode</span>
              </>
            )}
          </button>

          {/* Rural Offline Mode Toggle */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            title={isOffline ? 'You are offline (queuing local records)' : 'Online: Connected to TreeWatch cloud'}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isOffline
                ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                <span>Offline ({pendingQueue.length})</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Online</span>
              </>
            )}
          </button>

          {/* Sync Button if pending items */}
          {pendingQueue.length > 0 && !isOffline && (
            <button
              onClick={syncPendingItems}
              disabled={isSyncing}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-xl shadow-xs hover:bg-emerald-700 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync ({pendingQueue.length})</span>
            </button>
          )}

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 text-stone-600 hover:text-stone-900 rounded-xl hover:bg-stone-100 transition-all"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-stone-200 p-3 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <span className="text-xs font-bold text-stone-900">Notifications & Reminders</span>
                  <span className="text-[10px] text-stone-500">{unreadCount} unread</span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-stone-100 my-1">
                  {notifications.length === 0 ? (
                    <p className="text-xs text-stone-400 py-3 text-center">No alerts right now.</p>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className="py-2 px-1 text-xs">
                        <p className="font-semibold text-stone-900">{n.title}</p>
                        <p className="text-stone-600 text-[11px] mt-0.5">{n.message}</p>
                        <span className="text-[9px] text-stone-400 mt-1 block">
                          {new Date(n.sentAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Camera Verification Action */}
          <button
            onClick={onOpenQRScanner}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 border border-emerald-300/70 rounded-xl text-xs font-bold shadow-2xs transition-all"
            title="Open camera to photograph, verify, or scan tree QR code"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-700" />
            <span className="hidden sm:inline">Camera Verify</span>
          </button>

          {/* Quick Register User / NGO Button */}
          <button
            onClick={onOpenRegisterModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-2xs hover:shadow-xs transition-all"
            title="Register as a new Individual Planter or onboard an NGO / School / CSR Org"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">+ Register</span>
          </button>

          {/* Role Switcher Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 bg-stone-100 hover:bg-stone-200 rounded-2xl border border-stone-200/80 transition-all"
            >
              <img
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                alt={currentUser?.name}
                className="w-7 h-7 rounded-full object-cover border border-emerald-600"
              />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-stone-900 leading-tight">
                  {currentUser?.name}
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold leading-none">
                  {currentUser?.roleTitle}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-500" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-fadeIn">
                <div className="px-3 py-1.5 border-b border-stone-100 text-stone-700">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                    Switch Test Persona & Role
                  </p>
                  <p className="text-[10px] text-stone-500">
                    Experience app from any user perspective
                  </p>
                </div>
                <div className="max-h-72 overflow-y-auto py-1 space-y-1">
                  {allUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchUser(user);
                        setShowUserMenu(false);
                      }}
                      className={`w-full text-left p-2 rounded-xl flex items-center gap-2.5 transition-all ${
                        currentUser?.id === user.id
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-semibold'
                          : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold truncate">{user.name}</div>
                        <div className="text-[10.5px] text-stone-500 truncate">{user.roleTitle}</div>
                      </div>
                      {currentUser?.id === user.id && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Main Navigation Tabs */}
      <div className="hidden md:block max-w-7xl mx-auto px-6 border-t border-stone-100">
        <nav className="flex items-center space-x-1 py-1 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setCurrentTab('home')}
            className={`px-3 py-2 rounded-xl transition-all ${
              currentTab === 'home'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            🏠 Home Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('trees')}
            className={`px-3 py-2 rounded-xl transition-all ${
              currentTab === 'trees'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            🌳 Tree Directory
          </button>
          <button
            onClick={() => setCurrentTab('map')}
            className={`px-3 py-2 rounded-xl transition-all ${
              currentTab === 'map'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            🗺️ Interactive Map
          </button>
          <button
            onClick={() => setCurrentTab('projects')}
            className={`px-3 py-2 rounded-xl transition-all ${
              currentTab === 'projects'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            📁 Projects
          </button>
          <button
            onClick={() => setCurrentTab('csr')}
            className={`px-3 py-2 rounded-xl transition-all ${
              currentTab === 'csr'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            🏢 CSR Impact Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('ngo')}
            className={`px-3 py-2 rounded-xl transition-all ${
              currentTab === 'ngo'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            🤝 NGO Hub & Bulk Import
          </button>
          <button
            onClick={() => setCurrentTab('school')}
            className={`px-3 py-2 rounded-xl transition-all ${
              currentTab === 'school'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            🏫 School Green Campus
          </button>
          <button
            onClick={() => setCurrentTab('review')}
            className={`px-3 py-2 rounded-xl transition-all ${
              currentTab === 'review'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            🔍 Review Queue
          </button>
          <button
            onClick={() => setCurrentTab('analytics')}
            className={`px-3 py-2 rounded-xl transition-all ${
              currentTab === 'analytics'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            📈 Survival Metrics
          </button>
          <button
            onClick={() => setCurrentTab('public')}
            className={`px-3 py-2 rounded-xl transition-all ${
              currentTab === 'public'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            🌐 Public Transparency
          </button>
          <button
            onClick={() => setCurrentTab('reports')}
            className={`px-3 py-2 rounded-xl transition-all ${
              currentTab === 'reports'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            📄 Reports
          </button>
        </nav>
      </div>
    </header>
  );
};
