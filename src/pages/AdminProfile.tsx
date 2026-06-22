import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, LogOut, AlertCircle } from "lucide-react";
import { api } from "@/lib/axioapi";
import { useToast } from "@/hooks/use-toast";
import PaymentModal from "@/components/PaymentModal";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
};

interface PendingBid {
  id: number;
  contractId: number;
  amount: number;
  status: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
  contract: {
    id: number;
    type: string;
    startLocation: string;
    endLocation: string;
    weight: number;
    approxKms: number;
    typeOfVehicle: string;
  };
  vehicleType: string;
  notes?: string;
  createdAt: string;
}

interface AdminStats {
  totalPendingBids: number;
  totalApprovedBids: number;
  totalRejectedBids: number;
}

const AdminProfile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [admin, setAdmin] = useState<any>(null);
  const [pendingBids, setPendingBids] = useState<PendingBid[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalPendingBids: 0,
    totalApprovedBids: 0,
    totalRejectedBids: 0,
  });

  const [paymentModal, setPaymentModal] = useState({
    open: false,
    bidId: 0,
    bidAmount: 0,
    currentBidIndex: -1,
  });
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await api.get("/api/auth/profile");

        if (res.data.role !== "admin"){
          navigate("/")
          return;
        }

        setAdmin(res.data);

        // Fetch pending bids for admin approval
        // These are bids that contractor has approved but need admin confirmation
        const bidsRes = await api.get("/api/bids/admin/pending-bids");
        const bids = bidsRes.data.data;

        setPendingBids(bids);
        setStats({
          totalApprovedBids : 0,
          totalPendingBids : bidsRes.data.data.length,
          totalRejectedBids :0
        })
        setLoading(false)

        
        
      } catch (error) {
        console.error("Failed to fetch admin data", error);
        navigate("/sign-in");
      } 
      
    };

    fetchAdminData();
  }, [navigate]);

  const handleApproveBid = (bid: PendingBid, index: number) => {
    setPaymentModal({
      open: true,
      bidId: bid.id,
      bidAmount: bid.amount,
      currentBidIndex: index,
    });
  };

  const handlePaymentConfirm = async (bid) => {
    setApproving(true);
    try {

      const res = await api.put(`/api/bids/admin/${bid.id}/approve`, {
        amount: bid.amount,
        contractId: bid.contract.id,
        goodsCarrierId : bid.user.id
      });

      console.log("Bid approved successfully", res.data);


      toast({
        title: "Bid Approved",
        description: `Bid #${bid.id} approved for ₹${bid.amount.toLocaleString()}. Email notification sent to bidder.`,
        variant: "default",
      });

      // Remove approved bid from pending list
      const updatedBids = pendingBids.filter((_, i) => i !== bid.id);
      setPendingBids(updatedBids);

      // Update stats
      setStats(prev => ({
        ...prev,
        totalPendingBids: prev.totalPendingBids - 1,
        totalApprovedBids: prev.totalApprovedBids + 1,
      }));

      setPaymentModal({ open: false, bidId: 0, bidAmount: 0, currentBidIndex: -1 });
    } catch (error: any) {
      console.error("Error approving bid:", error);
      const errMsg = error.response?.data?.message || error.message;

      toast({
        title: "Approval Failed",
        description: errMsg,
        variant: "destructive",
      });
    } finally {
      setApproving(false);
    }
  };

  const handleRejectBid = async (bid: PendingBid) => {
    try {
      const res = await api.put(`/api/bids/admin/reject`,{
        bidId : bid.user.id
      });

      console.log("Bid rejected successfully", res.data);

      toast({
        title: "Bid Rejected",
        description: `Bid #${bid.id} has been rejected`,
        variant: "default",
      });

      // Remove rejected bid from pending list
      setPendingBids(pendingBids.filter(b => b.id !== bid.id));

      // Update stats
      setStats(prev => ({
        ...prev,
        totalPendingBids: prev.totalPendingBids - 1,
        totalRejectedBids: prev.totalRejectedBids + 1,
      }));
    } catch (error: any) {
      console.error("Error rejecting bid:", error);
      const errMsg = error.response?.data?.message || error.message;

      toast({
        title: "Rejection Failed",
        description: errMsg,
        variant: "destructive",
      });
    }
  };

  if (loading) return <div className="pt-24 text-center">Loading...</div>;
  if (!admin) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Admin Header */}
          <Card className="p-6 mb-8 shadow-card bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1">{admin.email}</p>
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
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Pending Bids</p>
                  <p className="text-2xl font-bold">{stats.totalPendingBids}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Approved Bids</p>
                  <p className="text-2xl font-bold">{stats.totalApprovedBids}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="bg-red-100 p-3 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Rejected Bids</p>
                  <p className="text-2xl font-bold">{stats.totalRejectedBids}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Pending Bids Section */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Bids Pending Admin Approval</h2>

            {pendingBids.length === 0 ? (
              <Card className="p-8 text-center shadow-card">
                <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-4" />
                <p className="text-muted-foreground mb-2">No pending bids for approval</p>
                <p className="text-xs text-muted-foreground">All contractor-approved bids have been processed</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingBids.map((bid, index) => (
                  <Card key={bid.id} className="p-5 shadow-card hover:shadow-lg transition-shadow">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Bid Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">Bid #{bid.id}</h3>
                          <Badge className={statusColors[bid.status]}>{bid.status}</Badge>
                        </div>

                        <div className="space-y-1 text-sm text-muted-foreground mb-3">
                          <p>
                            <span className="font-medium text-foreground">Contract:</span>{" "}
                            Contract #{bid.contractId} • {bid.contract.type}
                          </p>
                          <p>
                            <span className="font-medium text-foreground">Route:</span>{" "}
                            {bid.contract.startLocation} → {bid.contract.endLocation} •{" "}
                            {bid.contract.approxKms} km
                          </p>
                          <p>
                            <span className="font-medium text-foreground">Details:</span>{" "}
                            {bid.contract.weight}T • {bid.contract.typeOfVehicle} •{" "}
                          </p>
                          <p>
                            <span className="font-medium text-foreground">Bidder:</span>{" "}
                            {bid.user.username} ({bid.user.email})
                          </p>
                          {bid.notes && (
                            <p>
                              <span className="font-medium text-foreground">Notes:</span> "{bid.notes}"
                            </p>
                          )}
                          <p className="text-xs">
                            <span className="text-muted-foreground">Placed:</span>{" "}
                            {new Date(bid.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Amount and Actions */}
                      <div className="lg:text-right">
                        <p className="text-3xl font-bold text-primary mb-4">
                          ₹{bid.amount.toLocaleString()}
                        </p>
                        <div className="flex gap-2 flex-col sm:flex-row lg:flex-col">
                          <Button
                            size="sm"
                            onClick={() => handlePaymentConfirm(bid)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" /> Approve & Pay
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectBid(bid)}
                          >
                            <XCircle className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
       */ 
      
    </div>
  );
};

export default AdminProfile;
