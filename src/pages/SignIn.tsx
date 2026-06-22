import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Building2, Truck, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";

import axios from "axios";

const SignIn = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    contact: "",
    regularPracticeLocation : "",
    upiID: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };


const handleSubmit = async (userType: 'contractor' | 'driver' | 'admin') => {
  try {
    const url = isLogin
      ? 'http://localhost:3000/api/auth/login'
      : 'http://localhost:3000/api/auth/register';

    let payload
    if (userType == "admin") {
      payload = {
        email: formData.email,
        role: userType,
        password: formData.password,
      };
    } else {
      payload = isLogin
        ? {
            email: formData.email,
            role: userType,
            password: formData.password,
          }
        : {
            email: formData.email,
            username: formData.username,
            password: formData.password,
            role: userType,
            contact: formData.contact,
            regularPracticeLocation: formData.regularPracticeLocation,
            upiID: formData.upiID,
          };
    }

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { user, token } = response.data;

    // store token
    localStorage.setItem('token', token);
    localStorage.setItem('role', userType)

    console.log(`${isLogin ? 'Login' : 'Signup'} successful`, user);

    if (userType === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/browse-opportunities');
    }

  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error(
        'Auth error:',
        error.response?.data?.error || error.message
      );
    } else {
      console.error('Unexpected error:', error);
    }
  }
};


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            {/* Back Button */}
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>

            <Card className="p-6 shadow-card">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  {isLogin ? "Welcome Back" : "Create Account"}
                </h1>
                <p className="text-muted-foreground">
                  {isLogin
                    ? "Sign in to your account"
                    : "Choose your account type to get started"}
                </p>
              </div>

              <Tabs defaultValue="company" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger
                    value="company"
                    className="flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    Company
                  </TabsTrigger>
                  <TabsTrigger
                    value="truck-owner"
                    className="flex items-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    Truck Owner
                  </TabsTrigger>
                  <TabsTrigger
                    value="admin"
                    className="flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    Admin
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="company" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    {!isLogin && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Contact Person Name</Label>
                          <Input
                            id="Username"
                            placeholder="Enter full name"
                            value={formData.username}
                            onChange={(e) =>
                              handleInputChange("username", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="contactNumber">Contact Number</Label>
                          <Input
                            id="contactNumber"
                            placeholder="Enter contact number"
                            value={formData.contact}
                            onChange={(e) =>
                              handleInputChange("contact", e.target.value)
                            }
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>
                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          type="text"
                          placeholder="Enter regular practice location"
                          value={formData.regularPracticeLocation}
                          onChange={(e) =>
                            handleInputChange(
                              "regularPracticeLocation",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    )}

                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="upiID">UPI ID</Label>
                        <Input
                          id="upiID"
                          type="text"
                          placeholder="Enter UPI ID (e.g., yourname@upi)"
                          value={formData.upiID}
                          onChange={(e) =>
                            handleInputChange("upiID", e.target.value)
                          }
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                      />
                    </div>

                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                        />
                      </div>
                    )}

                    <Button
                      onClick={() => handleSubmit("contractor")}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {isLogin ? "Sign In" : "Create Company Account"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      *Requires Supabase integration for actual functionality
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="truck-owner" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    {!isLogin && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="ownerName">Full Name</Label>
                          <Input
                            id="username"
                            placeholder="Enter full name"
                            value={formData.username}
                            onChange={(e) =>
                              handleInputChange("username", e.target.value)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="ownerContact">Contact Number</Label>
                          <Input
                            id="ownerContact"
                            placeholder="Enter contact number"
                            value={formData.contact}
                            onChange={(e) =>
                              handleInputChange("contact", e.target.value)
                            }
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="ownerEmail">Email</Label>
                      <Input
                        id="ownerEmail"
                        type="email"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>

                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          type="text"
                          placeholder="Enter regular practice location"
                          value={formData.regularPracticeLocation}
                          onChange={(e) =>
                            handleInputChange(
                              "regularPracticeLocation",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    )}

                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="upiID">UPI ID</Label>
                        <Input
                          id="upiID"
                          type="text"
                          placeholder="Enter UPI ID (e.g., yourname@upi)"
                          value={formData.upiID}
                          onChange={(e) =>
                            handleInputChange("upiID", e.target.value)
                          }
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="ownerPassword">Password</Label>
                      <Input
                        id="ownerPassword"
                        type="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                      />
                    </div>

                    {!isLogin && (
                      <div className="space-y-2">
                        <Label htmlFor="ownerConfirmPassword">
                          Confirm Password
                        </Label>
                        <Input
                          id="ownerConfirmPassword"
                          type="password"
                          placeholder="Confirm password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                        />
                      </div>
                    )}

                    <Button
                      onClick={() => handleSubmit("driver")}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {isLogin ? "Sign In" : "Create Truck Owner Account"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      *Requires Supabase integration for actual functionality
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="admin" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Admin Email</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        placeholder="Enter admin email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="adminPassword">Password</Label>
                      <Input
                        id="adminPassword"
                        type="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                      />
                    </div>

                    <Button
                      onClick={() => handleSubmit("admin")}
                      className="w-full bg-primary hover:bg-primary/90"
                    >
                      {isLogin ? "Sign In as Admin" : "Create Admin Account"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      *Admin access only
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <Separator className="my-6" />

              <div className="text-center">
                <p className="text-muted-foreground">
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </p>
                <Button
                  variant="link"
                  onClick={() => setIsLogin(!isLogin)}
                  className="p-0 h-auto font-medium"
                >
                  {isLogin ? "Create account" : "Sign in instead"}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;