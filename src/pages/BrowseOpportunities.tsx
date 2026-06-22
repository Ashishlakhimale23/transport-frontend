import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Truck, Clock, DollarSign, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import axios from "axios"
import { api } from "@/lib/axioapi";

const BrowseOpportunities = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    location: "",
    typeOfVehicle: "",
    sortBy: "latest"
  });
  const [contracts,setContracts] = useState([])
  const [realcontract,setRealContrat] = useState([])

  // Mock contract data
  const contract = [
    {
      id: "C001",
      type: "Electronics",
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
      status: "Open"
    },
  
  ];

  const getContract =async () =>{
    const contarcts = await api.get("/api/contracts") 
    setRealContrat(contarcts.data)
    setContracts(contarcts.data)
  }

  useEffect(()=>{
    getContract()
  },[])

  const handleBid = (contractId: string) => {
    console.log("Bidding on contract:", contractId);
    // Handle bidding logic
  };

const applyFilters = () => {
    let filtered = realcontract;

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(
        (contract) =>
          contract.startLocation
            .toLowerCase()
            .includes(filters.location.toLowerCase()) ||
          contract.endLocation
            .toLowerCase()
            .includes(filters.location.toLowerCase())
      );
    }

    // Filter by vehicle type
    if (filters.typeOfVehicle && filters.typeOfVehicle !== "all") {
      filtered = filtered.filter(
        (contract) =>
          contract.typeOfVehicle
            .toLowerCase()
            .includes(filters.typeOfVehicle.toLowerCase())
      );
    }

    // Sort by selected option
    if (filters.sortBy === "latest") {
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (filters.sortBy === "pickup-date") {
      filtered.sort(
        (a, b) =>
          new Date(a.pickupDate).getTime() - new Date(b.pickupDate).getTime()
      );
    } else if (filters.sortBy === "distance") {
      filtered.sort((a, b) => a.approxKms - b.approxKms);
    } else if (filters.sortBy === "weight") {
      filtered.sort((a, b) => a.weight - b.weight);
    }

    setContracts(filtered);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Browse Opportunities
              </h1>
              <p className="text-lg text-muted-foreground">
                Find transportation contracts that match your vehicle and route
                preferences
              </p>
            </div>

            {/* Filters */}
            <Card className="p-6 mb-8 shadow-card">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Location
                  </label>
                  <Input
                    placeholder="Enter city or state"
                    value={filters.location}
                    onChange={(e) =>
                      setFilters({ ...filters, location: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Vehicle Type
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setFilters({ ...filters, typeOfVehicle: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All vehicles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Vehicles</SelectItem>
                      <SelectItem value="V4">4 Wheeler</SelectItem>
                      <SelectItem value="V6">6 Wheeler</SelectItem>
                      <SelectItem value="V10">10 Wheeler</SelectItem>
                      <SelectItem value="V12">12 Wheeler</SelectItem>
                      <SelectItem value="trailer">Trailer Truck</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Sort By
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setFilters({ ...filters, sortBy: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Latest" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="latest">Latest Posted</SelectItem>
                      <SelectItem value="pickup-date">Pickup Date</SelectItem>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="weight">Weight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button className="w-full bg-primary hover:bg-primary/90" onClick={applyFilters}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </Card>

            {/* Contracts List */}
            <div className="space-y-6">
              {contracts.map((contract) => (
                <Card
                  key={contract.id}
                  className="p-6 shadow-card hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-foreground">
                              Contract #{contract.id}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="bg-primary/10 text-primary"
                            >
                        
                              {!contract.goodsCarrier ? "open" : "closed"}
                            </Badge>
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
                          <p className="text-muted-foreground">
                            {contract.contractor.username} • ★{" "}
                            {contract.companyRating}
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Product
                            </p>
                            <p className="font-medium">{contract.type}</p>
                            <p className="text-sm text-muted-foreground">
                              {contract.weight}T
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Route
                            </p>
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
                          <Clock className="w-4 h-4 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Schedule
                            </p>
                            <p className="font-medium text-sm">
                              Pickup:{" "}
                              {new Date(contract.pickupDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </p>
                            <p className="font-medium text-sm">
                              Delivery:{" "}
                              {new Date(contract.dropDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Vehicle
                            </p>
                            <p className="font-medium">
                              {contract.typeOfVehicle}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {contract.bids.length} bids
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[160px]">
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/contract-details/${contract.id}`)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Contracts
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseOpportunities;