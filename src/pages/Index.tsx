import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Scissors, Sparkles, Heart, Star, MapPin, Clock, Phone } from 'lucide-react';
import { mockServices, mockPromos, mockTestimonials, mockMediaFiles } from '@/data/mockData';
import { formatPrice } from '@/utils/dateTime';

const Index = () => {
  const hairServices = mockServices.filter(s => s.category === 'Hair' && s.isActive).slice(0, 2);
  const nailServices = mockServices.filter(s => s.category === 'Nail' && s.isActive).slice(0, 2);
  const lashServices = mockServices.filter(s => s.category === 'Lashes' && s.isActive).slice(0, 2);
  const activePromos = mockPromos.filter(p => p.isActive);
  const galleryItems = mockMediaFiles.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-hero overflow-hidden" aria-labelledby="hero-heading">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary blur-3xl floating-element" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent blur-3xl floating-element" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 fade-in-up gold-shimmer-bg">
              ✨ Welcome to Luxury Beauty
            </span>
            <h1 id="hero-heading" className="text-5xl md:text-7xl font-serif font-semibold mb-6 fade-in-up stagger-1">
              Where Beauty Meets <span className="gold-shimmer">Elegance</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto fade-in-up stagger-2">
              Experience the art of transformation at Minell's. Premium hair, nail, and lash services tailored to enhance your natural beauty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up stagger-3">
              <Link to="/book">
                <Button size="xl" className="btn-shine gold-shimmer-bg w-full sm:w-auto">
                  Book Your Appointment
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="xl" className="w-full sm:w-auto hover:gold-shimmer-bg">
                  Explore Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className="py-20 bg-background" aria-labelledby="services-heading">
        <div className="container mx-auto px-4">
          <header className="text-center mb-12">
            <h2 id="services-heading" className="text-4xl font-serif font-semibold text-foreground mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From stunning hair transformations to flawless nails and captivating lashes
            </p>
          </header>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Scissors, title: 'Hair', services: hairServices, color: 'primary' },
              { icon: Sparkles, title: 'Nails', services: nailServices, color: 'accent' },
              { icon: Heart, title: 'Lashes', services: lashServices, color: 'blush' },
            ].map((category) => (
              <article key={category.title} className="card-luxury p-6 hover:shadow-lg transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4" aria-hidden="true">
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-foreground mb-4">{category.title}</h3>
                <ul className="space-y-3 mb-6">
                  {category.services.map(service => (
                    <li key={service.id} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{service.name}</span>
                      <span className="font-medium text-foreground">{formatPrice(service.price)}</span>
                    </li>
                  ))}
                </ul>
                <Link to={`/services?category=${category.title}`}>
                  <Button variant="outline" className="w-full">
                    View All {category.title} Services
                  </Button>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Promos Banner */}
      {activePromos.length > 0 && (
        <section className="py-16 bg-gradient-blush text-primary-foreground" aria-labelledby="promo-heading">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 id="promo-heading" className="text-2xl font-serif font-semibold mb-2">{activePromos[0].title}</h2>
                <p className="opacity-90">{activePromos[0].details}</p>
              </div>
              <Link to="/book">
                <Button variant="hero" size="lg">
                  Book Now & Save
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Preview */}
      <section className="py-20 bg-muted/30" aria-labelledby="gallery-heading">
        <div className="container mx-auto px-4">
          <header className="text-center mb-12">
            <h2 id="gallery-heading" className="text-4xl font-serif font-semibold text-foreground mb-4">Our Work</h2>
            <p className="text-muted-foreground">See the transformations we create every day</p>
          </header>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryItems.map((item) => (
              <figure key={item.id} className="aspect-square rounded-2xl overflow-hidden group cursor-pointer">
                <img
                  src={item.url}
                  alt={item.caption || 'Salon work showcase'}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </figure>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/gallery">
              <Button variant="outline" size="lg">View Full Gallery</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background" aria-labelledby="testimonials-heading">
        <div className="container mx-auto px-4">
          <header className="text-center mb-12">
            <h2 id="testimonials-heading" className="text-4xl font-serif font-semibold text-foreground mb-4">Client Love</h2>
          </header>
          <div className="grid md:grid-cols-3 gap-6">
            {mockTestimonials.slice(0, 3).map(testimonial => (
              <article key={testimonial.id} className="card-luxury p-6">
                <div className="flex gap-1 mb-4" role="img" aria-label={`${testimonial.rating} out of 5 stars`}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-4 italic">"{testimonial.comment}"</blockquote>
                <footer className="font-medium text-foreground">— {testimonial.name}</footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Hours */}
      <section className="py-20 bg-muted/30" aria-labelledby="visit-heading">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 id="visit-heading" className="text-4xl font-serif font-semibold text-foreground mb-6">Visit Us</h2>
              <address className="not-italic space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-primary mt-1" aria-hidden="true" />
                  <div>
                    <h3 className="font-medium text-foreground">Location</h3>
                    <p className="text-muted-foreground">123 Beauty Lane, Suite 100<br />Los Angeles, CA 90001</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Clock className="h-5 w-5 text-primary mt-1" aria-hidden="true" />
                  <div>
                    <h3 className="font-medium text-foreground">Hours</h3>
                    <p className="text-muted-foreground">Monday - Saturday: 9AM - 6PM<br />Sunday: Closed</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-primary mt-1" aria-hidden="true" />
                  <div>
                    <h3 className="font-medium text-foreground">Contact</h3>
                    <p className="text-muted-foreground">
                      <a href="tel:+15551234567" className="hover:text-primary transition-colors">+1 (555) 123-4567</a>
                    </p>
                  </div>
                </div>
              </address>
              <div className="mt-8">
                <Link to="/contact">
                  <Button>Get Directions</Button>
                </Link>
              </div>
            </div>
            <figure className="aspect-video rounded-2xl bg-muted overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800"
                alt="Inside view of Minell's Salon showing modern elegant interior"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-jet text-white" aria-labelledby="cta-heading">
        <div className="container mx-auto px-4 text-center">
          <h2 id="cta-heading" className="text-4xl font-serif font-semibold mb-4 gold-shimmer">Ready for Your Transformation?</h2>
          <p className="opacity-80 mb-8 max-w-xl mx-auto">Book your appointment today and let us bring out your natural beauty.</p>
          <Link to="/book">
            <Button variant="hero-outline" size="xl" className="gold-shimmer-bg border-gold text-gold hover:bg-gold hover:text-jet">
              Book Your Appointment
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
