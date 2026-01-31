import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Hero from "@/components/Hero";
import TrustSection from "@/components/TrustSection";
import FeatureGrid from "@/components/FeatureGrid";
import ReferralDashboard from "@/components/ReferralDashboard";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userPosition, setUserPosition] = useState(0);
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const { toast } = useToast();

  // Check for referral code in URL
  const urlParams = new URLSearchParams(window.location.search);
  const referredBy = urlParams.get('ref');

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleWaitlistSubmit = async (email: string) => {
    setIsSubmitting(true);
    
    try {
      // Get the next position
      const { data: positionData, error: positionError } = await supabase
        .rpc('get_next_waitlist_position');
      
      if (positionError) throw positionError;
      
      const newPosition = positionData || 2401;
      const newReferralCode = generateReferralCode();
      
      // Insert into waitlist
      const { data, error } = await supabase
        .from('waitlist')
        .insert({
          email: email.toLowerCase().trim(),
          referral_code: newReferralCode,
          referred_by: referredBy || null,
          position: newPosition,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation - email already exists
          toast({
            title: "Already on the list!",
            description: "This email is already registered. Check your inbox for your referral link.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        setIsSubmitting(false);
        return;
      }

      setUserPosition(data.position);
      setReferralCode(data.referral_code);
      setReferralCount(data.referral_count);
      setIsSubmitted(true);
      
      toast({
        title: "Welcome to the waitlist!",
        description: "You're officially in. Share your link to move up!",
      });
    } catch (error) {
      console.error('Waitlist signup error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <ReferralDashboard 
          position={userPosition} 
          referralCode={referralCode}
          referralCount={referralCount}
        />
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
