import { Card } from "@/components/ui/card";
import { Shield, CreditCard, Star, Clock, Users } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: CreditCard,
      title: "Escrow Payment System",
      description: "Payments are securely held in escrow and released only after successful delivery, protecting both parties."
    },
    {
      icon: Shield,
      title: "Optional Insurance",
      description: "Companies can insure their goods during transit by paying a premium, providing additional peace of mind."
    },
    {
      icon: Star,
      title: "Trust Point System",
      description: "Transporters earn trust points for each successful delivery, building credibility for future opportunities."
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Set pickup and delivery dates that work for your business with flexible scheduling options."
    },
    {
      icon: Users,
      title: "Verified Network",
      description: "All transporters are verified with proper documentation and insurance validity checks."
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Platform Features
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need for secure and efficient logistics coordination
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 shadow-card hover:shadow-lg transition-all duration-300 border-0 bg-card">
                <div className="bg-primary rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;