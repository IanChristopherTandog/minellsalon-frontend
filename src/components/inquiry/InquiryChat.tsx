import React, { useState } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { inquiryService } from '@/services/api';
import { InquiryTopic } from '@/types';
import { cn } from '@/lib/utils';

interface InquiryChatProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const InquiryChat: React.FC<InquiryChatProps> = ({ isOpen, onToggle }) => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    topic: '' as InquiryTopic | '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.topic || !formData.message) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await inquiryService.create({
        userId: user?.id,
        name: formData.name,
        email: formData.email,
        topic: formData.topic as InquiryTopic,
        message: formData.message,
      });

      setIsSubmitted(true);
      toast({
        title: 'Inquiry Sent!',
        description: 'We\'ll get back to you as soon as possible.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send inquiry. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      topic: '',
      message: '',
    });
    setIsSubmitted(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={onToggle}
        className={cn(
          'fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-300',
          'bg-primary text-primary-foreground hover:scale-110',
          'flex items-center justify-center',
          isOpen && 'rotate-90'
        )}
        aria-label={isOpen ? 'Close chat' : 'Open inquiry chat'}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Panel */}
      <div
        className={cn(
          'fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm',
          'card-luxury overflow-hidden transition-all duration-300',
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        )}
      >
        {/* Header */}
        <div className="bg-primary px-4 py-3 text-primary-foreground">
          <h3 className="font-semibold">Have a Question?</h3>
          <p className="text-sm opacity-90">We're here to help!</p>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="h-12 w-12 rounded-full bg-status-confirmed/20 text-status-confirmed mx-auto mb-4 flex items-center justify-center">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-semibold text-foreground mb-2">Message Sent!</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Thank you for reaching out. We'll respond to your inquiry shortly.
              </p>
              <Button variant="outline" size="sm" onClick={resetForm}>
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isAuthenticated && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="chat-name">Name</Label>
                    <Input
                      id="chat-name"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chat-email">Email</Label>
                    <Input
                      id="chat-email"
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="chat-topic">Topic</Label>
                <Select
                  value={formData.topic}
                  onValueChange={value => setFormData({ ...formData, topic: value as InquiryTopic })}
                >
                  <SelectTrigger id="chat-topic" className="w-full">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent position="popper" side="top" sideOffset={4} className="w-[var(--radix-select-trigger-width)]">
                    <SelectItem value="Services">Services</SelectItem>
                    <SelectItem value="Promos">Promotions</SelectItem>
                    <SelectItem value="Availability">Availability</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="chat-message">Message</Label>
                <Textarea
                  id="chat-message"
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you?"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};
