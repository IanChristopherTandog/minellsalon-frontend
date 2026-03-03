import React, { useEffect, useState } from 'react';
import { inquiryService } from '@/services/api';
import { Inquiry } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatRelativeTime } from '@/utils/dateTime';
import { SearchFilter } from '@/components/SearchFilter';
import { InquiryReplyModal } from '@/components/modals/InquiryReplyModal';
import { Reply, CheckCircle } from 'lucide-react';

const Inquiries = () => {
  const { toast } = useToast();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([]);
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');

  // Modal state
  const [replyModal, setReplyModal] = useState<{
    open: boolean;
    inquiry: Inquiry | null;
  }>({ open: false, inquiry: null });

  useEffect(() => {
    inquiryService.getAll().then(setInquiries);
  }, []);

  useEffect(() => {
    let filtered = [...inquiries];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(inq =>
        inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inq.messages.some(msg => msg.content.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(inq => inq.status === statusFilter);
    }

    // Apply topic filter
    if (topicFilter !== 'all') {
      filtered = filtered.filter(inq => inq.topic === topicFilter);
    }

    setFilteredInquiries(filtered);
  }, [inquiries, searchQuery, statusFilter, topicFilter]);

  const handleResolve = async (id: string) => {
    await inquiryService.resolve(id);
    setInquiries(prev => prev.map(i => i.id === id ? {...i, status: 'Resolved'} : i));
    toast({ title: 'Inquiry resolved' });
  };

  const handleReply = async (inquiryId: string, reply: string) => {
    // Simulate adding reply to inquiry
    const newMessage = {
      id: `msg-${Date.now()}`,
      content: reply,
      isAdmin: true,
      createdAt: new Date().toISOString(),
    };
    
    setInquiries(prev => prev.map(i => 
      i.id === inquiryId 
        ? { ...i, messages: [...i.messages, newMessage] }
        : i
    ));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTopicFilter('all');
  };

  const activeFiltersCount = 
    (statusFilter !== 'all' ? 1 : 0) + 
    (topicFilter !== 'all' ? 1 : 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif font-semibold">Inquiries</h1>
      
      {/* Search and Filter */}
      <SearchFilter
        searchPlaceholder="Search by name, email, or message..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        filters={[
          {
            name: 'status',
            label: 'Status',
            options: [
              { value: 'Open', label: 'Open' },
              { value: 'Resolved', label: 'Resolved' },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          },
          {
            name: 'topic',
            label: 'Topic',
            options: [
              { value: 'Services', label: 'Services' },
              { value: 'Promos', label: 'Promos' },
              { value: 'Availability', label: 'Availability' },
              { value: 'Other', label: 'Other' },
            ],
            value: topicFilter,
            onChange: setTopicFilter,
          },
        ]}
        onClearFilters={clearFilters}
        activeFiltersCount={activeFiltersCount}
      />

      <div className="space-y-4">
        {filteredInquiries.map(inq => (
          <div key={inq.id} className="card-luxury p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{inq.name}</h3>
                  <Badge variant={inq.status === 'Open' ? 'open' : 'resolved'}>{inq.status}</Badge>
                  <Badge variant="secondary">{inq.topic}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{inq.email}</p>
              </div>
              <span className="text-sm text-muted-foreground">{formatRelativeTime(inq.createdAt)}</span>
            </div>
            <div className="space-y-2 mb-4">
              {inq.messages.map(msg => (
                <div key={msg.id} className={`p-3 rounded-lg ${msg.isAdmin ? 'bg-primary/10 ml-8' : 'bg-muted/50 mr-8'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      {msg.isAdmin ? 'Admin' : inq.name}
                    </span>
                  </div>
                  <p className="text-sm">{msg.content}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              {inq.status === 'Open' && (
                <>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setReplyModal({ open: true, inquiry: inq })}
                  >
                    <Reply className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                  <Button size="sm" onClick={() => handleResolve(inq.id)}>
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Resolved
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}

        {filteredInquiries.length === 0 && (
          <div className="card-luxury p-8 text-center">
            <p className="text-muted-foreground">No inquiries match your filters</p>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyModal.inquiry && (
        <InquiryReplyModal
          open={replyModal.open}
          onOpenChange={(open) => setReplyModal({ open, inquiry: open ? replyModal.inquiry : null })}
          inquiryId={replyModal.inquiry.id}
          customerName={replyModal.inquiry.name}
          originalMessage={replyModal.inquiry.messages[replyModal.inquiry.messages.length - 1]?.content || ''}
          onReply={handleReply}
        />
      )}
    </div>
  );
};

export default Inquiries;
