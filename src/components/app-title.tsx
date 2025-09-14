import { cn } from "@/lib/utils";

export interface AppTitleProps {
  title: string;
  className?: string;
}

export const AppTitle: React.FC<AppTitleProps> = ({ title, className }) => {
  return (
    <h2 className={cn("text-2xl font-bold tracking-tight", className)}>
      {title}
    </h2>
  );
};
