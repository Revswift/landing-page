import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import GlassCard from "./ui/GlassCard";
import BorderBeam from "./ui/BorderBeam";
import DashboardMockup from "./DashboardMockup";

interface HeroProps {
  onSubmit: (email: string) => void;
  isSubmitting: boolean;
}

const Hero = ({ onSubmit, isSubmitting }: HeroProps) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onSubmit(email);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Animated Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[100px] animate-pulse-glow delay-500" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50 mb-8 opacity-0 animate-fade-in">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">Now in Private Beta</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold font-display tracking-tight mb-6 opacity-0 animate-fade-in-up">
          <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
            The Operating System for
          </span>
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent glow-text">
            SME Revenue Growth
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 opacity-0 animate-fade-in-up delay-200">
          Stop wasting budget on broken marketing systems. RevSwift unifies strategy, 
          execution, and attribution into one intelligent engine.
        </p>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-6 opacity-0 animate-fade-in-up delay-300">
          <input
            type="email"
            placeholder="Enter your work email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-glass flex-1"
            required
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              "Joining..."
            ) : (
              <>
                Join the Waitlist
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-sm text-muted-foreground opacity-0 animate-fade-in delay-400">
          Join 2,400+ UK founders already on the list
        </p>
      </div>

      {/* Dashboard Mockup */}
      <div className="relative z-10 mt-16 w-full max-w-4xl mx-auto opacity-0 animate-fade-in-up delay-500">
        <div className="relative transform perspective-1000 rotate-x-[2deg]">
          {/* Glow behind dashboard */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-primary/5 to-transparent blur-3xl scale-110" />
          
          <GlassCard className="p-6 relative" glow>
            <BorderBeam />
            <DashboardMockup />
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default Hero;
