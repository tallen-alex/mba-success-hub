import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Instagram, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="font-display text-2xl font-bold mb-4">Ameya Khullar</h3>
            <p className="text-primary-foreground/70 max-w-md mb-6">
              Empowering ambitious professionals to achieve their MBA dreams through personalized guidance and strategic consulting.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-gold/20 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-gold/20 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-gold/20 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@ameyakhullar.com"
                className="w-10 h-10 bg-primary-foreground/10 rounded-full flex items-center justify-center hover:bg-gold/20 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-gold">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <a href="#services" className="text-primary-foreground/70 hover:text-gold transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#about" className="text-primary-foreground/70 hover:text-gold transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-primary-foreground/70 hover:text-gold transition-colors">
                  Success Stories
                </a>
              </li>
              <li>
                <a href="#contact" className="text-primary-foreground/70 hover:text-gold transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4 text-gold">Client Portal</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/auth" className="text-primary-foreground/70 hover:text-gold transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/auth?mode=signup" className="text-primary-foreground/70 hover:text-gold transition-colors">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} Ameya Khullar. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-primary-foreground/50 hover:text-gold transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-primary-foreground/50 hover:text-gold transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
