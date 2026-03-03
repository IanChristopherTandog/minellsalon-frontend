import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-semibold">Reports</h1>
        <Button><Download className="mr-2 h-4 w-4" /> Export</Button>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Appointments', value: '156' },
          { label: 'Completed', value: '142' },
          { label: 'Revenue', value: '$12,450' },
          { label: 'Top Service', value: 'Balayage' },
        ].map(stat => (
          <div key={stat.label} className="card-luxury p-5">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-semibold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="card-luxury p-5">
        <h2 className="font-semibold mb-4">Appointment Statistics</h2>
        <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">Chart placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
