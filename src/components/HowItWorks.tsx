import { Card } from "@/components/ui/card";
import { FileText, DollarSign, Truck } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: FileText,
      title: "Post Contract",
      description: "Companies post transportation contracts with pickup/delivery details, truck requirements, and payment terms.",
      step: "01"
    },
    {
      icon: DollarSign,
      title: "Receive Bids",
      description: "Truck owners review contracts and submit competitive bids. Companies select the best offer based on price and trust points.",
      step: "02"
    },
    {
      icon: Truck,
      title: "Secure Delivery",
      description: "Payment held in escrow until successful delivery. Transporters earn trust points for each completed job.",
      step: "03"
    }
  ];

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, secure, and transparent process for both companies and transporters
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="relative p-8 text-center shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
                    {step.step}
                  </div>
                </div>
                
                <div className="mt-8">
                  <div className="bg-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;