import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockServices, mockPromos, mockSiteContent, mockNavigationItems } from '@/data/mockData';
import { formatPrice, formatDuration } from '@/utils/dateTime';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SearchFilter } from '@/components/SearchFilter';
import { ContentEditModal } from '@/components/modals/ContentEditModal';
import { Plus, Pencil, Save, GripVertical, Eye, EyeOff } from 'lucide-react';
import { Service, SiteContent, NavigationItem } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Content = () => {
  const { toast } = useToast();
  const [services, setServices] = useState(mockServices);
  const [promos, setPromos] = useState(mockPromos);
  const [siteContent, setSiteContent] = useState<SiteContent[]>(mockSiteContent);
  const [navItems, setNavItems] = useState<NavigationItem[]>([...mockNavigationItems].sort((a, b) => a.order - b.order));
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const [hasChanges, setHasChanges] = useState(false);

  // Search and filter state
  const [serviceSearch, setServiceSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [promoSearch, setPromoSearch] = useState('');
  const [contentSection, setContentSection] = useState<'all' | 'general' | 'contact' | 'footer' | 'about'>('all');

  // Modal state
  const [editModal, setEditModal] = useState<{
    open: boolean;
    mode: 'create' | 'edit';
    type: 'service' | 'promo';
    data?: Partial<Service>;
  }>({ open: false, mode: 'create', type: 'service' });

  // Filter services
  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
      s.description?.toLowerCase().includes(serviceSearch.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filter promos
  const filteredPromos = promos.filter(p =>
    p.title.toLowerCase().includes(promoSearch.toLowerCase()) ||
    p.details.toLowerCase().includes(promoSearch.toLowerCase())
  );

  // Filter site content
  const filteredContent = contentSection === 'all' 
    ? siteContent 
    : siteContent.filter(c => c.section === contentSection);

  const handleSaveService = (data: any) => {
    if (editModal.mode === 'create') {
      const newService: Service = {
        id: `service-${Date.now()}`,
        ...data,
      };
      setServices(prev => [...prev, newService]);
    } else {
      setServices(prev => prev.map(s => 
        s.id === data.id ? { ...s, ...data } : s
      ));
    }
  };

  const handleContentChange = (id: string, value: string) => {
    setEditedContent(prev => ({ ...prev, [id]: value }));
    setHasChanges(true);
  };

  const handleSaveContent = () => {
    setSiteContent(prev => prev.map(c => {
      if (editedContent[c.id] !== undefined) {
        return { ...c, value: editedContent[c.id], updatedAt: new Date().toISOString() };
      }
      return c;
    }));
    setEditedContent({});
    setHasChanges(false);
    toast({ title: 'Content saved', description: 'Your changes have been saved successfully.' });
  };

  const handleNavToggle = (id: string) => {
    setNavItems(prev => prev.map(item => 
      item.id === id ? { ...item, isVisible: !item.isVisible } : item
    ));
    setHasChanges(true);
  };

  const handleNavLabelChange = (id: string, label: string) => {
    setNavItems(prev => prev.map(item => 
      item.id === id ? { ...item, label } : item
    ));
    setHasChanges(true);
  };

  const getContentValue = (content: SiteContent) => {
    return editedContent[content.id] !== undefined ? editedContent[content.id] : content.value;
  };

  const groupedContent = filteredContent.reduce((acc, content) => {
    if (!acc[content.section]) {
      acc[content.section] = [];
    }
    acc[content.section].push(content);
    return acc;
  }, {} as Record<string, SiteContent[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-semibold">Content Management</h1>
        {hasChanges && (
          <Button onClick={handleSaveContent}>
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="services">
        <TabsList className="grid grid-cols-4 w-full max-w-lg">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="promos">Promos</TabsTrigger>
          <TabsTrigger value="website">Website</TabsTrigger>
          <TabsTrigger value="navigation">Navigation</TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services" className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <SearchFilter
              searchPlaceholder="Search services..."
              searchValue={serviceSearch}
              onSearchChange={setServiceSearch}
              filters={[
                {
                  name: 'category',
                  label: 'Category',
                  options: [
                    { value: 'Hair', label: 'Hair' },
                    { value: 'Nail', label: 'Nail' },
                    { value: 'Lashes', label: 'Lashes' },
                  ],
                  value: categoryFilter,
                  onChange: setCategoryFilter,
                },
              ]}
              onClearFilters={() => {
                setServiceSearch('');
                setCategoryFilter('all');
              }}
              activeFiltersCount={categoryFilter !== 'all' ? 1 : 0}
            />
            <Button onClick={() => setEditModal({ open: true, mode: 'create', type: 'service' })}>
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>

          <div className="card-luxury overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Service</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Duration</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredServices.map(s => (
                  <tr key={s.id}>
                    <td className="px-4 py-3">{s.name}</td>
                    <td className="px-4 py-3">{s.category}</td>
                    <td className="px-4 py-3">{formatPrice(s.price)}</td>
                    <td className="px-4 py-3">{formatDuration(s.durationMinutes)}</td>
                    <td className="px-4 py-3"><Badge variant={s.isActive ? 'confirmed' : 'cancelled'}>{s.isActive ? 'Active' : 'Inactive'}</Badge></td>
                    <td className="px-4 py-3 text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditModal({ 
                          open: true, 
                          mode: 'edit', 
                          type: 'service', 
                          data: s 
                        })}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* Promotions Tab */}
        <TabsContent value="promos" className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <SearchFilter
              searchPlaceholder="Search promotions..."
              searchValue={promoSearch}
              onSearchChange={setPromoSearch}
              filters={[]}
              onClearFilters={() => setPromoSearch('')}
              activeFiltersCount={0}
            />
            <Button onClick={() => setEditModal({ open: true, mode: 'create', type: 'promo' })}>
              <Plus className="h-4 w-4 mr-2" />
              Add Promotion
            </Button>
          </div>

          <div className="grid gap-4">
            {filteredPromos.map(p => (
              <div key={p.id} className="card-luxury p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.details}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={p.isActive ? 'confirmed' : 'cancelled'}>{p.isActive ? 'Active' : 'Inactive'}</Badge>
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Website Content Tab */}
        <TabsContent value="website" className="mt-6 space-y-6">
          <div className="flex gap-2 flex-wrap">
            {(['all', 'general', 'contact', 'footer', 'about'] as const).map(section => (
              <Button 
                key={section}
                variant={contentSection === section ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setContentSection(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </Button>
            ))}
          </div>

          {Object.entries(groupedContent).map(([section, items]) => (
            <div key={section} className="card-luxury p-6">
              <h3 className="text-lg font-semibold mb-4 capitalize">{section} Settings</h3>
              <div className="space-y-4">
                {items.map(content => (
                  <div key={content.id} className="space-y-2">
                    <Label htmlFor={content.id}>{content.label}</Label>
                    {content.type === 'textarea' ? (
                      <Textarea
                        id={content.id}
                        value={getContentValue(content)}
                        onChange={(e) => handleContentChange(content.id, e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <Input
                        id={content.id}
                        value={getContentValue(content)}
                        onChange={(e) => handleContentChange(content.id, e.target.value)}
                      />
                    )}
                    <p className="text-xs text-muted-foreground">Key: {content.key}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {/* Navigation Tab */}
        <TabsContent value="navigation" className="mt-6 space-y-4">
          <div className="card-luxury p-6">
            <h3 className="text-lg font-semibold mb-4">Menu Items</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Configure the navigation menu items that appear in the header and footer.
            </p>
            <div className="space-y-3">
              {navItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border border-border",
                    !item.isVisible && "opacity-50"
                  )}
                >
                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <Input
                      value={item.label}
                      onChange={(e) => handleNavLabelChange(item.id, e.target.value)}
                      placeholder="Label"
                    />
                    <Input
                      value={item.href}
                      disabled
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={item.isVisible}
                      onCheckedChange={() => handleNavToggle(item.id)}
                    />
                    {item.isVisible ? (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit/Create Modal */}
      <ContentEditModal
        open={editModal.open}
        onOpenChange={(open) => setEditModal({ ...editModal, open })}
        mode={editModal.mode}
        type={editModal.type}
        initialData={editModal.data}
        onSave={handleSaveService}
      />
    </div>
  );
};

export default Content;
