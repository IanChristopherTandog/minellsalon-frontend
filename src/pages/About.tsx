import React from 'react';
import { Heart, Target, Users, Award } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-serif font-semibold text-foreground mb-4">About Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your destination for luxury beauty services since 2018
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-semibold mb-6">Our Story</h2>
            <p className="text-muted-foreground leading-relaxed">
              Founded by Minell Santos, our salon was born from a passion for making every client feel beautiful and confident. What started as a small studio has grown into a full-service luxury salon, serving hundreds of happy clients.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: 'Mission', desc: 'To enhance natural beauty through exceptional service and personalized care.' },
              { icon: Target, title: 'Vision', desc: 'To be the premier destination for luxury beauty services in our community.' },
              { icon: Award, title: 'Values', desc: 'Excellence, integrity, and genuine care for every client who walks through our doors.' },
            ].map(item => (
              <div key={item.title} className="card-luxury p-6 text-center">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-serif font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
