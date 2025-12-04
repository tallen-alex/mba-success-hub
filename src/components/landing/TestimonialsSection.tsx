import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    name: 'Priya Sharma',
    school: 'Harvard Business School',
    year: '2024',
    quote: "Ameya's guidance was transformative. He helped me articulate my story in ways I never imagined. His strategic approach to school selection and essay crafting was invaluable.",
    image: null,
  },
  {
    name: 'Rahul Verma',
    school: 'Wharton',
    year: '2023',
    quote: "Working with Ameya was a game-changer. His deep understanding of what top schools look for and his ability to bring out the best in my applications made all the difference.",
    image: null,
  },
  {
    name: 'Ananya Patel',
    school: 'Stanford GSB',
    year: '2024',
    quote: "The personalized attention and genuine care Ameya provides is unmatched. He pushed me to dig deeper and tell my authentic story, which ultimately got me into my dream school.",
    image: null,
  },
  {
    name: 'Vikram Singh',
    school: 'INSEAD',
    year: '2023',
    quote: "Ameya's methodical approach to application strategy and his keen eye for detail helped me present the strongest possible application. Highly recommended!",
    image: null,
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-gold font-medium text-sm uppercase tracking-wider">
            Success Stories
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mt-3 mb-4">
            What My Clients Say
          </h2>
          <p className="text-lg text-primary-foreground/70">
            Real stories from candidates who achieved their MBA dreams
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-primary-foreground/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-primary-foreground/10">
            {/* Quote Icon */}
            <Quote className="absolute top-8 left-8 h-12 w-12 text-gold/30" />

            {/* Content */}
            <div className="relative z-10 text-center">
              <p className="text-xl md:text-2xl text-primary-foreground leading-relaxed mb-8 font-display italic">
                "{current.quote}"
              </p>

              {/* Author */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-gold">
                    {current.name.charAt(0)}
                  </span>
                </div>
                <p className="font-semibold text-lg text-primary-foreground">
                  {current.name}
                </p>
                <p className="text-gold font-medium">
                  {current.school}, Class of {current.year}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="heroOutline"
                size="icon"
                onClick={prev}
                className="rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-gold w-6'
                        : 'bg-primary-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <Button
                variant="heroOutline"
                size="icon"
                onClick={next}
                className="rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
