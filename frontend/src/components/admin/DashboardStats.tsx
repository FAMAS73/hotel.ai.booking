/**
 * DashboardStats - Admin Dashboard Statistics Display
 */

'use client';

import { useAdminDashboard } from '@/lib/hooks/useAdminDashboard';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency } from '@/lib/utils/format';

export function DashboardStats() {
  const { stats, isLoading } = useAdminDashboard();

  if (isLoading || !stats) {
    return <LoadingSpinner />;
  }

  const statCards = [
    { label: 'Total Bookings', value: stats.total_bookings, color: 'blue' },
    { label: 'Occupancy Rate', value: `${stats.occupancy_rate}%`, color: 'green' },
    { label: 'Total Revenue', value: formatCurrency(stats.total_revenue), color: 'purple' },
    { label: 'Pending', value: stats.pending_bookings, color: 'yellow' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <Card key={stat.label} className="p-6">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</h3>
          <p className="text-3xl font-bold mt-2">{stat.value}</p>
        </Card>
      ))}
    </div>
  );
}
