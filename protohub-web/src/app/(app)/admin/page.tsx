'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Users, FolderKanban, ShieldAlert, Activity } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res: any = await api.get('/users?limit=50');
        setUsers(res.data || []);
      } catch (err) {
        console.error('Failed to fetch admin data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink tracking-tight">Admin Dashboard</h1>
        <p className="text-ink-muted mt-1">System overview and moderation tools.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
            <Users size={20} />
          </div>
          <div>
            <p className="text-xs text-ink-muted font-medium uppercase">Total Users</p>
            <p className="text-2xl font-bold text-ink">{users.length}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
            <FolderKanban size={20} />
          </div>
          <div>
            <p className="text-xs text-ink-muted font-medium uppercase">Projects</p>
            <p className="text-2xl font-bold text-ink">---</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
            <ShieldAlert size={20} />
          </div>
          <div>
            <p className="text-xs text-ink-muted font-medium uppercase">Reports</p>
            <p className="text-2xl font-bold text-ink">0</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
            <Activity size={20} />
          </div>
          <div>
            <p className="text-xs text-ink-muted font-medium uppercase">System Status</p>
            <p className="text-2xl font-bold text-ink">Healthy</p>
          </div>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-border bg-surface">
          <h2 className="text-sm font-semibold text-ink">Recent Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-hover text-ink-muted text-xs uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-surface">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ink-muted">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-surface-hover transition-colors">
                    <td className="px-4 py-3 font-medium text-ink">{user.name}</td>
                    <td className="px-4 py-3 text-ink-muted">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-surface-raised text-ink">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      {format(new Date(user.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${user.isActive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
