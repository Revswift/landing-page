import { useState } from "react";
import Hero from "@/components/Hero";
import TrustSection from "@/components/TrustSection";
import FeatureGrid from "@/components/FeatureGrid";
import ReferralDashboard from "@/components/ReferralDashboard";
import Footer from "@/components/Footer";

const Index = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userPosition, setUserPosition] = useState(0);
  const [referralCode, setReferralCode] = useState("");

  const handleWaitlistSubmit = async (email: string) => {
    setIsSubmitting(true);
    
    // Simulate API call - this will be replaced with Supabase
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock data
    const position = Math.floor(Math.random() * 500) + 2400;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    setUserPosition(position);
    setReferralCode(code);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <ReferralDashboard position={userPosition} referralCode={referralCode} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Hero onSubmit={handleWaitlistSubmit} isSubmitting={isSubmitting} />
      <TrustSection />
      <FeatureGrid />
      <Footer />
    </div>
  );
};

export default Index;
