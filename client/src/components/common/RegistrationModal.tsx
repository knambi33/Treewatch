import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Building2,
  CheckCircle2,
  FolderKanban,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { Organisation, UserRole } from '../../types';
import { registerUser, registerOrganisation } from '../../api';
import { useAuth } from '../../context/AuthContext';

interface RegistrationModalProps {
  organisations: Organisation[];
  onClose: () => void;
  onSuccess: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  organisations,
  onClose,
  onSuccess,
}) => {
  const { switchUser } = useAuth();
  const [mode, setMode] = useState<'individual' | 'organisation'>('individual');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Individual Form State
  const [userName, setUserName] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('planter');
  const [userOrgId, setUserOrgId] = useState('ORG-PRIVATE');
  const [studentClass, setStudentClass] = useState('');

  // Organisation Form State
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState<'NGO' | 'CSR' | 'School' | 'Community'>('NGO');
  const [orgLocation, setOrgLocation] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [orgPhone, setOrgPhone] = useState('');
  const [orgDescription, setOrgDescription] = useState('');

  const handleRegisterIndividual = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await registerUser({
        name: userName,
        mobile: userMobile,
        email: userEmail,
        role: userRole,
        organisationId: userOrgId,
        studentClass: userRole === 'school_student' ? studentClass : undefined,
      });

      if (res.success && res.user) {
        setSuccessMessage(`Welcome to TreeWatch, ${res.user.name}!`);
        switchUser(res.user);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      alert('Registration error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await registerOrganisation({
        name: orgName,
        type: orgType,
        location: orgLocation,
        contactEmail: orgEmail,
        contactPhone: orgPhone,
        description: orgDescription,
      });

      if (res.success && res.organisation) {
        // Also create lead coordinator user for this new org
        const userRes = await registerUser({
          name: `${orgName} Director`,
          mobile: orgPhone || '+91 98000 00000',
          email: orgEmail || 'lead@' + res.organisation.publicSlug + '.org',
          role: orgType === 'CSR' ? 'csr_manager' : orgType === 'School' ? 'school_admin' : 'ngo_lead',
          organisationId: res.organisation.id,
        });

        if (userRes.success && userRes.user) {
          switchUser(userRes.user);
        }

        setSuccessMessage(`Organisation "${res.organisation.name}" registered successfully!`);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      }
    } catch (err: any) {
      alert('Organisation registration error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-stone-200 relative my-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>TreeWatch Onboarding Desk</span>
          </div>
          <h2 className="text-xl font-extrabold text-stone-900 leading-tight">
            Join the TreeWatch Network
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Register as an individual planter or onboard your NGO, School, or CSR programme
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex bg-stone-100 p-1 rounded-2xl gap-1 mb-5">
          <button
            type="button"
            onClick={() => setMode('individual')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              mode === 'individual'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <UserPlus className="w-4 h-4 text-emerald-600" />
            <span>Individual / Planter</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('organisation')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              mode === 'organisation'
                ? 'bg-white text-emerald-950 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-600" />
            <span>NGO / School / CSR Org</span>
          </button>
        </div>

        {successMessage ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">{successMessage}</h3>
            <p className="text-xs text-stone-500">
              Account initialized and verified. Redirecting to your personalized dashboard...
            </p>
          </div>
        ) : mode === 'individual' ? (
          // INDIVIDUAL PLANTER FORM
          <form onSubmit={handleRegisterIndividual} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Malini Sundaram"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98400 12345"
                  value={userMobile}
                  onChange={(e) => setUserMobile(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="planter@gmail.com"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Role Type</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-xl bg-white"
                >
                  <option value="planter">Individual Planter / Caretaker</option>
                  <option value="school_student">School Student Guardian</option>
                  <option value="community_lead">Community RWA Volunteer</option>
                  <option value="ngo_lead">NGO Field Volunteer</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Affiliated Organisation
                </label>
                <select
                  value={userOrgId}
                  onChange={(e) => setUserOrgId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-xl bg-white font-medium"
                >
                  <option value="ORG-PRIVATE">🌿 Private / Individual (Independent Citizen / Landowner)</option>
                  {organisations
                    .filter((org) => org.id !== 'ORG-PRIVATE')
                    .map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name} ({org.type})
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Explanatory badge for Private vs Affiliated */}
            {userOrgId === 'ORG-PRIVATE' ? (
              <div className="p-3 bg-emerald-50/90 border border-emerald-200/90 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-950">
                <span className="text-base leading-none mt-0.5">🏡</span>
                <div className="space-y-0.5">
                  <p className="font-bold text-emerald-900">Private & Individual Planter Mode</p>
                  <p className="text-[11.5px] text-emerald-800 leading-snug">
                    No institutional affiliation required. You can independently geotag, photograph, and monitor your trees on private land, residential property, homesteads, or farms.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-start gap-2.5 text-xs text-stone-700">
                <Building2 className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-bold text-stone-900">
                    Affiliated to {organisations.find((o) => o.id === userOrgId)?.name || 'Organisation'}
                  </p>
                  <p className="text-[11.5px] text-stone-600 leading-snug">
                    Your planting logs and monthly verification audits will be part of this organisation's impact metrics.
                  </p>
                </div>
              </div>
            )}

            {userRole === 'school_student' && (
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">
                  Class / Section (e.g. Class IX-B)
                </label>
                <input
                  type="text"
                  placeholder="Class IX-B"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing Up...</span>
                  </>
                ) : (
                  <span>Create Planter Account</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          // ORGANISATION (NGO / SCHOOL / CSR) FORM
          <form onSubmit={handleRegisterOrg} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Organisation / Entity Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Western Ghats Wildlife & Reforestation Society"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Organisation Type *</label>
                <select
                  value={orgType}
                  onChange={(e) => setOrgType(e.target.value as any)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-xl bg-white font-semibold"
                >
                  <option value="NGO">NGO / Non-Profit Trust</option>
                  <option value="CSR">Corporate / CSR Foundation</option>
                  <option value="School">School / College Campus</option>
                  <option value="Community">Community / Resident Welfare Assoc (RWA)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Location / District *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coimbatore, Tamil Nadu"
                  value={orgLocation}
                  onChange={(e) => setOrgLocation(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Official Email *</label>
                <input
                  type="email"
                  required
                  placeholder="contact@organisation.org"
                  value={orgEmail}
                  onChange={(e) => setOrgEmail(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Phone / Helpline *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 422 2450000"
                  value={orgPhone}
                  onChange={(e) => setOrgPhone(e.target.value)}
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Mission / Plantation Scope
              </label>
              <textarea
                rows={2}
                placeholder="Brief description of your plantation goals, target districts, and native species focus..."
                value={orgDescription}
                onChange={(e) => setOrgDescription(e.target.value)}
                className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
              >
                {submitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Onboarding Org...</span>
                  </>
                ) : (
                  <span>Register Organisation</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
