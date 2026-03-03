import React, { useEffect, useState } from 'react';
import { userService } from '@/services/api';
import { User } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SearchFilter } from '@/components/SearchFilter';
import { ViewDetailsModal } from '@/components/modals';
import { formatDate } from '@/utils/dateTime';

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal state
  const [viewModal, setViewModal] = useState<{
    open: boolean;
    user: User | null;
  }>({ open: false, user: null });

  useEffect(() => {
    userService.getAll().then(setUsers);
  }, []);

  useEffect(() => {
    let filtered = [...users];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery, roleFilter, statusFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setRoleFilter('all');
    setStatusFilter('all');
  };

  const activeFiltersCount = 
    (roleFilter !== 'all' ? 1 : 0) + 
    (statusFilter !== 'all' ? 1 : 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif font-semibold">Users</h1>
      
      {/* Search and Filter */}
      <SearchFilter
        searchPlaceholder="Search by name or email..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          {
            name: 'role',
            label: 'Role',
            options: [
              { value: 'client', label: 'Client' },
              { value: 'admin', label: 'Admin' },
              { value: 'staff', label: 'Staff' },
            ],
            value: roleFilter,
            onChange: setRoleFilter,
          },
          {
            name: 'status',
            label: 'Status',
            options: [
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          },
        ]}
        onClearFilters={clearFilters}
        activeFiltersCount={activeFiltersCount}
      />

      <div className="card-luxury overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatarUrl} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3"><Badge variant="secondary">{user.role}</Badge></td>
                  <td className="px-4 py-3"><Badge variant={user.status === 'active' ? 'confirmed' : 'cancelled'}>{user.status}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setViewModal({ open: true, user })}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {viewModal.user && (
        <ViewDetailsModal
          open={viewModal.open}
          onOpenChange={(open) => setViewModal({ open, user: open ? viewModal.user : null })}
          title="User Details"
          data={[
            { label: 'Name', value: viewModal.user.name },
            { label: 'Email', value: viewModal.user.email },
            { label: 'Role', value: viewModal.user.role },
            { label: 'Status', value: viewModal.user.status },
            { label: 'Phone', value: viewModal.user.phone || 'Not provided' },
            { label: 'Member Since', value: formatDate(viewModal.user.createdAt) },
          ]}
        />
      )}
    </div>
  );
};

export default Users;
