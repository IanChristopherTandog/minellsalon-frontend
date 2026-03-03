import React, { useEffect, useState } from 'react';
import { DollarSign, Users, TrendingUp, Download, Check, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { commissionService, staffService } from '@/services/api';
import { Commission, CommissionSummary, Staff } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const Commissions = () => {
  const { toast } = useToast();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [summary, setSummary] = useState<CommissionSummary[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommissions, setSelectedCommissions] = useState<string[]>([]);
  const [filterStaff, setFilterStaff] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [commissionsData, summaryData, staffData] = await Promise.all([
        commissionService.getAll(),
        commissionService.getSummary(),
        staffService.getAll(),
      ]);
      setCommissions(commissionsData);
      setSummary(summaryData);
      setStaff(staffData);
    } catch (error) {
      console.error('Failed to load commissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    try {
      await commissionService.markAsPaid(id);
      toast({ title: 'Commission marked as paid' });
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update commission', variant: 'destructive' });
    }
  };

  const handleBulkMarkAsPaid = async () => {
    if (selectedCommissions.length === 0) return;
    try {
      await commissionService.markMultipleAsPaid(selectedCommissions);
      toast({ title: `${selectedCommissions.length} commissions marked as paid` });
      setSelectedCommissions([]);
      loadData();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update commissions', variant: 'destructive' });
    }
  };

  const toggleSelectCommission = (id: string) => {
    setSelectedCommissions(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const pendingCommissions = filteredCommissions.filter(c => c.status === 'pending');
    if (selectedCommissions.length === pendingCommissions.length) {
      setSelectedCommissions([]);
    } else {
      setSelectedCommissions(pendingCommissions.map(c => c.id));
    }
  };

  const getStaffName = (staffId: string) => {
    return staff.find(s => s.id === staffId)?.name || 'Unknown';
  };

  const getStaffAvatar = (staffId: string) => {
    return staff.find(s => s.id === staffId)?.avatarUrl;
  };

  const filteredCommissions = commissions.filter(c => {
    if (filterStaff !== 'all' && c.staffId !== filterStaff) return false;
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    return true;
  });

  const totalPending = summary.reduce((acc, s) => acc + s.pendingCommission, 0);
  const totalPaid = summary.reduce((acc, s) => acc + s.paidCommission, 0);
  const totalCommission = summary.reduce((acc, s) => acc + s.totalCommission, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold">Commission Management</h1>
          <p className="text-muted-foreground">Track and manage staff commissions</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Commission</p>
                <p className="text-2xl font-semibold">${totalCommission.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-semibold">${totalPending.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paid</p>
                <p className="text-2xl font-semibold">${totalPaid.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Staff</p>
                <p className="text-2xl font-semibold">{staff.filter(s => s.isActive).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Commission Details</TabsTrigger>
          <TabsTrigger value="summary">Staff Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={filterStaff} onValueChange={setFilterStaff}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff</SelectItem>
                  {staff.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
            {selectedCommissions.length > 0 && (
              <Button onClick={handleBulkMarkAsPaid}>
                <Check className="mr-2 h-4 w-4" />
                Mark {selectedCommissions.length} as Paid
              </Button>
            )}
          </div>

          {/* Commission Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        filteredCommissions.filter(c => c.status === 'pending').length > 0 &&
                        selectedCommissions.length === filteredCommissions.filter(c => c.status === 'pending').length
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Service Amount</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommissions.map(commission => (
                  <TableRow key={commission.id}>
                    <TableCell>
                      {commission.status === 'pending' && (
                        <Checkbox
                          checked={selectedCommissions.includes(commission.id)}
                          onCheckedChange={() => toggleSelectCommission(commission.id)}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={getStaffAvatar(commission.staffId)} />
                          <AvatarFallback className="text-xs">
                            {getStaffName(commission.staffId).charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{getStaffName(commission.staffId)}</span>
                      </div>
                    </TableCell>
                    <TableCell>${commission.serviceAmount.toFixed(2)}</TableCell>
                    <TableCell>{commission.commissionRate}%</TableCell>
                    <TableCell className="font-semibold">${commission.commissionAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={commission.status === 'paid' ? 'confirmed' : 'pending'}>
                        {commission.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(commission.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell>
                      {commission.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsPaid(commission.id)}
                        >
                          Mark Paid
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {summary.map(s => (
              <Card key={s.staffId}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={getStaffAvatar(s.staffId)} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {s.staffName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{s.staffName}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {s.totalAppointments} appointments
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service Revenue</span>
                    <span className="font-medium">${s.totalServiceAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Commission</span>
                    <span className="font-semibold text-primary">${s.totalCommission.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pending</span>
                    <span className="text-orange-600">${s.pendingCommission.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Paid</span>
                    <span className="text-green-600">${s.paidCommission.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Commissions;
