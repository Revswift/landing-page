import { useState } from "react";
import { Copy, Check, Gift, Users, Trophy } from "lucide-react";
import GlassCard from "./ui/GlassCard";

interface ReferralDashboardProps {
  position: number;
  referralCode: string;
  referralCount?: number;
}

const ReferralDashboard = ({ position, referralCode, referralCount = 0 }: ReferralDashboardProps) => {
  const [copied, setCopied] = useState(false);
  const referralGoal = 3;
  
  const referralLink = `${window.location.origin}?ref=${referralCode}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate percentage ahead of others (simulated based on position)
  const percentileAhead = Math.max(0, Math.min(99, Math.round((1 - (position / 10000)) * 100)));

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      {/* Background Effects */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Celebration Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[150px] animate-pulse-glow" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Success Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-8 animate-fade-in">
          <Check className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary font-medium">You're on the list!</span>
        </div>

        {/* Position Card */}
        <GlassCard className="p-8 mb-8 animate-fade-in-up" glow>
          <div className="flex items-center justify-center gap-4 mb-6">
            <Trophy className="w-8 h-8 text-primary" />
            <div>
              <p className="text-muted-foreground text-sm">Your position</p>
              <p className="text-5xl font-bold font-display text-foreground">#{position.toLocaleString()}</p>
            </div>
          </div>
          
          <p className="text-muted-foreground">
            You're ahead of <span className="text-primary font-medium">{percentileAhead}%</span> of other founders
          </p>
        </GlassCard>

        {/* Referral Section */}
        <GlassCard className="p-8 animate-fade-in-up delay-200">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Gift className="w-6 h-6 text-primary" />
            <h3 className="text-xl font-semibold font-display">Unlock Your Free Reality Audit</h3>
          </div>
          
          <p className="text-muted-foreground mb-6">
            Refer fellow Founders to jump the queue and get a complimentary Reality Audit worth £500.
          </p>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Referrals</span>
              <span className="text-primary font-medium">{referralCount}/{referralGoal}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                style={{ width: `${Math.min((referralCount / referralGoal) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {referralCount >= referralGoal 
                ? "🎉 You've unlocked Early Access!" 
                : `${referralGoal - referralCount} more to unlock Early Access`}
            </p>
          </div>

          {/* Referral Link */}
          <div className="flex gap-2">
            <div className="flex-1 bg-secondary/50 rounded-xl px-4 py-3 border border-border/50 text-left overflow-hidden">
              <p className="text-sm text-muted-foreground truncate">{referralLink}</p>
            </div>
            <button
              onClick={copyToClipboard}
              className="btn-primary flex items-center gap-2 px-6"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          </div>
        </GlassCard>

        {/* Rewards Info */}
        <div className="mt-8 grid grid-cols-3 gap-4 opacity-0 animate-fade-in delay-400">
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-2">
              <Users className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">1 Referral</p>
            <p className="text-sm font-medium">Priority Access</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">3 Referrals</p>
            <p className="text-sm font-medium text-primary">Reality Audit</p>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-5 h-5 text-accent" />
            </div>
            <p className="text-xs text-muted-foreground">5 Referrals</p>
            <p className="text-sm font-medium">Founding Member</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReferralDashboard;
