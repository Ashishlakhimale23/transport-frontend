import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Truck, Building2, Shield, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

const GetStarted = () => {
  const navigate = useNavigate();

  const steps = [
    {
      title: "Create Your Account",
      description: "Sign up as either a Company (posting contracts) or Truck Owner (bidding on contracts)",
      icon: Users
    },
    {
      title: "Complete Your Profile",
      description: "Add your business details, vehicle information, and upload required documents",
      icon: Building2
    },
    {
      title: "Browse or Post Contracts",
      description: "Companies post contracts, truck owners browse and bid on available opportunities",
      icon: Truck
    },
    {
      title: "Secure Transactions",
      description: "Payments are held in escrow and released after successful delivery",
      icon: Shield
    }
  ];

  const benefits = [
    "Transparent bidding process",
    "Secure escrow payments",
    "Insurance coverage options",
    "Trust point system",
    "24/7 customer support"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">Get Started</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of companies and truck owners using our platform for secure logistics
              </p>
            </div>

            {/* How It Works */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-center mb-8">How It Works</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {steps.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <Card key={index} className="p-6 shadow-card">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-primary text-primary-foreground text-sm font-medium px-2 py-1 rounded">
                              {index + 1}
                            </span>
                            <h3 className="font-semibold">{step.title}</h3>
                          </div>
                          <p className="text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Benefits */}
            <Card className="p-6 mb-8 shadow-card">
              <h3 className="text-xl font-semibold mb-4">Why Choose Our Platform?</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* User Types */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6 shadow-card">
                <div className="text-center">
                  <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">For Companies</h3>
                  <p className="text-muted-foreground mb-4">
                    Post transportation contracts and receive competitive bids from verified truck owners
                  </p>
                  <ul className="text-left space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">Post unlimited contracts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">Choose from multiple bids</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">Secure escrow payments</span>
                    </li>
                  </ul>
                  <Button onClick={() => navigate('/sign-in')} className="w-full">
                    Sign Up as Company
                  </Button>
                </div>
              </Card>

              <Card className="p-6 shadow-card">
                <div className="text-center">
                  <Truck className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">For Truck Owners</h3>
                  <p className="text-muted-foreground mb-4">
                    Browse available contracts and bid on routes that match your vehicle and schedule
                  </p>
                  <ul className="text-left space-y-2 mb-4">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">Browse unlimited contracts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">Build trust points</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      <span className="text-sm">Guaranteed payments</span>
                    </li>
                  </ul>
                  <Button onClick={() => navigate('/sign-in')} variant="outline" className="w-full">
                    Sign Up as Truck Owner
                  </Button>
                </div>
              </Card>
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-muted-foreground mb-4">
                Ready to transform your logistics experience?
              </p>
              <Button onClick={() => navigate('/sign-in')} size="lg" className="bg-primary hover:bg-primary/90">
                Get Started Today
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;