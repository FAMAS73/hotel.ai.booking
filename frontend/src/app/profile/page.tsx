/**
 * Profile Page - User Profile Management and Booking History
 */

'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { BookingHistory } from '@/components/profile/BookingHistory';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/stores/authStore';
import { logout } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const handleLogout = async () => {
    await logout();
    clearAuth();
    router.push('/');
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <ProfileForm />
          </div>

          <div>
            <BookingHistory />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
