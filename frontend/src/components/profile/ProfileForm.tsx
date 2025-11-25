/**
 * ProfileForm Component - User Profile Management
 */

'use client';

import { useState } from 'react';
import { updateProfile } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { GuestProfile } from '@/types';

export function ProfileForm() {
  const { user, setAuth } = useAuthStore();
  const [formData, setFormData] = useState<Partial<GuestProfile>>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const updated = await updateProfile({
        name: formData.name,
        phone: formData.phone,
      });

      setAuth(updated, null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.error || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <Input
          type="email"
          value={formData.email}
          disabled
          className="bg-gray-100 dark:bg-gray-700"
        />
        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Full Name</label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={isLoading}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Phone Number</label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          disabled={isLoading}
        />
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 rounded p-3">
          <p className="text-sm text-green-600">Profile updated successfully!</p>
        </div>
      )}

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
