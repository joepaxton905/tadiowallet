'use client'

import { useState, useEffect } from 'react'
import { useUserProfile } from '@/hooks/useUserData'
import { config } from '@/lib/config'

const tabs = [
  { id: 'profile', name: 'Profile', icon: '👤' },
  { id: 'security', name: 'Security', icon: '🔒' },
  { id: 'notifications', name: 'Notifications', icon: '🔔' },
  { id: 'preferences', name: 'Preferences', icon: '⚙️' },
]

export default function SettingsPage() {
  const { profile, loading, updateProfile } = useUserProfile()
  
  const [activeTab, setActiveTab] = useState('profile')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [priceAlerts, setPriceAlerts] = useState(true)
  const [transactionAlerts, setTransactionAlerts] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [currency, setCurrency] = useState('USD')
  const [language, setLanguage] = useState('en')
  
  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || '')
      setLastName(profile.lastName || '')
      setEmail(profile.email || '')
      setTwoFactorEnabled(profile.twoFactorEnabled || false)
      setEmailNotifications(profile.preferences?.notifications?.email ?? true)
      setPriceAlerts(profile.preferences?.notifications?.priceAlerts ?? true)
      setTransactionAlerts(profile.preferences?.notifications?.transactionAlerts ?? true)
      setMarketingEmails(profile.preferences?.notifications?.marketing ?? false)
      setCurrency(profile.preferences?.currency || 'USD')
      setLanguage(profile.preferences?.language || 'en')
    }
  }, [profile])
  
  const handleSaveProfile = async () => {
    try {
      await updateProfile({ firstName, lastName })
      alert('Profile updated successfully!')
    } catch (error) {
      alert('Failed to update profile: ' + error.message)
    }
  }
  
  const handleSavePreferences = async () => {
    try {
      await updateProfile({
        preferences: {
          currency,
          language,
          notifications: {
            email: emailNotifications,
            priceAlerts,
            transactionAlerts,
            marketing: marketingEmails,
          },
        },
      })
      alert('Preferences updated successfully!')
    } catch (error) {
      alert('Failed to update preferences: ' + error.message)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header - Hidden on mobile */}
      <div className="hidden lg:block">
        <h1 className="text-2xl font-heading font-bold text-white">Settings</h1>
        <p className="text-dark-400">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="glass-card p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-500/20 text-white'
                    : 'text-dark-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="glass-card p-6 space-y-6">
              <h2 className="text-xl font-semibold text-white">Profile Information</h2>
              
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-2xl font-bold text-white">
                  {profile ? `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}` : 'JD'}
                </div>
                <div>
                  <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
                    Change Avatar
                  </button>
                  <p className="text-dark-400 text-sm mt-2">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-dark-400 mb-2">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-white/5 rounded-xl text-white focus:outline-none focus:border-primary-500/50"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm text-dark-400 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-white/5 rounded-xl text-white focus:outline-none focus:border-primary-500/50"
                    disabled={loading}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-dark-400 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-3 bg-dark-800/50 border border-white/5 rounded-xl text-dark-500 focus:outline-none cursor-not-allowed"
                  />
                  <p className="text-xs text-dark-500 mt-1">Email cannot be changed</p>
                </div>
              </div>

              {/* Verification Status */}
              <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-white">Identity Verified</p>
                    <p className="text-sm text-dark-400">Your account is fully verified</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full">
                  Verified
                </span>
              </div>

              <button 
                onClick={handleSaveProfile}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-dark-950 font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="glass-card p-6 space-y-6">
                <h2 className="text-xl font-semibold text-white">Security Settings</h2>

                {/* Password */}
                <div className="flex items-center justify-between p-4 bg-dark-800/30 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">Password</p>
                      <p className="text-sm text-dark-400">Last changed 30 days ago</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors">
                    Change
                  </button>
                </div>

                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between p-4 bg-dark-800/30 rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">Two-Factor Authentication</p>
                      <p className="text-sm text-dark-400">Extra security for your account</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      twoFactorEnabled ? 'bg-primary-500' : 'bg-dark-600'
                    }`}
                  >
                    <span
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        twoFactorEnabled ? 'translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Active Sessions */}
                <div className="space-y-4">
                  <h3 className="font-medium text-white">Active Sessions</h3>
                  <div className="space-y-3">
                    {[
                      { device: 'Chrome on Windows', location: 'New York, US', current: true },
                      { device: 'Safari on iPhone', location: 'New York, US', current: false },
                    ].map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-dark-800/30 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                            <svg className="w-5 h-5 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-white">{session.device}</p>
                            <p className="text-sm text-dark-400">{session.location}</p>
                          </div>
                        </div>
                        {session.current ? (
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                            Current
                          </span>
                        ) : (
                          <button className="text-red-400 text-sm hover:text-red-300">
                            Revoke
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="glass-card p-6 space-y-6">
              <h2 className="text-xl font-semibold text-white">Notification Preferences</h2>

              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive important updates via email', value: emailNotifications, setter: setEmailNotifications },
                  { key: 'priceAlerts', label: 'Price Alerts', desc: 'Get notified when prices change significantly', value: priceAlerts, setter: setPriceAlerts },
                  { key: 'transactionAlerts', label: 'Transaction Alerts', desc: 'Notifications for deposits, withdrawals, and trades', value: transactionAlerts, setter: setTransactionAlerts },
                  { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Receive news and promotional content', value: marketingEmails, setter: setMarketingEmails },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-dark-800/30 rounded-xl">
                    <div>
                      <p className="font-medium text-white">{item.label}</p>
                      <p className="text-sm text-dark-400">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => item.setter(!item.value)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        item.value ? 'bg-primary-500' : 'bg-dark-600'
                      }`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                          item.value ? 'translate-x-6' : ''
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="glass-card p-6 space-y-6">
              <h2 className="text-xl font-semibold text-white">App Preferences</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-dark-400 mb-2">Display Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-white/5 rounded-xl text-white focus:outline-none focus:border-primary-500/50"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="JPY">JPY - Japanese Yen</option>
                    <option value="CAD">CAD - Canadian Dollar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-dark-400 mb-2">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-4 py-3 bg-dark-800/50 border border-white/5 rounded-xl text-white focus:outline-none focus:border-primary-500/50"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="ja">日本語</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-dark-400 mb-2">Time Zone</label>
                  <select className="w-full px-4 py-3 bg-dark-800/50 border border-white/5 rounded-xl text-white focus:outline-none focus:border-primary-500/50">
                    <option>UTC-5 (Eastern Time)</option>
                    <option>UTC-8 (Pacific Time)</option>
                    <option>UTC+0 (London)</option>
                    <option>UTC+1 (Paris)</option>
                    <option>UTC+9 (Tokyo)</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={handleSavePreferences}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-dark-950 font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="glass-card p-6 border-red-500/20">
        <h2 className="text-xl font-semibold text-red-400 mb-4">Danger Zone</h2>
        <p className="text-dark-400 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="px-6 py-3 bg-red-500/10 border border-red-500/30 text-red-400 font-semibold rounded-xl hover:bg-red-500/20 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  )
}

