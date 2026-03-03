import React from 'react';
import { mockMediaFiles } from '@/data/mockData';

const Gallery = () => {
  return (
    <div className="min-h-screen">
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-serif font-semibold text-foreground mb-4">Gallery</h1>
          <p className="text-lg text-muted-foreground">See our beautiful transformations</p>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {mockMediaFiles.map(item => (
              <div key={item.id} className="aspect-square rounded-2xl overflow-hidden group cursor-pointer">
                <img
                  src={item.url}
                  alt={item.caption || 'Gallery'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;
