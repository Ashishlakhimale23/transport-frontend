import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Truck, Shield, Award, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-logistics.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Connecting Companies with 
            <span className="block text-white">
              Trusted Transporters
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Secure, efficient logistics coordination platform with escrow payments, 
            insurance protection, and trust-based matching system.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary text-lg px-8 py-4" asChild>
              <Link to="/post-contract">Post a Contract</Link>
            </Button>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg px-8 py-4 shadow-lg" asChild>
              <Link to="/browse-opportunities">Browse Opportunities</Link>
            </Button>
          </div>
          
          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center">
              <Truck className="w-8 h-8 mx-auto mb-3 text-white" />
              <div className="text-2xl font-bold text-white">5K+</div>
              <div className="text-white/80 text-sm">Active Trucks</div>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center">
              <Shield className="w-8 h-8 mx-auto mb-3 text-white" />
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-white/80 text-sm">Secure Payments</div>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-3 text-white" />
              <div className="text-2xl font-bold text-white">4.8★</div>
              <div className="text-white/80 text-sm">Average Rating</div>
            </Card>
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-white" />
              <div className="text-2xl font-bold text-white">2K+</div>
              <div className="text-white/80 text-sm">Companies</div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;