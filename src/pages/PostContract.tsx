import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, MapPin, Package, Truck, Shield, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/axioapi";

const PostContract = () => {
  const [formData, setFormData] = useState({
    productType: "",
    weight: "",
    pickupLocation: "",
    deliveryLocation: "",
    pickupDate: "",
    deliveryDate: "",
    vehicleType: "",
    estimatedKms: "",
    insuranceRequired: false,
    specialInstructions: ""
  });


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const payload = {
      weight: parseFloat(formData.weight),
      pickupDate: formData.pickupDate,
      dropDate: formData.deliveryDate,
      startLocation: formData.pickupLocation,
      endLocation: formData.deliveryLocation,
      approxKms: parseInt(formData.estimatedKms),
      typeOfVehicle: mapVehicleType(formData.vehicleType),
      insured: formData.insuranceRequired,
      type: formData.productType === 'AUTOMOBILE' ? 'AUTOMOBILE' : 'HANDLE_WITH_CARE',
      description : formData.specialInstructions,
    };

    const response = await api.post('/api/contracts', payload);

    console.log('Contract posted successfully:', response.data);
    toast.success('Contract posted successfully!');

    // Reset form
    setFormData({
      productType: "",
      weight: "",
      pickupLocation: "",
      deliveryLocation: "",
      pickupDate: "",
      deliveryDate: "",
      vehicleType: "",
      estimatedKms: "",
      insuranceRequired: false,
      specialInstructions: ""
    });
  } catch (error) {
    console.error('Error posting contract:', error);
    toast.error('Failed to post contract. Please try again.');
  }
};

const mapVehicleType = (value: string): string => {
  const mapping: { [key: string]: string } = {
    '4-wheeler': 'V4',
    '6-wheeler': 'V6',
    '10-wheeler': 'V10',
    '12-wheeler': 'V12',
    'trailer': 'V12'
  };
  return mapping[value] || 'V4';
};

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">Post a Contract</h1>
              <p className="text-lg text-muted-foreground">
                Share your transportation requirements and receive competitive bids from verified transporters
              </p>
            </div>

            <Card className="p-8 shadow-card">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Product Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">Product Information</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="productType">Product Type</Label>
                      <Input
                        id="productType"
                        placeholder="e.g., Electronics, Furniture, Food Items"
                        value={formData.productType}
                        onChange={(e) => setFormData({...formData, productType: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (in tons)</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="e.g., 5"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Location & Schedule */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">Location & Schedule</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="pickupLocation">Pickup Location</Label>
                      <Input
                        id="pickupLocation"
                        placeholder="City, State"
                        value={formData.pickupLocation}
                        onChange={(e) => setFormData({...formData, pickupLocation: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deliveryLocation">Delivery Location</Label>
                      <Input
                        id="deliveryLocation"
                        placeholder="City, State"
                        value={formData.deliveryLocation}
                        onChange={(e) => setFormData({...formData, deliveryLocation: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pickupDate">Pickup Date</Label>
                      <Input
                        id="pickupDate"
                        type="date"
                        value={formData.pickupDate}
                        onChange={(e) => setFormData({...formData, pickupDate: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="deliveryDate">Required Delivery Date</Label>
                      <Input
                        id="deliveryDate"
                        type="date"
                        value={formData.deliveryDate}
                        onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Vehicle Requirements */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Truck className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">Vehicle Requirements</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="vehicleType">Vehicle Type</Label>
                      <Select onValueChange={(value) => setFormData({...formData, vehicleType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4-wheeler">4 Wheeler</SelectItem>
                          <SelectItem value="6-wheeler">6 Wheeler</SelectItem>
                          <SelectItem value="10-wheeler">10 Wheeler</SelectItem>
                          <SelectItem value="12-wheeler">12 Wheeler</SelectItem>
                          <SelectItem value="trailer">Trailer Truck</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="estimatedKms">Estimated Distance (km)</Label>
                      <Input
                        id="estimatedKms"
                        type="number"
                        placeholder="e.g., 500"
                        value={formData.estimatedKms}
                        onChange={(e) => setFormData({...formData, estimatedKms: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Options */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold text-foreground">Additional Options</h2>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="insurance"
                      checked={formData.insuranceRequired}
                      onCheckedChange={(checked) => setFormData({...formData, insuranceRequired: checked as boolean})}
                    />
                    <Label htmlFor="insurance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Insurance Required (Premium will be calculated based on product value)
                    </Label>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialInstructions">Special Instructions</Label>
                    <Textarea
                      id="specialInstructions"
                      placeholder="Any special handling requirements, loading/unloading instructions, etc."
                      rows={3}
                      value={formData.specialInstructions}
                      onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-border">
                  <Button type="button" variant="outline" className="flex-1">
                    Save as Draft
                  </Button>
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                    Post Contract
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostContract;