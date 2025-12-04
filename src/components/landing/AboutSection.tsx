import { Award, Briefcase, GraduationCap, Heart } from 'lucide-react';

export function AboutSection() {
  const highlights = [
    { icon: GraduationCap, label: 'MBA from Top Program', value: 'ISB, IIMB' },
    { icon: Briefcase, label: 'Years of Experience', value: '8+' },
    { icon: Award, label: 'Successful Admits', value: '200+' },
    { icon: Heart, label: 'Passion for Mentoring', value: '100%' },
  ];

  return (
    <section id="about" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Column */}
          <div className="relative">
            <div className="aspect-[4/5] bg-gradient-hero rounded-2xl overflow-hidden shadow-dramatic">
              <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="font-display text-3xl font-bold text-primary-foreground mb-2">
                  Ameya Khullar
                </h3>
                <p className="text-gold font-medium">MBA Admissions Consultant</p>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gold/20 rounded-2xl -z-10" />
          </div>

          {/* Content Column */}
          <div>
            <span className="text-gold font-medium text-sm uppercase tracking-wider">About Me</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mt-3 mb-6">
              Your Partner in MBA Success
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Having navigated the MBA admissions process myself and helped over 200 candidates achieve their dreams, I understand the challenges and opportunities that lie ahead.
              </p>
              <p>
                My approach is deeply personalized – I believe every candidate has a unique story that, when told effectively, can open doors to the world's top business schools.
              </p>
              <p>
                I specialize in helping ambitious professionals craft compelling applications that showcase their authentic selves while meeting the exacting standards of elite MBA programs.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50"
                >
                  <div className="w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <p className="font-bold text-lg text-foreground">{item.value}</p>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
