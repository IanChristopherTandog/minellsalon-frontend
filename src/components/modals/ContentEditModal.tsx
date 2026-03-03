import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface ServiceData {
  id?: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: string;
  isActive: boolean;
}

interface ContentEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  type: 'service' | 'promo';
  initialData?: Partial<ServiceData>;
  onSave: (data: ServiceData) => void;
}

export const ContentEditModal: React.FC<ContentEditModalProps> = ({
  open,
  onOpenChange,
  mode,
  type,
  initialData,
  onSave,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ServiceData>({
    name: '',
    description: '',
    price: 0,
    durationMinutes: 30,
    category: 'Hair',
    isActive: true,
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: '',
        description: '',
        price: 0,
        durationMinutes: 30,
        category: 'Hair',
        isActive: true,
        ...initialData,
      });
    }
  }, [initialData, open]);

  const handleChange = (field: keyof ServiceData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    toast({
      title: mode === 'create' ? `${type === 'service' ? 'Service' : 'Promotion'} Created` : 'Changes Saved',
      description: `The ${type} has been ${mode === 'create' ? 'created' : 'updated'} successfully.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Add New' : 'Edit'} {type === 'service' ? 'Service' : 'Promotion'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? `Create a new ${type} to display on your website.`
              : `Update the ${type} details below.`
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
                placeholder={type === 'service' ? 'e.g., Classic Manicure' : 'e.g., Summer Special'}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e => handleChange('description', e.target.value)}
                placeholder="Describe the service..."
                rows={3}
              />
            </div>

            {type === 'service' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={e => handleChange('price', parseFloat(e.target.value))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (mins)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="5"
                      step="5"
                      value={formData.durationMinutes}
                      onChange={e => handleChange('durationMinutes', parseInt(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={value => handleChange('category', value)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hair">Hair</SelectItem>
                      <SelectItem value="Nail">Nail</SelectItem>
                      <SelectItem value="Lashes">Lashes</SelectItem>
                      <SelectItem value="Makeup">Makeup</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active Status</Label>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={checked => handleChange('isActive', checked)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === 'create' ? 'Create' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
