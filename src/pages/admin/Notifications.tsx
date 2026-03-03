import React, { useEffect, useState } from 'react';
import { Bell, Mail, MessageSquare, Save, ToggleLeft, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { notificationService } from '@/services/api';
import { NotificationTemplate, NotificationLog } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const TRIGGER_LABELS: Record<string, string> = {
  appointment_confirmed: 'Appointment Confirmed',
  appointment_reminder_24h: '24-Hour Reminder',
  appointment_reminder_1h: '1-Hour Reminder',
  appointment_cancelled: 'Appointment Cancelled',
  appointment_rescheduled: 'Appointment Rescheduled',
  loyalty_points_earned: 'Loyalty Points Earned',
  loyalty_reward_available: 'Reward Available',
};

const Notifications = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<NotificationTemplate | null>(null);
  const [editForm, setEditForm] = useState({
    subject: '',
    body: '',
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [templatesData, logsData] = await Promise.all([
        notificationService.getTemplates(),
        notificationService.getLogs(),
      ]);
      setTemplates(templatesData);
      setLogs(logsData);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setEditForm({
      subject: template.subject || '',
      body: template.body,
      isActive: template.isActive,
    });
    setEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedTemplate) return;
    try {
      await notificationService.updateTemplate(selectedTemplate.id, editForm);
      toast({ title: 'Template updated successfully' });
      loadData();
      setEditModalOpen(false);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update template', variant: 'destructive' });
    }
  };

  const handleToggleActive = async (template: NotificationTemplate) => {
    try {
      await notificationService.updateTemplate(template.id, { isActive: !template.isActive });
      toast({ title: `Template ${template.isActive ? 'disabled' : 'enabled'}` });
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update template', variant: 'destructive' });
    }
  };

  const handlePreview = (template: NotificationTemplate) => {
    setSelectedTemplate(template);
    setPreviewModalOpen(true);
  };

  const getPreviewBody = (template: NotificationTemplate) => {
    let body = template.body;
    const sampleValues: Record<string, string> = {
      name: 'Sarah Johnson',
      service: 'Balayage Highlights',
      date: 'January 15, 2025',
      time: '2:00 PM',
      staff: 'Ana Martinez',
      points: '200',
      balance: '1,450',
    };
    for (const [key, value] of Object.entries(sampleValues)) {
      body = body.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
    return body;
  };

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.trigger]) {
      acc[template.trigger] = [];
    }
    acc[template.trigger].push(template);
    return acc;
  }, {} as Record<string, NotificationTemplate[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold">Notification Settings</h1>
        <p className="text-muted-foreground">Manage email and SMS notification templates</p>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Sent Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6 space-y-6">
          {Object.entries(groupedTemplates).map(([trigger, triggerTemplates]) => (
            <Card key={trigger}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{TRIGGER_LABELS[trigger] || trigger}</CardTitle>
                <CardDescription>
                  Configure notifications sent when {TRIGGER_LABELS[trigger]?.toLowerCase() || trigger}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {triggerTemplates.map(template => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          template.channel === 'email' 
                            ? 'bg-blue-100 dark:bg-blue-900/30' 
                            : 'bg-green-100 dark:bg-green-900/30'
                        }`}>
                          {template.channel === 'email' ? (
                            <Mail className="h-5 w-5 text-blue-600" />
                          ) : (
                            <MessageSquare className="h-5 w-5 text-green-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium capitalize">{template.channel}</p>
                          {template.subject && (
                            <p className="text-sm text-muted-foreground">{template.subject}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={template.isActive}
                          onCheckedChange={() => handleToggleActive(template)}
                        />
                        <Button variant="ghost" size="sm" onClick={() => handlePreview(template)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(template)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="logs" className="mt-6">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Channel</TableHead>
                  <TableHead>Recipient</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No notifications sent yet
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge variant={log.channel === 'email' ? 'secondary' : 'outline'}>
                          {log.channel}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.recipient}</TableCell>
                      <TableCell>{log.subject || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={log.status === 'sent' ? 'confirmed' : log.status === 'failed' ? 'destructive' : 'pending'}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {log.sentAt ? format(new Date(log.sentAt), 'MMM d, yyyy h:mm a') : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Template Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit {selectedTemplate?.channel} Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedTemplate?.channel === 'email' && (
              <div className="space-y-2">
                <Label>Subject</Label>
                <Input
                  value={editForm.subject}
                  onChange={e => setEditForm({ ...editForm, subject: e.target.value })}
                  placeholder="Email subject line"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label>Message Body</Label>
              <Textarea
                value={editForm.body}
                onChange={e => setEditForm({ ...editForm, body: e.target.value })}
                rows={6}
              />
            </div>
            {selectedTemplate && (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-2">Available Variables:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedTemplate.variables.map(v => (
                    <Badge key={v} variant="outline" className="text-xs">
                      {`{{${v}}}`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Preview: {selectedTemplate?.channel} notification</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              {selectedTemplate.subject && (
                <div>
                  <Label className="text-muted-foreground">Subject</Label>
                  <p className="font-medium">{selectedTemplate.subject}</p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Message</Label>
                <div className="mt-2 p-4 rounded-lg bg-muted/50 whitespace-pre-wrap">
                  {getPreviewBody(selectedTemplate)}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setPreviewModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notifications;
