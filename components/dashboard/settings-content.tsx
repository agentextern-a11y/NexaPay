'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Copy, LogOut, Shield, Bell, Eye, Lock } from 'lucide-react'

interface User {
  id: string
  email?: string
  name?: string
  image?: string
}

export default function SettingsContent({ user }: { user: User }) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await authClient.signOut()
      router.push('/')
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: 'destructive',
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied',
      description: 'User ID copied to clipboard',
    })
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your NEXA Pay account</p>
      </div>

      <div className="space-y-6">
        {/* Account Information */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Account Information
            </CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-400">Email</Label>
                <p className="text-white font-medium mt-2">{user.email || 'No email'}</p>
              </div>
              <div>
                <Label className="text-gray-400">Name</Label>
                <p className="text-white font-medium mt-2">{user.name || 'Not set'}</p>
              </div>
            </div>
            <div>
              <Label className="text-gray-400">User ID</Label>
              <div className="flex items-center gap-2 mt-2">
                <code className="flex-1 bg-gray-800 text-gray-300 px-4 py-2 rounded font-mono text-sm">
                  {user.id}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(user.id)}
                  className="border-gray-700 text-gray-300 hover:text-white"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security
            </CardTitle>
            <CardDescription>Manage your security settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-800 rounded-lg flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-400">Add an extra layer of security</p>
              </div>
              <Button variant="outline" className="border-gray-700 text-gray-300">
                Enable
              </Button>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Biometric Login</h3>
                <p className="text-sm text-gray-400">Use fingerprint or face recognition</p>
              </div>
              <Button variant="outline" className="border-gray-700 text-gray-300">
                Set Up
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
            <CardDescription>Manage notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <h3 className="text-white font-medium">Transaction Alerts</h3>
                <p className="text-sm text-gray-400">Get notified of payments</p>
              </div>
              <input type="checkbox" className="w-5 h-5" defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <h3 className="text-white font-medium">Security Alerts</h3>
                <p className="text-sm text-gray-400">Important account updates</p>
              </div>
              <input type="checkbox" className="w-5 h-5" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Privacy
            </CardTitle>
            <CardDescription>Control your privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <h3 className="text-white font-medium">Public Profile</h3>
                <p className="text-sm text-gray-400">Allow others to see your profile</p>
              </div>
              <input type="checkbox" className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
              <div>
                <h3 className="text-white font-medium">Analytics</h3>
                <p className="text-sm text-gray-400">Help us improve NEXA Pay</p>
              </div>
              <input type="checkbox" className="w-5 h-5" defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card className="bg-red-950 border-red-900">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Logout
            </CardTitle>
            <CardDescription>Sign out of your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
