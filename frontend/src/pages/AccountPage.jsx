import React, { useState, useEffect } from 'react';
import { User, Mail, MapPin, Save, ShieldCheck, Check } from 'lucide-react';
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
          country: data.country || 'United States',
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
    return <LoadingSpinner text="Retrieving account profile..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-sand-200 pb-6">
        <h1 className="font-serif text-3xl font-bold text-brand-950">
          Account Settings
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal details and primary shipping destination
        </p>
      </div>

      {success && <Alert type="success" message="Profile information successfully saved" />}
      {error && <Alert type="error" message={error} />}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Profile Card */}
        <div className="md:col-span-4 bg-white rounded-3xl border border-sand-200 p-6 space-y-4 text-center shadow-xs">
          <div className="w-20 h-20 mx-auto rounded-full bg-brand-950 text-white flex items-center justify-center font-bold text-2xl uppercase">
            {profile?.fullName ? profile.fullName[0] : 'U'}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{profile?.fullName}</h3>
            <p className="text-xs text-slate-500">{profile?.email}</p>
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-900 border border-brand-200">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
              Role: {profile?.role}
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-8 bg-white rounded-3xl border border-sand-200 p-6 sm:p-8 shadow-xs">
          <form onSubmit={handleSave} className="space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-sand-200 pb-3">
              Shipping & Personal Information
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-sand-50/40"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email Address (Read-only)</label>
              <input
                type="email"
                disabled
                value={profile?.email || ''}
                className="w-full px-4 py-2.5 rounded-xl border border-sand-200 text-sm bg-sand-100/50 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Street Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="100 Grand Avenue"
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-sand-50/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="San Francisco"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-sand-50/40"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  placeholder="94105"
                  className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-sand-50/40"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="United States"
                className="w-full px-4 py-2.5 rounded-xl border border-sand-300 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-sand-50/40"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-brand-950 text-white font-bold text-xs hover:bg-brand-900 transition-colors shadow-md disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>

      </div>

    </div>
  );
};

export default AccountPage;
