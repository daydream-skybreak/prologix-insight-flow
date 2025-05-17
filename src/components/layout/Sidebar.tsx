
import { Link, useLocation } from "react-router-dom";
import { 
  Package, 
  Truck, 
  Store, 
  User, 
  BarChart, 
  AlertCircle, 
  Search,
  Scan,
  Settings,
  LineChart,
    Map
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const location = useLocation();
  
  const sidebarLinks = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: BarChart
    },
    {
      title: "Products",
      href: "/products",
      icon: Package
    },
    {
      title: "Store",
      href: "/store",
      icon: Store
    },
    {
      title: "Logistics",
      href: "/logistics",
      icon: Truck
    },
    {
      title: "User Management",
      href: "/users",
      icon: User
    },
    {
      title: "Scan Products",
      href: "/scan",
      icon: Scan
    },
    {
      title: "Customer Feedback",
      href: "/feedback",
      icon: AlertCircle
    },
    {
      title: "Feedback Analytics",
      href: "/feedback-analytics",
      icon: LineChart
    },
    {
      title: "Scan Products",
      href: "/scan",
      icon: Scan
    },
    {
      title: "Map Visual",
      href: "/mapvisual",
      icon: Map
    }
  ];
  
  return (
    <aside className={cn(
      "z-20 flex w-64 flex-col border-r bg-background transition-transform duration-300",
      isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}>
      <div className="border-b p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-prologix-blue p-1">
            <Package className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl">ProLogiX</span>
        </div>
        <div className="relative mt-4 rounded-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search..."
            className="w-full rounded-md border border-input bg-background pl-8 py-2 text-sm ring-offset-background"
          />
        </div>
      </div>
      
      <nav className="flex-1 overflow-auto p-4">
        <div className="space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = location.pathname === link.href;
            
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "transparent"
                )}
              >
                <link.icon className="mr-2 h-4 w-4" />
                <span>{link.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      
      <div className="border-t p-4">
        <Button variant="outline" className="w-full justify-start">
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
