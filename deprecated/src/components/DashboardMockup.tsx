import { TrendingUp, Target, Zap } from "lucide-react";
import RadialProgress from "./ui/RadialProgress";

const DashboardMockup = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Panel - Revenue Chart */}
      <div className="md:col-span-2 bg-secondary/30 rounded-xl p-5 border border-border/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Revenue Growth</h3>
            <p className="text-2xl font-bold font-display text-foreground">£124,580</p>
          </div>
          <div className="flex items-center gap-2 text-primary">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">+23.5%</span>
          </div>
        </div>
        
        {/* Simple Chart Visualization */}
        <div className="h-32 flex items-end gap-2">
          {[35, 45, 30, 55, 65, 50, 75, 85, 70, 90, 95, 100].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end">
              <div
                className="bg-gradient-to-t from-primary/60 to-primary rounded-t transition-all duration-500"
                style={{ 
                  height: `${height}%`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            </div>
          ))}
        </div>
        
        <div className="flex justify-between mt-4 text-xs text-muted-foreground">
          <span>Jan</span>
          <span>Mar</span>
          <span>Jun</span>
          <span>Sep</span>
          <span>Dec</span>
        </div>
      </div>

      {/* Right Panel - ERS Score */}
      <div className="bg-secondary/30 rounded-xl p-5 border border-border/30 flex flex-col items-center justify-center">
        <div className="text-sm font-medium text-muted-foreground mb-4">Execution Readiness</div>
        <RadialProgress value={82} label="ERS" sublabel="Ready" />
        <div className="mt-4 w-full space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Strategy</span>
            <span className="text-primary">94%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Budget</span>
            <span className="text-primary">88%</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Resources</span>
            <span className="text-accent">72%</span>
          </div>
        </div>
      </div>

      {/* Bottom Stats */}
      <div className="md:col-span-3 grid grid-cols-3 gap-4">
        <div className="bg-secondary/30 rounded-xl p-4 border border-border/30 flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold font-display">18</p>
            <p className="text-xs text-muted-foreground">Actions Today</p>
          </div>
        </div>
        <div className="bg-secondary/30 rounded-xl p-4 border border-border/30 flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Zap className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-2xl font-bold font-display">£32k</p>
            <p className="text-xs text-muted-foreground">Pipeline Value</p>
          </div>
        </div>
        <div className="bg-secondary/30 rounded-xl p-4 border border-border/30 flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-2xl font-bold font-display">4.2x</p>
            <p className="text-xs text-muted-foreground">ROI Tracked</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMockup;
