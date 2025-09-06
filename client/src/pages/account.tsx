import StarField from "@/components/StarField";
import Header from "@/components/Header";
import GlassPanel from "@/components/GlassPanel";
import { useState } from "react";

export default function Account() {
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    theme: 'dark',
    language: 'english'
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen text-foreground overflow-x-hidden" data-testid="account-page">
      <StarField />
      
      <div className="relative z-10">
        <Header />
        
        <main className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <GlassPanel className="p-8 text-center">
                <h1 className="text-4xl font-bold mb-4 text-primary" data-testid="account-title">
                  Account Settings
                </h1>
                <p className="text-muted-foreground text-lg" data-testid="account-description">
                  Manage your profile and preferences
                </p>
              </GlassPanel>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Profile Section */}
              <GlassPanel className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-primary" data-testid="profile-title">
                  Profile Information
                </h2>
                
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <i className="fas fa-user text-black text-3xl"></i>
                    </div>
                    <h3 className="text-xl font-semibold">Guest User</h3>
                    <p className="text-muted-foreground">Free Plan</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input 
                      type="email"
                      placeholder="Enter your email"
                      className="input-glass w-full px-4 py-3 rounded-xl text-foreground"
                      data-testid="email-input"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Display Name</label>
                    <input 
                      type="text"
                      placeholder="Your display name"
                      className="input-glass w-full px-4 py-3 rounded-xl text-foreground"
                      data-testid="name-input"
                    />
                  </div>

                  <button 
                    className="btn-gold w-full py-3 rounded-xl font-semibold"
                    data-testid="save-profile-button"
                  >
                    <i className="fas fa-save mr-2"></i>Save Profile
                  </button>
                </div>
              </GlassPanel>

              {/* Settings Section */}
              <GlassPanel className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-primary" data-testid="settings-title">
                  Preferences
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">Receive updates about your generations</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('notifications', !settings.notifications)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.notifications ? 'bg-primary' : 'bg-muted'
                      }`}
                      data-testid="notifications-toggle"
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Auto-save Content</h3>
                      <p className="text-sm text-muted-foreground">Automatically save generated content</p>
                    </div>
                    <button
                      onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.autoSave ? 'bg-primary' : 'bg-muted'
                      }`}
                      data-testid="autosave-toggle"
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        settings.autoSave ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Language</label>
                    <select 
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                      className="input-glass w-full px-4 py-3 rounded-xl text-foreground"
                      data-testid="language-select"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Español</option>
                      <option value="french">Français</option>
                      <option value="german">Deutsch</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Theme</label>
                    <select 
                      value={settings.theme}
                      onChange={(e) => handleSettingChange('theme', e.target.value)}
                      className="input-glass w-full px-4 py-3 rounded-xl text-foreground"
                      data-testid="theme-select"
                    >
                      <option value="dark">Dark</option>
                      <option value="light">Light</option>
                      <option value="auto">Auto</option>
                    </select>
                  </div>
                </div>
              </GlassPanel>
            </div>

            {/* Usage Stats */}
            <GlassPanel className="p-8 mt-8">
              <h2 className="text-2xl font-bold mb-6 text-primary" data-testid="usage-title">
                Usage Statistics
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">47</div>
                  <p className="text-muted-foreground">Total Generations</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">12</div>
                  <p className="text-muted-foreground">This Month</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">∞</div>
                  <p className="text-muted-foreground">Remaining</p>
                </div>
              </div>
            </GlassPanel>
          </div>
        </main>
      </div>
    </div>
  );
}