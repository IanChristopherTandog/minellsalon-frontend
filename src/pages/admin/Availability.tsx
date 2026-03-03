import React, { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { availabilityService } from '@/services/api';
import { AvailabilityBlock } from '@/types';
import { formatDate, formatTime } from '@/utils/dateTime';
import { Trash2 } from 'lucide-react';

const Availability = () => {
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    availabilityService.getUpcoming().then(setBlocks);
  }, []);

  const handleDelete = async (id: string) => {
    await availabilityService.delete(id);
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif font-semibold">Availability</h1>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-luxury p-5">
          <h2 className="font-semibold mb-4">Calendar</h2>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-xl border p-3 pointer-events-auto"
          />
          <Button className="w-full mt-4">Add Blocked Time</Button>
        </div>

        <div className="card-luxury p-5">
          <h2 className="font-semibold mb-4">Upcoming Blocks</h2>
          <div className="space-y-3">
            {blocks.length === 0 ? (
              <p className="text-muted-foreground text-sm">No blocked times</p>
            ) : (
              blocks.map(block => (
                <div key={block.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{formatDate(block.date)}</p>
                    <p className="text-sm text-muted-foreground">{formatTime(block.startTime)} - {formatTime(block.endTime)}</p>
                    <p className="text-sm text-muted-foreground">{block.reason}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(block.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Availability;
