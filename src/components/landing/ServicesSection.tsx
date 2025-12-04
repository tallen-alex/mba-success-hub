import { FileText, MessageSquare, School, Users, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const services = [
  {
    icon: School,
    title: 'School Selection Strategy',
    description: 'Data-driven guidance to identify schools that align with your profile, goals, and maximize admission chances.',
    features: ['Profile assessment', 'School fit analysis', 'Application timeline planning'],
  },
  {
    icon: FileText,
    title: 'Essay & Resume Crafting',
    description: 'Transform your experiences into compelling narratives that resonate with admissions committees.',
    features: ['Story mining workshops', 'Unlimited essay reviews', 'Resume optimization'],
  },
  {
    icon: MessageSquare,
    title: 'Interview Preparation',
    description: 'Master behavioral and case interviews with personalized coaching and mock sessions.',
    features: ['Mock interviews', 'Feedback sessions', 'Question bank access'],
  },
  {
    icon: Users,
    title: 'Recommendation Strategy',
    description: 'Strategic guidance for selecting recommenders and crafting impactful letters of recommendation.',
    features: ['Recommender selection', 'Briefing templates', 'LOR review & feedback'],
  },
  {
    icon: Calendar,
    title: 'Application Management',
    description: 'End-to-end support keeping your applications organized and on track throughout the process.',
    features: ['Deadline tracking', 'Document management', 'Progress monitoring'],
  },
  {
    icon: CheckCircle,
    title: 'Post-Admission Support',
    description: 'Guidance on scholarship negotiations, school selection, and pre-MBA preparation.',
    features: ['Scholarship negotiation', 'Decision support', 'Pre-MBA guidance'],
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold font-medium text-sm uppercase tracking-wider">Services</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-4">
            Comprehensive MBA Consulting
          </h2>
          <p className="text-lg text-muted-foreground">
            From initial strategy to final decision, I provide personalized guidance at every step of your MBA journey.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className="group bg-gradient-card border-border/50 hover:border-gold/30 hover:shadow-elevated transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gold/10 transition-colors">
                  <service.icon className="h-6 w-6 text-primary group-hover:text-gold transition-colors" />
                </div>
                <CardTitle className="font-display text-xl">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
