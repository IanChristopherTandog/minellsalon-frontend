import React, { useState } from 'react';
import { mockMediaFiles } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Upload, Grid, List } from 'lucide-react';
import { UploadModal } from '@/components/modals/UploadModal';
import { MediaViewModal } from '@/components/modals/MediaViewModal';
import { SearchFilter } from '@/components/SearchFilter';
import { useToast } from '@/hooks/use-toast';

const Media = () => {
  const { toast } = useToast();
  const [mediaFiles, setMediaFiles] = useState(mockMediaFiles);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal state
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewModal, setViewModal] = useState<{
    open: boolean;
    media: typeof mockMediaFiles[0] | null;
  }>({ open: false, media: null });

  // Filter media
  const filteredMedia = mediaFiles.filter(media => {
    const matchesSearch = 
      media.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      media.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || media.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleUpload = (files: File[]) => {
    // Simulate upload for each file
    files.forEach(file => {
      const newMedia = {
        id: `media-${Date.now()}-${Math.random()}`,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video') ? 'video' : 'image' as 'image' | 'video',
        caption: file.name,
        category: 'General' as const,
        createdAt: new Date().toISOString(),
      };
      setMediaFiles(prev => [newMedia, ...prev]);
    });
  };

  const handleDelete = (id: string) => {
    setMediaFiles(prev => prev.filter(m => m.id !== id));
    setViewModal({ open: false, media: null });
    toast({
      title: "Media Deleted",
      description: "The media file has been deleted.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-semibold">Media</h1>
        <Button onClick={() => setUploadModalOpen(true)}>
          <Upload className="mr-2 h-4 w-4" /> Upload
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <SearchFilter
          searchPlaceholder="Search media..."
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          filters={[
            {
              name: 'type',
              label: 'Type',
              options: [
                { value: 'image', label: 'Images' },
                { value: 'video', label: 'Videos' },
              ],
              value: typeFilter,
              onChange: setTypeFilter,
            },
          ]}
          onClearFilters={() => {
            setSearchQuery('');
            setTypeFilter('all');
          }}
          activeFiltersCount={typeFilter !== 'all' ? 1 : 0}
        />
        
        <div className="flex gap-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map(media => (
            <div 
              key={media.id} 
              className="aspect-square rounded-xl overflow-hidden group cursor-pointer relative"
              onClick={() => setViewModal({ open: true, media })}
            >
              <img src={media.url} alt={media.caption || ''} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button variant="secondary" size="sm">View</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-luxury overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Preview</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Caption</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Uploaded</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredMedia.map(media => (
                <tr key={media.id}>
                  <td className="px-4 py-3">
                    <img 
                      src={media.url} 
                      alt={media.caption || ''} 
                      className="h-12 w-12 rounded-lg object-cover"
                    />
                  </td>
                  <td className="px-4 py-3">{media.caption || 'No caption'}</td>
                  <td className="px-4 py-3 capitalize">{media.type}</td>
                  <td className="px-4 py-3">{new Date(media.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setViewModal({ open: true, media })}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredMedia.length === 0 && (
        <div className="card-luxury p-8 text-center">
          <p className="text-muted-foreground">No media files found</p>
        </div>
      )}

      {/* Upload Modal */}
      <UploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onUpload={handleUpload}
        accept="image/*,video/*"
        title="Upload Media"
      />

      {/* View Modal */}
      <MediaViewModal
        open={viewModal.open}
        onOpenChange={(open) => setViewModal({ open, media: open ? viewModal.media : null })}
        media={viewModal.media ? { ...viewModal.media, uploadedAt: viewModal.media.createdAt } : null}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Media;
