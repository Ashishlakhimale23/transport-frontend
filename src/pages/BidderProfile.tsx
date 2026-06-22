import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Truck,
  ArrowLeft,
  Star,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { api } from "@/lib/axioapi";
import { useToast } from "@/components/ui/use-toast";

interface BidderProfileData {
  id: number;
  username: string;
  email: string;
  contact: string;
  regularPracticeLocation: string;
  role: string;
  averageRating: number | null;
  totalRatings: number;
  contractsCarried: Array<{
    id: number;
    startLocation: string;
    endLocation: string;
    pickupDate: string;
    winningPrice: number;
    weight: number;
    deliveryStatus: string;
  }>;
}

const BidderProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bidder, setBidder] = useState<BidderProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);

    if (role !== "contractor") {
      setAccessDenied(true);
      setLoading(false);
      return;
    }
  }, []);

  useEffect(() => {
    if (!userId || accessDenied) return;

    const fetchBidderProfile = async () => {
      try {
        const res = await api.get(`/api/users/${userId}`);
        setBidder(res.data);
      } catch (error) {
        console.error("Failed to fetch bidder profile", error);
        toast({
          title: "Error",
          description: "Failed to load bidder profile",
          variant: "destructive",
        });
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };

    fetchBidderProfile();
  }, [userId, navigate, accessDenied, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 text-center">Loading...</div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 pb-12">
          <div className="container mx-auto px-6">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                You don't have permission to view bidder profiles.
              </p>
              <Button onClick={() => navigate(-1)}>Go Back</Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!bidder) return null;

  const completedContracts = bidder.contractsCarried || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Profile Header */}
          <Card className="p-6 mb-6 shadow-card">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <div className="bg-primary/10 p-4 rounded-full flex-shrink-0">
                <Truck className="w-12 h-12 text-primary" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-3xl font-bold text-foreground">
                    {bidder.username}
                  </h1>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          bidder.averageRating &&
                          i < Math.floor(bidder.averageRating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-lg">
                    {bidder.averageRating
                      ? bidder.averageRating.toFixed(1)
                      : "N/A"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({bidder.totalRatings} {bidder.totalRatings === 1 ? "rating" : "ratings"})
                  </span>
                </div>

                <Badge variant="secondary" className="mb-4">
                  {bidder.role === "driver" ? "Driver" : "Carrier"}
                </Badge>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-sm">{bidder.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Contact</p>
                      <p className="font-medium text-sm">
                        {bidder.contact || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:col-span-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Operating Location
                      </p>
                      <p className="font-medium text-sm">
                        {bidder.regularPracticeLocation || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Completed Contracts */}
          <Card className="p-6 shadow-card">
            <h2 className="text-xl font-semibold mb-4">Completed Contracts</h2>

            {completedContracts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No completed contracts yet
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {completedContracts.map((contract) => (
                  <div
                    key={contract.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-muted/30 rounded-lg border border-border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">
                          Contract #{contract.id}
                        </h3>
                        <Badge variant="outline" className="bg-green-50 border-green-300 text-green-700">
                          Delivered
                        </Badge>
                      </div>
                      <div className="grid md:grid-cols-2 gap-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {contract.startLocation} → {contract.endLocation}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {contract.weight}T • Pickup:{" "}
                          {new Date(contract.pickupDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        ₹{contract.winningPrice?.toLocaleString() || "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BidderProfile;
