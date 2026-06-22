import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Truck,
  Building2,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  Star,
  Eye,
} from "lucide-react";
import { api } from "@/lib/axioapi";
import { useToast } from "@/hooks/use-toast";
import PaymentModal from "@/components/PaymentModal";
import { DeliveryConfirmationModal } from "@/components/DeliveryConfirmationModal";
import { RatingDialog } from "@/components/RatingDialog";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
};

const Profile = () => {
  const { toast } = useToast();

  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [myContracts, setMyContracts] = useState([]);
  const [assignedContracts, setAssignedContracts] = useState([]);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [paymentModal, setPaymentModal] = useState({
    open: false,
    bidId: 0,
    bidAmount: 0,
    contractId: 0,
    userId: 0,
  });
  const [approving, setApproving] = useState(false);

  const updateBidStatus = async (
    contractid: number,
    amount: number,
    id: number,
  ) => {
    try {
      const res = await api.post(`/api/contracts/${contractid}/assign`, {
        goodsCarrierId: id,
        winningPrice: amount,
      });

      console.log("Bid assigned successfully", res.data);
      toast({
        title: "Bid Approved",
        description: `Contract assigned with winning price ₹${amount.toLocaleString()}`,
        variant: "default",
      });

      // Refresh profile to update UI
      const updatedRes = await api.get("/api/auth/profile");
      setUser(updatedRes.data);
      setMyContracts(updatedRes.data.contractsCreated);
      setPaymentModal({
        open: false,
        bidId: 0,
        bidAmount: 0,
        contractId: 0,
        userId: 0,
      });
    } catch (error: any) {
      console.error("Error assigning bid:", error);
      const errMsg =
        error.response?.data?.message || error.response?.data || error.message;

      toast({
        title: "Assignment failed",
        description: "Failed",
        variant: "destructive",
      });
    } finally {
      setApproving(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/auth/profile");

        setUser(res.data);
        setMyContracts(res.data.contractsCreated);

        // Fetch assigned contracts (where user is the goods carrier)
        const assignedRes = await api.get("/api/contracts/my-contracts?type=assigned");
        setAssignedContracts(assignedRes.data);

        // Fetch user ratings
        const ratingsRes = await api.put("/api/users/ratings");
        setUserRating(ratingsRes.data.averageRating);
      } catch (error) {
        console.error("Failed to fetch profile", error);
        navigate("/login"); // redirect if unauthorized
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) return <div className="pt-24 text-center">Loading...</div>;
  if (!user) return null;

  const isDriver = user.role === "driver";
  const isContractor = user.role === "contractor";

  const myBids = user.bids || [];

  const Delete = async (contractId: string) => {
    try {
      const res = await api.delete(`/api/contracts/${contractId}`);

      const filteredContracts = myContracts.filter(contract => contract.id != contractId);
      setMyContracts(filteredContracts);

      toast({
        title: "Delete",
        description: `Contract Delete`,
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Assignment failed",
        description: "Failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Profile Header */}
          <Card className="p-6 mb-8 shadow-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  {isDriver ? (
                    <Truck className="w-8 h-8 text-primary" />
                  ) : (
                    <Building2 className="w-8 h-8 text-primary" />
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">
                    {user.fullName}
                  </h1>
                  <p className="text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">
                      {isDriver
                        ? "Driver / Truck Owner"
                        : "Contractor / Company"}
                    </Badge>
                    {user.companyName && (
                      <span className="text-sm text-muted-foreground">
                        • {user.companyName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
                  navigate("/");
                }}
              >
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Button>
            </div>
            <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Contact:</span>{" "}
                <span className="font-medium">{user.contact || "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Role:</span>{" "}
                <span className="font-medium capitalize">{user.role}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Rating:</span>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(userRating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="font-medium ml-2">{userRating !== null ? userRating : "N/A"}</span>
                </div>
              </div>
              {user.companyName && (
                <div>
                  <span className="text-muted-foreground">Company:</span>{" "}
                  <span className="font-medium">{user.companyName}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Driver View: My Bids */}
          {isDriver && (
            <div>
              <h2 className="text-xl font-semibold mb-4">My Placed Bids</h2>
              {myBids.length === 0 ? (
                <Card className="p-8 text-center shadow-card">
                  <p className="text-muted-foreground mb-4">
                    You haven't placed any bids yet.
                  </p>
                  <Button onClick={() => navigate("/browse-opportunities")}>
                    Browse Opportunities
                  </Button>
                </Card>
              ) : (
                <div className="space-y-4">
                  {myBids.map((bid) => {
                    return (
                      <Card key={bid.id} className="p-5 shadow-card">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">
                                Contract #{bid.contractId}
                              </h3>
                              <Badge className={statusColors[bid.status]}>
                                {bid.status ? "Approved" : "Declined"}
                              </Badge>
                            </div>
                            {bid.contract && (
                              <p className="text-sm text-muted-foreground">
                                {bid.contract.startLocation} →{" "}
                                {bid.contract.endLocation} • {bid.contract.type}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">
                              ₹{bid.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {bid.contract.vehicleType} •{" "}
                              {new Date(bid.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Driver View: Assigned Contracts (Journey & Delivery) */}
          {isDriver && assignedContracts.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Assigned Contracts (Active Journeys)</h2>
              <div className="space-y-4">
                {assignedContracts.map((contract: any) => (
                  <Card key={contract.id} className="p-5 shadow-card">
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Contract #{contract.id}</h3>
                        <div className="flex gap-2">
                          {contract.deliveryStatus && (
                            <Badge className={
                              contract.deliveryStatus === 'DELIVERED'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }>
                              {contract.deliveryStatus}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {contract.startLocation} → {contract.endLocation} • {contract.weight}T
                      </p>
                    </div>

                    <div className="border-t border-border pt-3">
                      <p className="text-sm text-muted-foreground mb-3">
                        <strong>Payment:</strong> ₹{contract.winningPrice?.toLocaleString() || 'N/A'}
                      </p>

                      {contract.deliveryStatus !== 'DELIVERED' && (
                        <div className="flex gap-2">
                          <DeliveryConfirmationModal
                            contractId={contract.id}
                            onSuccess={() => {
                              // Refresh assigned contracts
                              const fetchUpdated = async () => {
                                const res = await api.get("/api/contracts/my-contracts?type=assigned");
                                setAssignedContracts(res.data);
                              };
                              fetchUpdated();
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Contractor View: My Contracts + Bids */}
          {isContractor && (
            <div>
              <h2 className="text-xl font-semibold mb-4">My Contracts</h2>
              {myContracts.length === 0 ? (
                <Card className="p-8 text-center shadow-card">
                  <p className="text-muted-foreground mb-4">
                    You haven't posted any contracts yet.
                  </p>
                  <Button onClick={() => navigate("/post-contract")}>
                    Post a Contract
                  </Button>
                </Card>
              ) : (
                <div className="space-y-6">
                  {myContracts.map((contract) => {
                    return (
                      <Card key={contract.id} className="p-5 shadow-card">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3
                              className="font-semibold text-lg cursor-pointer hover:text-primary"
                              onClick={() => navigate(`/contract-details/${contract.id}`)}
                            >
                              Contract #{contract.id} — {contract.type}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {contract.startLocation} → {contract.endLocation}{" "}
                              • {contract.weight}T • {contract.approxKms} km
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {contract.winningPrice}
                          </Badge>

                          <Button variant="outline" onClick={() => Delete(contract.id)}>
                            Delete
                          </Button>
                        </div>

                        {/* Assigned Driver Info */}
                        {contract.goodsCarrier && (
                          <div className="border-t border-border pt-3 mb-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  <strong>Driver:</strong> {contract.goodsCarrier.username}
                                </p>
                                {contract.deliveryStatus && (
                                  <Badge className={
                                    contract.deliveryStatus === 'DELIVERED'
                                      ? 'bg-green-100 text-green-800 mt-2'
                                      : 'bg-blue-100 text-blue-800 mt-2'
                                  }>
                                    {contract.deliveryStatus}
                                  </Badge>
                                )}
                              </div>
                              {contract.deliveryStatus === 'DELIVERED' &&  (
                                <RatingDialog
                                  driverId={contract.goodsCarrier.id}
                                  contractId={contract.id}
                                  driverName={contract.goodsCarrier.username}
                                  onSuccess={() => {
                                    toast({
                                      title: "Thank you!",
                                      description: "Your rating helps improve our service",
                                      variant: "default",
                                    });
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        )}

                        {/* Bids on this contract */}
                        <div className="border-t border-border pt-3">
                          <h4 className="text-sm font-medium text-muted-foreground mb-3">
                            Bids ({contract.bids.length})
                          </h4>
                          {contract.bids.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic">
                              No bids yet
                            </p>
                          ) : (
                            <div className="space-y-3">
                              {contract.bids.map((bid) => (
                                //@ts-ignore
                                <BidRow
                                  key={bid.id}
                                  bid={bid}
                                  onApprove={() => {
                                    setPaymentModal({
                                      open: true,
                                      bidId: bid.id,
                                      bidAmount: bid.amount,
                                      contractId: contract.id,
                                      userId: bid.user.id,
                                    });
                                  }}
                                  onViewProfile={(userId) => navigate(`/bidder-profile/${userId}`)}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={paymentModal.open}
        onClose={() =>
          setPaymentModal({
            open: false,
            bidId: 0,
            bidAmount: 0,
            contractId: 0,
            userId: 0,
          })
        }
        bidAmount={paymentModal.bidAmount}
        bidId={paymentModal.bidId}
        onConfirm={() => {
          setApproving(true);
          updateBidStatus(
            paymentModal.contractId,
            paymentModal.bidAmount,
            paymentModal.userId,
          );
        }}
        isLoading={approving}
      />
    </div>
  );
};

const BidRow = ({
  bid,
  onApprove,
  onDecline,
  onViewProfile,
}: {
  bid: any;
  onApprove: () => void;
  onDecline: () => void;
  onViewProfile?: (userId: number) => void;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-muted/30 rounded-lg">
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-sm">{bid.user.username}</span>
        <Badge className={statusColors[bid.status]}>{bid.status}</Badge>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {bid.vehicleType} • {bid.isInsured ? "Insured" : "Not Insured"} •{" "}
        {new Date(bid.createdAt).toLocaleTimeString()}
      </p>
      {bid.notes && (
        <p className="text-xs text-muted-foreground mt-1">"{bid.notes}"</p>
      )}
    </div>
    <div className="flex items-center gap-3">
      <span className="font-bold">₹{bid.amount.toLocaleString()}</span>
      <div className="flex gap-2">
        {bid.status === "pending" && (
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 border-green-300 hover:bg-green-50"
            onClick={onApprove}
          >
            <CheckCircle className="w-4 h-4 mr-1" /> Approve
          </Button>
        )}
        {onViewProfile && (
          <Button
            size="sm"
            variant="outline"
            className="text-blue-600 border-blue-300 hover:bg-blue-50"
            onClick={() => onViewProfile(bid.user.id)}
          >
            <Eye className="w-4 h-4 mr-1" /> Profile
          </Button>
        )}
      </div>
    </div>
  </div>
);

export default Profile;
