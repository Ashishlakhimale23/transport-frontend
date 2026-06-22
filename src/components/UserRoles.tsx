import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Truck, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const UserRoles = () => {
  const companyFeatures = [
    "Post transportation contracts",
    "Review and select transporters", 
    "Secure escrow payment system",
    "Optional goods insurance",
    "Real-time shipment tracking",
    "Access to verified truckers"
  ];

  const truckerFeatures = [
    "Browse available contracts",
    "Submit competitive bids",
    "Build trust point rating",
    "Secure payment guarantee", 
    "Flexible scheduling options",
    "Professional network access"
  ];

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Choose Your Role
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're a company needing transportation or a truck owner looking for contracts
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Companies Card */}
          <Card className="p-8 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card">
            <div className="text-center mb-8">
              <div className="bg-primary rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">
                For Companies
              </h3>
              <p className="text-muted-foreground text-lg">
                Post contracts and find reliable transporters
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              {companyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button className="w-full bg-primary hover:bg-primary/90 text-lg py-6 group" asChild>
              <Link to="/post-contract">
                Get Started as Company
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </Card>
          
          {/* Truckers Card */}
          <Card className="p-8 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card">
            <div className="text-center mb-8">
              <div className="bg-primary rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Truck className="w-10 h-10 text-primary-foreground" />
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-2">
                For Truck Owners
              </h3>
              <p className="text-muted-foreground text-lg">
                Find contracts and grow your business
              </p>
            </div>
            
            <div className="space-y-4 mb-8">
              {truckerFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
            
            <Button className="w-full bg-primary hover:bg-primary/90 text-lg py-6 group" asChild>
              <Link to="/browse-opportunities">
                Get Started as Trucker
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UserRoles;