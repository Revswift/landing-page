import { CheckCircle2, XCircle, TrendingUp, ListChecks, Ban, GitBranch } from "lucide-react";
import GlassCard from "./ui/GlassCard";
import RadialProgress from "./ui/RadialProgress";

const FeatureGrid = () => {
  const priorityItems = [
    { label: "Launch email sequence", impact: "$4,200", priority: 1 },
    { label: "Optimize landing page CTA", impact: "$2,800", priority: 2 },
    { label: "Retarget cart abandoners", impact: "$1,900", priority: 3 },
    { label: "A/B test pricing page", impact: "$1,200", priority: 4 },
  ];

  const doNotDoItems = [
    { label: "LinkedIn Ads", reason: "Low SME conversion" },
    { label: "Print advertising", reason: "Negative ROI history" },
    { label: "Generic cold email", reason: "Below threshold" },
  ];

  return (
    <section className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-4">
            <span className="text-foreground">The </span>
            <span className="text-primary">S.M.E.V.I.S.A.F.</span>
            <span className="text-foreground"> Model</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our proprietary framework that turns marketing chaos into predictable revenue growth.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Execution Readiness Score - Large */}
          <GlassCard className="md:col-span-2 p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-semibold font-display">Execution Readiness Score</h3>
                </div>
                <p className="text-muted-foreground mb-6">
                  Don't execute until you're ready. We identify revenue leaks before you spend a penny.
                </p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-destructive" />
                      <span className="text-sm text-muted-foreground">Not Ready</span>
                    </div>
                    <p className="text-xs text-muted-foreground/70">Missing strategy, budget gaps, or resource constraints</p>
                  </div>
                  <div className="bg-secondary/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-sm text-muted-foreground">Ready</span>
                    </div>
                    <p className="text-xs text-muted-foreground/70">All systems aligned for maximum ROI</p>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <RadialProgress value={78} size={160} label="ERS" sublabel="Improving" />
              </div>
            </div>
          </GlassCard>

          {/* Card 2: Action Priority Score - Tall */}
          <GlassCard className="md:row-span-2 p-8">
            <div className="flex items-center gap-2 mb-4">
              <ListChecks className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold font-display">Action Priority Score</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Know exactly what to do today. We rank actions by revenue impact, not vanity metrics.
            </p>
            
            <div className="space-y-3">
              {priorityItems.map((item, index) => (
                <div 
                  key={item.label}
                  className="flex items-center gap-3 bg-secondary/30 rounded-lg p-3 border border-border/30"
                >
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center">
                    {item.priority}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-primary">{item.impact} projected</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Card 3: Do-Not-Do List */}
          <GlassCard className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <Ban className="w-5 h-5 text-destructive" />
              <h3 className="text-xl font-semibold font-display">The "Do-Not-Do" List</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              We tell you what to ignore to save your budget.
            </p>
            
            <div className="space-y-3">
              {doNotDoItems.map((item) => (
                <div 
                  key={item.label}
                  className="flex items-center gap-3 bg-secondary/30 rounded-lg p-3 border border-border/30 opacity-60"
                >
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium line-through">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Card 4: Unified Attribution */}
          <GlassCard className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <GitBranch className="w-5 h-5 text-accent" />
              <h3 className="text-xl font-semibold font-display">Unified Attribution</h3>
            </div>
            <p className="text-muted-foreground mb-6">
              Track every touchpoint from first click to closed revenue.
            </p>
            
            {/* Attribution Flow Visualization */}
            <div className="relative py-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-xs font-medium">Lead</span>
                  </div>
                </div>
                
                <div className="flex-1 h-0.5 bg-gradient-to-r from-muted via-primary to-accent mx-4 relative">
                  <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                  <div className="absolute top-1/2 left-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary" />
                  <div className="absolute top-1/2 left-3/4 -translate-y-1/2 w-2 h-2 rounded-full bg-accent" />
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Awareness</span>
                <span>Revenue</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
