import { Button } from "@/components/ui/button";
import { Truck, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem("token")

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-primary rounded-lg p-2">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">BulkWay</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
           {localStorage.getItem("role") == "contractor" && <Link to="/post-contract" className={`transition-colors ${location.pathname === '/post-contract' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>Post Contract</Link>}
            {localStorage.getItem("role") == "driver" && <Link to="/browse-opportunities" className={`transition-colors ${location.pathname === '/browse-opportunities' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}>Browse Opportunities</Link>}
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            {token ? (
              <>
                {localStorage.getItem("role") === "admin" ? (
                  <Button variant="outline" asChild>
                    <Link to="/admin/dashboard" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Admin
                    </Link>
                  </Button>
                ) : (
                  <Button variant="outline" asChild>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                    </Link>
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="ghost" asChild><Link to="/sign-in">Sign In</Link></Button>
                <Button className="bg-gradient-primary text-white hover:shadow-lg" asChild><Link to="/get-started">Get Started</Link></Button>
              </>
            )}
          </div>
          
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
          </button>
        </div>
        
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              {localStorage.getItem("role") == "contractor" &&  <Link to="/post-contract" className={`transition-colors ${location.pathname === '/post-contract' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`} onClick={() => setIsMenuOpen(false)}>Post Contract</Link>}
              {localStorage.getItem("role") == "driver" && <Link to="/browse-opportunities" className={`transition-colors ${location.pathname === '/browse-opportunities' ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`} onClick={() => setIsMenuOpen(false)}>Browse Opportunities</Link>}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {token ? (
                  <>
                    {localStorage.getItem("role") === "admin" ? (
                      <Button variant="outline" className="justify-start" asChild>
                        <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)}>
                          <User className="w-4 h-4 mr-2" /> Admin Dashboard
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="outline" className="justify-start" asChild>
                        <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                          <User className="w-4 h-4 mr-2" /> Profile
                        </Link>
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start" asChild><Link to="/sign-in">Sign In</Link></Button>
                    <Button className="bg-gradient-primary text-white justify-start" asChild><Link to="/get-started">Get Started</Link></Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
