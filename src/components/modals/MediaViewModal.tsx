import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Trash2, X } from 'lucide-react';

interface MediaViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media: {
    id: string;
    url: string;
    caption?: string;
    type: string;
    uploadedAt: string;
  } | null;
  onDelete?: (id: string) => void;
}

export const MediaViewModal: React.FC<MediaViewModalProps> = ({
  open,
  onOpenChange,
  media,
  onDelete,
}) => {
  if (!media) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <span>{media.caption || 'Media Preview'}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative aspect-video bg-muted">
          <img 
            src={media.url} 
            alt={media.caption || 'Media'} 
            className="w-full h-full object-contain"
          />
        </div>

        <div className="p-4 flex items-center justify-between border-t">
          <div className="text-sm text-muted-foreground">
            <span>Type: {media.type}</span>
            <span className="mx-2">•</span>
            <span>Uploaded: {new Date(media.uploadedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={media.url} download>
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
            </Button>
            {onDelete && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => onDelete(media.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
