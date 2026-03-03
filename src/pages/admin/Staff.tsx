import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Trash2, Calendar, User as UserIcon, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { staffService, staffAvailabilityService } from '@/services/api';
import { Staff, ServiceCategory, StaffAvailability } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationModal } from '@/components/modals';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SPECIALTIES: ServiceCategory[] = ['Hair', 'Nail', 'Lashes'];

const StaffManagement = () => {
  const { toast } = useToast();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [staffAvailability, setStaffAvailability] = useState<StaffAvailability[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    specialties: [] as ServiceCategory[],
    commissionRate: 40,
    bio: '',
    isActive: true,
  });

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      const data = await staffService.getAll();
      setStaff(data);
    } catch (error) {
      console.error('Failed to load staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (member?: Staff) => {
    if (member) {
      setSelectedStaff(member);
      setFormData({
        name: member.name,
        email: member.email || '',
        phone: member.phone || '',
        specialties: member.specialties,
        commissionRate: member.commissionRate || 40,
        bio: member.bio || '',
        isActive: member.isActive,
      });
    } else {
      setSelectedStaff(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        specialties: [],
        commissionRate: 40,
        bio: '',
        isActive: true,
      });
    }
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (selectedStaff) {
        await staffService.update(selectedStaff.id, formData);
        toast({ title: 'Staff member updated successfully' });
      } else {
        await staffService.create(formData);
        toast({ title: 'Staff member added successfully' });
      }
      loadStaff();
      setEditModalOpen(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save staff member', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!selectedStaff) return;
    try {
      await staffService.delete(selectedStaff.id);
      toast({ title: 'Staff member removed successfully' });
      loadStaff();
      setDeleteModalOpen(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete staff member', variant: 'destructive' });
    }
  };

  const handleToggleActive = async (member: Staff) => {
    try {
      await staffService.toggleActive(member.id);
      loadStaff();
      toast({ title: `${member.name} ${member.isActive ? 'deactivated' : 'activated'}` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update status', variant: 'destructive' });
    }
  };

  const handleOpenAvailability = async (member: Staff) => {
    setSelectedStaff(member);
    try {
      const availability = await staffAvailabilityService.getByStaff(member.id);
      setStaffAvailability(availability);
      setAvailabilityModalOpen(true);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load availability', variant: 'destructive' });
    }
  };

  const handleSpecialtyToggle = (specialty: ServiceCategory) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold">Staff Management</h1>
          <p className="text-muted-foreground">Manage your team members and their schedules</p>
        </div>
        <Button onClick={() => handleOpenEdit()}>
          <Plus className="mr-2 h-4 w-4" /> Add Staff
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search staff..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map(member => (
            <Card key={member.id} className={!member.isActive ? 'opacity-60' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatarUrl} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{member.name}</CardTitle>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {member.specialties.map(s => (
                          <Badge key={s} variant="secondary" className="text-xs">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={member.isActive}
                    onCheckedChange={() => handleToggleActive(member)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {member.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {member.email}
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {member.phone}
                  </div>
                )}
                {member.commissionRate && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Commission:</span>
                    <span className="font-medium">{member.commissionRate}%</span>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenEdit(member)}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleOpenAvailability(member)}>
                    <Calendar className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedStaff(member);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit/Add Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedStaff ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 555-0123"
              />
            </div>
            <div className="space-y-2">
              <Label>Specialties *</Label>
              <div className="flex flex-wrap gap-2">
                {SPECIALTIES.map(specialty => (
                  <label key={specialty} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={formData.specialties.includes(specialty)}
                      onCheckedChange={() => handleSpecialtyToggle(specialty)}
                    />
                    <span>{specialty}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Commission Rate (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={formData.commissionRate}
                onChange={e => setFormData({ ...formData, commissionRate: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                value={formData.bio}
                onChange={e => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief bio or description..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.name || formData.specialties.length === 0}>
              {selectedStaff ? 'Save Changes' : 'Add Staff'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Availability Modal */}
      <Dialog open={availabilityModalOpen} onOpenChange={setAvailabilityModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedStaff?.name}'s Schedule
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {DAYS.map((day, index) => {
              const dayAvail = staffAvailability.find(a => a.dayOfWeek === index);
              return (
                <div key={day} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="font-medium">{day}</span>
                  {dayAvail && dayAvail.isActive ? (
                    <span className="text-sm">
                      {dayAvail.startTime} - {dayAvail.endTime}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Off</span>
                  )}
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button onClick={() => setAvailabilityModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Remove Staff Member"
        description={`Are you sure you want to remove ${selectedStaff?.name}? This action cannot be undone.`}
        confirmText="Remove"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default StaffManagement;
