import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockHairstyleInspirations, mockServices } from '@/data/mockData';

const Hairstyles = () => {
  const [lengthFilter, setLengthFilter] = useState<string>('');
  const [styleFilter, setStyleFilter] = useState<string>('');

  const filtered = mockHairstyleInspirations.filter(h => {
    if (lengthFilter && h.length !== lengthFilter) return false;
    if (styleFilter && h.style !== styleFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-serif font-semibold text-foreground mb-4">Hairstyle Inspirations</h1>
          <p className="text-lg text-muted-foreground">Find your perfect look</p>
        </div>
      </section>

      <section className="py-8 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center">
            <Select value={lengthFilter} onValueChange={setLengthFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Length" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Short">Short</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Long">Long</SelectItem>
              </SelectContent>
            </Select>
            <Select value={styleFilter} onValueChange={setStyleFilter}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Style" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Wavy">Wavy</SelectItem>
                <SelectItem value="Straight">Straight</SelectItem>
                <SelectItem value="Curly">Curly</SelectItem>
                <SelectItem value="Updo">Updo</SelectItem>
              </SelectContent>
            </Select>
            {(lengthFilter || styleFilter) && (
              <Button variant="ghost" onClick={() => { setLengthFilter(''); setStyleFilter(''); }}>Clear</Button>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(style => (
              <div key={style.id} className="card-luxury overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img src={style.imageUrl} alt={style.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-serif font-semibold mb-2">{style.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{style.length} • {style.color} • {style.style}</p>
                  <Link to="/book">
                    <Button className="w-full">Book This Look</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hairstyles;
