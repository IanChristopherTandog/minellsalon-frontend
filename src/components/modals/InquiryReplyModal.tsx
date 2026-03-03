import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InquiryReplyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inquiryId: string;
  customerName: string;
  originalMessage: string;
  onReply: (inquiryId: string, reply: string) => Promise<void>;
}

export const InquiryReplyModal: React.FC<InquiryReplyModalProps> = ({
  open,
  onOpenChange,
  inquiryId,
  customerName,
  originalMessage,
  onReply,
}) => {
  const { toast } = useToast();
  const [reply, setReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;

    setIsSubmitting(true);
    try {
      await onReply(inquiryId, reply);
      toast({
        title: "Reply Sent",
        description: `Your reply has been sent to ${customerName}.`,
      });
      setReply('');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Reply to {customerName}</DialogTitle>
          <DialogDescription>
            Send a response to this inquiry.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Original message:</p>
              <p className="text-sm">{originalMessage}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reply">Your Reply</Label>
              <Textarea
                id="reply"
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="Type your response..."
                rows={5}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !reply.trim()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Reply
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
