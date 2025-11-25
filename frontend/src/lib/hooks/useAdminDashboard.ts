/**
 * useAdminDashboard Hook - Admin Dashboard Statistics with Real-time Updates
 */

import useSWR from 'swr';
import { apiClient } from '@/lib/api/client';

interface DashboardStats {
  total_bookings: number;
  occupancy_rate: number;
  total_revenue: number;
  pending_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  return apiClient.get<DashboardStats>('/api/admin/dashboard/stats');
}

export function useAdminDashboard() {
  const { data, error, isLoading, mutate } = useSWR<DashboardStats>(
    '/api/admin/dashboard/stats',
    fetchDashboardStats,
    {
      refreshInterval: 5000, // Real-time updates every 5 seconds (T111)
      revalidateOnFocus: true,
    }
  );

  return {
    stats: data,
    isLoading,
    isError: error,
    mutate,
  };
}
