import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { mockServices } from '@/data/mockData';
import { formatPrice, formatDuration } from '@/utils/dateTime';
import { ServiceCategory } from '@/types';
import { cn } from '@/lib/utils';

const categories: (ServiceCategory | 'All')[] = ['All', 'Hair', 'Nail', 'Lashes'];

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = (searchParams.get('category') as ServiceCategory | 'All') || 'All';

  const filteredServices = activeCategory === 'All' 
    ? mockServices.filter(s => s.isActive)
    : mockServices.filter(s => s.isActive && s.category === activeCategory);

  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-serif font-semibold text-foreground mb-4">Our Services</h1>
          <p className="text-lg text-muted-foreground">Discover our range of luxury beauty treatments</p>
        </div>
      </section>

      <section className="py-12 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex justify-center gap-2 flex-wrap">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? 'default' : 'outline'}
                onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <div key={service.id} className="card-luxury overflow-hidden group">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={service.mediaUrls[0] || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400'}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">{service.category}</span>
                  <h3 className="text-xl font-serif font-semibold text-foreground mt-1 mb-2">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-semibold text-foreground">{formatPrice(service.price)}</span>
                      <span className="text-sm text-muted-foreground ml-2">• {formatDuration(service.durationMinutes)}</span>
                    </div>
                    <Link to={`/book?service=${service.id}`}>
                      <Button size="sm">Book</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;
