import { Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopNavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const TopNavigation = ({ currentPage, onPageChange }: TopNavigationProps) => {
  const menuItems = [
    {
      title: "Leads",
      url: "leads",
      icon: Users,
      isActive: currentPage === "leads",
    },
    {
      title: "Opportunities",
      url: "opportunities",
      icon: Target,
      isActive: currentPage === "opportunities",
    },
  ];

  return (
    <nav className="top-nav px-4 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-xs sm:text-sm font-bold">SC</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm sm:text-lg font-semibold">Seller Console</span>
            <span className="text-xs text-muted-foreground hidden sm:block">CRM System</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {menuItems.map((item) => (
            <Button
              key={item.url}
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(item.url)}
              className={cn(
                "flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-xs sm:text-sm",
                item.isActive
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <item.icon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{item.title}</span>
            </Button>
          ))}
        </div>
      </div>
    </nav>
  );
};
