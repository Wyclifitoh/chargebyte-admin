'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/components/providers/auth-provider';
import { 
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Mail,
  Smartphone,
  Save,
  RefreshCw
} from 'lucide-react';

export default function SettingsPage() {
  const { user, hasPermission } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Profile settings
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    timezone: 'UTC-5',
    language: 'en'
  });

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    maintenanceAlerts: true,
    revenueReports: true,
    lowBatteryAlerts: true,
    systemUpdates: false
  });

  // System settings (admin only)
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    autoBackup: true,
    dataRetention: '90',
    maxRentalTime: '24',
    depositAmount: '25.00',
    baseRentalRate: '2.50',
    overtimeRate: '5.00'
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: '30',
    passwordExpiry: '90',
    loginAttempts: '5'
  });

  const handleSaveProfile = async () => {
    setLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Saving profile:', profileData);
    setLoading(false);
  };

  const handleSaveNotifications = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Saving notifications:', notifications);
    setLoading(false);
  };

  const handleSaveSystem = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Saving system settings:', systemSettings);
    setLoading(false);
  };

  const handleSaveSecurity = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Saving security settings:', securitySettings);
    setLoading(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and system preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Settings Menu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Shield className="mr-2 h-4 w-4" />
                Security
              </Button>
              {hasPermission(['super_admin', 'staff']) && (
                <>
                  <Button variant="ghost" className="w-full justify-start">
                    <Database className="mr-2 h-4 w-4" />
                    System
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Palette className="mr-2 h-4 w-4" />
                    Appearance
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profileData.timezone} onValueChange={(value) => setProfileData({ ...profileData, timezone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-7">Mountain Time (UTC-7)</SelectItem>
                      <SelectItem value="UTC-6">Central Time (UTC-6)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={loading} className="bg-primary-500 hover:bg-primary-600">
                  {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="mr-2 h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about important events
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, smsNotifications: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-600">Receive browser push notifications</p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Maintenance Alerts</Label>
                    <p className="text-sm text-gray-600">Get notified about station maintenance</p>
                  </div>
                  <Switch
                    checked={notifications.maintenanceAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, maintenanceAlerts: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Revenue Reports</Label>
                    <p className="text-sm text-gray-600">Receive daily/weekly revenue reports</p>
                  </div>
                  <Switch
                    checked={notifications.revenueReports}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, revenueReports: checked })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Low Battery Alerts</Label>
                    <p className="text-sm text-gray-600">Get notified when powerbanks need charging</p>
                  </div>
                  <Switch
                    checked={notifications.lowBatteryAlerts}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, lowBatteryAlerts: checked })}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications} disabled={loading} className="bg-primary-500 hover:bg-primary-600">
                  {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Notifications
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorAuth}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                  />
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                    <Input
                      id="loginAttempts"
                      value={securitySettings.loginAttempts}
                      onChange={(e) => setSecuritySettings({ ...securitySettings, loginAttempts: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveSecurity} disabled={loading} className="bg-primary-500 hover:bg-primary-600">
                  {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Security
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Settings (Admin Only) */}
          {hasPermission(['super_admin', 'staff']) && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="mr-2 h-5 w-5" />
                  System Settings
                </CardTitle>
                <CardDescription>
                  Configure system-wide settings and operational parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-gray-600">Enable system-wide maintenance mode</p>
                    </div>
                    <Switch
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, maintenanceMode: checked })}
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Automatic Backup</Label>
                      <p className="text-sm text-gray-600">Enable daily automatic backups</p>
                    </div>
                    <Switch
                      checked={systemSettings.autoBackup}
                      onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, autoBackup: checked })}
                    />
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dataRetention">Data Retention (days)</Label>
                      <Input
                        id="dataRetention"
                        value={systemSettings.dataRetention}
                        onChange={(e) => setSystemSettings({ ...systemSettings, dataRetention: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxRentalTime">Max Rental Time (hours)</Label>
                      <Input
                        id="maxRentalTime"
                        value={systemSettings.maxRentalTime}
                        onChange={(e) => setSystemSettings({ ...systemSettings, maxRentalTime: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="depositAmount">Deposit Amount ($)</Label>
                      <Input
                        id="depositAmount"
                        value={systemSettings.depositAmount}
                        onChange={(e) => setSystemSettings({ ...systemSettings, depositAmount: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="baseRentalRate">Base Rental Rate ($/hour)</Label>
                      <Input
                        id="baseRentalRate"
                        value={systemSettings.baseRentalRate}
                        onChange={(e) => setSystemSettings({ ...systemSettings, baseRentalRate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleSaveSystem} disabled={loading} className="bg-primary-500 hover:bg-primary-600">
                    {loading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save System Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}