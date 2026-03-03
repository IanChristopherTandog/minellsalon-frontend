import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Gift, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { loyaltyService } from '@/services/api';
import { LoyaltyReward } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ConfirmationModal } from '@/components/modals';

const LoyaltyManagement = () => {
  const { toast } = useToast();
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pointsCost: 100,
    discountType: 'fixed' as 'fixed' | 'percentage',
    discountValue: 10,
    expiryDays: 30,
    isActive: true,
  });

  useEffect(() => {
    loadRewards();
  }, []);

  const loadRewards = async () => {
    try {
      const data = await loyaltyService.getAllRewards();
      setRewards(data);
    } catch (error) {
      console.error('Failed to load rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (reward?: LoyaltyReward) => {
    if (reward) {
      setSelectedReward(reward);
      setFormData({
        name: reward.name,
        description: reward.description,
        pointsCost: reward.pointsCost,
        discountType: reward.discountType,
        discountValue: reward.discountValue,
        expiryDays: reward.expiryDays || 30,
        isActive: reward.isActive,
      });
    } else {
      setSelectedReward(null);
      setFormData({
        name: '',
        description: '',
        pointsCost: 100,
        discountType: 'fixed',
        discountValue: 10,
        expiryDays: 30,
        isActive: true,
      });
    }
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (selectedReward) {
        await loyaltyService.updateReward(selectedReward.id, formData);
        toast({ title: 'Reward updated successfully' });
      } else {
        await loyaltyService.createReward(formData);
        toast({ title: 'Reward created successfully' });
      }
      loadRewards();
      setEditModalOpen(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to save reward', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!selectedReward) return;
    try {
      await loyaltyService.deleteReward(selectedReward.id);
      toast({ title: 'Reward deleted successfully' });
      loadRewards();
      setDeleteModalOpen(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete reward', variant: 'destructive' });
    }
  };

  const handleToggleActive = async (reward: LoyaltyReward) => {
    try {
      await loyaltyService.updateReward(reward.id, { isActive: !reward.isActive });
      loadRewards();
      toast({ title: `Reward ${reward.isActive ? 'deactivated' : 'activated'}` });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update reward', variant: 'destructive' });
    }
  };

  const filteredRewards = rewards.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold">Loyalty Rewards</h1>
          <p className="text-muted-foreground">Manage rewards that customers can redeem with points</p>
        </div>
        <Button onClick={() => handleOpenEdit()}>
          <Plus className="mr-2 h-4 w-4" /> Add Reward
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search rewards..."
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
          {filteredRewards.map(reward => (
            <Card key={reward.id} className={!reward.isActive ? 'opacity-60' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Gift className="h-5 w-5 text-primary" />
                  </div>
                  <Switch
                    checked={reward.isActive}
                    onCheckedChange={() => handleToggleActive(reward)}
                  />
                </div>
                <CardTitle className="text-lg mt-3">{reward.name}</CardTitle>
                <CardDescription>{reward.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-primary font-semibold">
                    <Star className="h-4 w-4 fill-primary" />
                    {reward.pointsCost.toLocaleString()} pts
                  </div>
                  <Badge variant={reward.discountType === 'percentage' ? 'secondary' : 'outline'}>
                    {reward.discountType === 'percentage' 
                      ? `${reward.discountValue}% OFF` 
                      : `$${reward.discountValue} OFF`}
                  </Badge>
                </div>
                {reward.expiryDays && (
                  <p className="text-xs text-muted-foreground">
                    Valid for {reward.expiryDays} days after redemption
                  </p>
                )}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenEdit(reward)}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedReward(reward);
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
            <DialogTitle>{selectedReward ? 'Edit Reward' : 'Create Reward'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., $10 Off Any Service"
              />
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the reward..."
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Points Cost *</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.pointsCost}
                  onChange={e => setFormData({ ...formData, pointsCost: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Expiry (days)</Label>
                <Input
                  type="number"
                  min={1}
                  value={formData.expiryDays}
                  onChange={e => setFormData({ ...formData, expiryDays: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(value: 'fixed' | 'percentage') =>
                    setFormData({ ...formData, discountType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Discount Value</Label>
                <Input
                  type="number"
                  min={1}
                  max={formData.discountType === 'percentage' ? 100 : undefined}
                  value={formData.discountValue}
                  onChange={e => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.name || !formData.description}>
              {selectedReward ? 'Save Changes' : 'Create Reward'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmationModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        title="Delete Reward"
        description={`Are you sure you want to delete "${selectedReward?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default LoyaltyManagement;
