import { Shield, FileCheck, BarChart3 } from "lucide-react";

const TrustSection = () => {
  const badges = [
    { icon: Shield, label: "GDPR Compliant" },
    { icon: FileCheck, label: "Audit-Ready Logs" },
    { icon: BarChart3, label: "Data-Driven" },
  ];

  return (
    <section className="relative py-20 px-6 border-y border-border/30">
      <div className="max-w-6xl mx-auto">
        {/* Logo Parade */}
        <p className="text-center text-sm text-muted-foreground mb-8 tracking-wider uppercase">
          Powering UK Business Growth
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-12 mb-16 opacity-40">
          {["TechStartup", "GrowthCo", "ScaleUK", "VentureHub", "InnovateLtd"].map((name) => (
            <div key={name} className="font-display text-xl font-semibold text-muted-foreground/60">
              {name}
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {badges.map(({ icon: Icon, label }) => (
            <div key={label} className="badge-trust">
              <Icon className="w-4 h-4 text-primary" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
