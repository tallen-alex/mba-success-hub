import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award, Users, Target } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-hero overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-8 animate-fade-up">
            <Award className="h-4 w-4 text-gold" />
            <span className="text-sm font-medium text-gold">
              Trusted by 200+ successful MBA candidates
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground mb-6 animate-fade-up animation-delay-100">
            Your MBA Journey,{' '}
            <span className="text-gradient-gold">Expertly Guided</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto animate-fade-up animation-delay-200">
            Personalized consulting to help you craft compelling applications and secure admission to your dream business school.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up animation-delay-300">
            <Link to="/auth?mode=signup">
              <Button variant="hero" size="xl">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#services">
              <Button variant="heroOutline" size="xl">
                Explore Services
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-up animation-delay-400">
            <div className="flex flex-col items-center p-6 bg-primary-foreground/5 rounded-2xl border border-primary-foreground/10 backdrop-blur-sm">
              <Target className="h-8 w-8 text-gold mb-3" />
              <span className="text-3xl font-bold text-primary-foreground">95%</span>
              <span className="text-primary-foreground/70">Admission Success Rate</span>
            </div>
            <div className="flex flex-col items-center p-6 bg-primary-foreground/5 rounded-2xl border border-primary-foreground/10 backdrop-blur-sm">
              <Users className="h-8 w-8 text-gold mb-3" />
              <span className="text-3xl font-bold text-primary-foreground">200+</span>
              <span className="text-primary-foreground/70">Successful Clients</span>
            </div>
            <div className="flex flex-col items-center p-6 bg-primary-foreground/5 rounded-2xl border border-primary-foreground/10 backdrop-blur-sm">
              <Award className="h-8 w-8 text-gold mb-3" />
              <span className="text-3xl font-bold text-primary-foreground">M7</span>
              <span className="text-primary-foreground/70">School Admissions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-gold rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
