import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Save, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { Alert } from '../components/common/Alert';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AccountPage = () => {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await authApi.getProfile();
        setProfile(data);
        setFormData({
          fullName: data.fullName || '',
          address: data.address || '',
          city: data.city || '',
          postalCode: data.postalCode || '',
          country: data.country || 'France',
        });
      } catch (err) {
        setError('Failed to load profile details');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updated = await authApi.updateProfile(formData);
      setProfile(updated);
      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving Maison Vendôme patron dossier..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-sans">
      
      {/* Header */}
      <div className="border-b border-amber-900/10 pb-6">
        <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-amber-800 block">
          Patron Profile
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal text-slate-950 mt-1">
          Vos Paramètres & Privilèges
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal details, default white-glove consignment address, and VIP patron credentials.
        </p>
      </div>

      {success && <Alert type="success" message="Patron dossier successfully updated." />}
      {error && <Alert type="error" message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* VIP Patron Badge Card */}
        <div className="bg-slate-950 text-white rounded-3xl p-6 border border-amber-500/20 shadow-xl space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-900 border border-amber-500/30 text-amber-300 flex items-center justify-center font-serif text-xl font-bold shadow-inner">
            {profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : 'P'}
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-semibold uppercase tracking-wider border border-amber-400/30">
              <Sparkles className="w-3 h-3" /> VIP Patron
            </div>
            <h3 className="font-serif text-xl font-medium text-amber-100 mt-2">{profile?.fullName || 'Valued Guest'}</h3>
            <p className="text-xs text-slate-400 font-mono">{profile?.email}</p>
          </div>
          <div className="pt-4 border-t border-slate-800/80 text-xs text-slate-400 space-y-2">
            <div className="flex justify-between">
              <span>Member Since</span>
              <span className="text-slate-200">2026</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Tier</span>
              <span className="text-amber-300">White-Glove</span>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-amber-900/10 p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="font-serif text-xl font-normal text-slate-950 border-b border-amber-900/10 pb-3">
            Consignment Address & Identity
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-700 mb-1">
                White-Glove Street Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. 12 Place Vendôme"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-slate-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Paris"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-slate-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="75001"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-slate-700 mb-1">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-full bg-slate-950 text-amber-200 text-xs uppercase tracking-widest font-semibold hover:bg-slate-800 transition-colors shadow-md flex items-center gap-2"
              >
                {saving ? (
                  <span>Saving Changes...</span>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Patron Dossier</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};

export default AccountPage;
