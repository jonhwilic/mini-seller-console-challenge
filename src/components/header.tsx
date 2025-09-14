import { cn } from "@/lib/utils";

export interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ children, className }) => {
  return (
    <header className={cn("flex justify-between items-center py-4 px-6 border-b bg-background", className)}>
      {children}
    </header>
  );
};
