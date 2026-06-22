import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  MapPin,
  Package,
  Truck,
  Clock,
  User,
  DollarSign,
  Shield,
  ArrowLeft,
  Star,
  Eye,
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/axioapi";

export interface Contract {
  id: string;
  weight: number;
  pickupDate: Date;
  dropDate: Date;
  startLocation: string;
  endLocation: string;
  approxKms: number;
  contractorId: number;
  goodsCarrierId?: number;
  typeOfVehicle: any;
  insured: boolean;
  winningPrice?: number;
  type: any;
  createdAt: Date;
  requirements: string[];
  bids: [{
    user:{username:string},
    status : boolean,
    vehicleType : string,
    isInsured : boolean  
    notes : string,
    amount : number,
    createdAt : Date
  }];
  description: string;
  goodsCarrier: any;
  contractor: {
    id: Number;
    username: string;
    rating: number;
    _count:{
      contractsCreated :number,
    } ;
  };
}
const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
};

const ContractDetails = () => {
  const navigate = useNavigate();
  const {toast} = useToast()
  const [bidAmount, setBidAmount] = useState("");
  const [message, setMessage] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract>(
    {
  "id": "",
  "weight": 0,
  "pickupDate": "",
  "dropDate": "",
  "startLocation": "",
  "endLocation": "",
  "approxKms": 0,
  "contractorId": 0,
  "goodsCarrierId": null,
  "typeOfVehicle": null,
  "insured": false,
  "winningPrice": null,
  "type": null,
  "createdAt": "",
  "requirements": [],
  "bids": [],
  "description": "",
  "goodsCarrier": null,
  "contractor": {
    "id": 0,
    "username": "",
    "rating": 0,
    _count:{
      contractsCreated : 0
    }
  }
}
  );
  const { id } = useParams();


  useEffect(() => {
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  useEffect(() => {
    console.log(id)
    const getContract = async () => {
      const contract = await api.get(`/api/contracts/${id}`, {
      });
      console.log(contract);
      setContract(contract.data);
    };
    getContract();
  }, []);

  // Mock contract data (in real app, this would come from URL params or API)
  const contracts = {
    id: "C001",
    productType: "Electronics",
    weight: 3.5,
    startLocation: "Mumbai, Maharashtra",
    endLocation: "Bangalore, Karnataka",
    pickupDate: "2024-01-15",
    dropDate: "2024-01-17",
    typeOfVehicle: "10 Wheeler",
    approxKms: 840,
    insured: true,
    company: "Tech Solutions Ltd",
    companyRating: 4.5,
    createdAt: "2024-01-10",
    bidsCount: 12,
    status: "Open",
    description:
      "Urgent shipment of electronic components from our Mumbai warehouse to Bangalore distribution center. Requires careful handling and temperature-controlled transport.",
    requirements: [
      "Vehicle must be in good condition with valid insurance",
      "Driver should have at least 5 years experience",
      "GPS tracking mandatory",
      "Regular updates during transit required",
    ],
    bids: [],
    contractor: {
      totalContracts: 245,
      rating: 4.5,
      location: "Mumbai, Maharashtra",
    },
  };


  const handlePlaceBid = async () => {

 
    if (!bidAmount || isNaN(Number(bidAmount))) {
      setMessage("Please enter a valid bid amount.");
      return;
    }

    try {

      const res = await api.post("/api/bids", {
        contractId: contract.id,
        amount: parseFloat(bidAmount),
      });

      console.log("Bid response", res.data);
      setBidAmount("");
      setMessage("Bid placed successfully.");
      toast({
        title: "Bid placed",
        description: "Your bid has been submitted successfully.",
        variant : "default"
      });
      // optionally refresh contract/bids here
    } catch (error) {
      console.error("Error placing bid:", error);
      setMessage("Failed to place bid. Please try again.");
 toast({
        title: "Submission failed",
        description:error.response.data.error,
        variant: "destructive",
      });
    }
  };

// …existing code…

const BidRow = ({
  bid,
  userRole,
  onViewProfile,
}: {
  bid: {
    user:{username:string, id: number},
    status : 'pending' | "approved" | "declined",
    vehicleType : string,
    isInsured : boolean
    notes : string,
    amount : number,
    createdAt : Date
  },
  userRole: string | null,
  onViewProfile: (userId: number) => void
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-muted/30 rounded-lg">
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-sm">{bid.user.username}</span>

      </div>

      {bid.notes && (
        <p className="text-xs text-muted-foreground mt-1">"{bid.notes}"</p>
      )}
    </div>
    <div className="flex items-center gap-3">
      <span className="font-bold">₹{bid.amount.toLocaleString()}</span>
      {userRole === "contractor" && (
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
);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {/* Back Button */}
            <Button
              variant="outline"
              onClick={() => navigate("/browse-opportunities")}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Opportunities
            </Button>

            {/* Contract Header */}
            <Card className="p-6 mb-6 shadow-card">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-2xl font-bold text-foreground">
                      Contract #{contract.id}
                    </h1>
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary"
                    >
                      {!contract.goodsCarrier ? "open" : "closed"}
                    </Badge>
                    {contract.deliveryStatus && (
                      <Badge
                        variant="outline"
                        className={
                          contract.deliveryStatus === 'DELIVERED'
                            ? 'border-green-300 text-green-700 bg-green-50'
                            : 'border-blue-300 text-blue-700 bg-blue-50'
                        }
                      >
                        {contract.deliveryStatus}
                      </Badge>
                    )}
                    {contract.insured && (
                      <Badge
                        variant="outline"
                        className="border-primary/30 text-primary"
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        Insured
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-semibold text-foreground">
                      {contract.contractor.username}
                    </h2>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {contract.contractor.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4">
                    {contract.description}
                  </p>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Product</p>
                        <p className="font-medium">{contract.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {contract.weight}T
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Route</p>
                        <p className="font-medium text-sm">
                          {contract.startLocation}
                        </p>
                        <p className="font-medium text-sm">
                          → {contract.endLocation}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {contract.approxKms} km
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Schedule
                        </p>
                        <p className="font-medium text-sm">
                          Pickup:{" "}
                          {new Date(contract.pickupDate).toLocaleDateString( "en-US",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                },)}
                        </p>
                        <p className="font-medium text-sm">
                          Delivery:{" "}
                          {new Date(contract.dropDate).toLocaleTimeString( "en-US",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                },)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Truck className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Vehicle</p>
                        <p className="font-medium">{contract.typeOfVehicle}</p>
                        <p className="text-xs text-muted-foreground">
                          {contract.bids.length} bids
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 lg:min-w-[200px]">
                  {userRole === "driver" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-primary hover:bg-primary/90">
                          <DollarSign className="w-4 h-4 mr-2" />
                          Place Bid
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Place Your Bid</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="bidAmount">Your Bid Amount (₹)</Label>
                            <Input
                              id="bidAmount"
                              placeholder="Enter your bid amount"
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                            />
                          </div>

                          <Button onClick={handlePlaceBid} className="w-full">
                            Submit Bid
                          </Button>
                          <p className="text-xs text-muted-foreground text-center">
                            *Requires Supabase integration for actual
                            functionality
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </Card>

            {
              contract.requirements.length !== 0 && 
            <Card className="p-6 mb-6 shadow-card">
              <h3 className="text-lg font-semibold mb-4">Requirements</h3>
              <ul className="space-y-2">
                {contract.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-muted-foreground">{req}</span>
                  </li>
                ))}
              </ul>
            </Card>
            }
            <Card className="p-6 shadow-card">
              <h3 className="text-lg font-semibold mb-4">
                Company Information
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Contracts
                  </p>
                  <p className="font-medium">
                    {contract.contractor._count.contractsCreated}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Average Rating
                  </p>
                  <p className="font-medium">{contract.contractor.rating}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-card mt-3">
              <h3 className="text-lg font-semibold mb-4">
                Bids
              </h3>
            {contract.bids.length != 0 && contract.bids.map(bids => <BidRow bid={bids} userRole={userRole} onViewProfile={(userId) => navigate(`/bidder-profile/${userId}`)}/>)}
            </Card>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractDetails;
