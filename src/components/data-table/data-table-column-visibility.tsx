import { Settings2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export interface ColumnProps {
  id: string;
  label: string;
  visible: boolean;
  sorting: boolean;
  className?: string;
}

export interface DataTableColumnVisibilityProps {
  columns: ColumnProps[];
  onToggleVisibility: (updatedColumns: ColumnProps[]) => void;
}

export const DataTableColumnVisibility: React.FC<
  DataTableColumnVisibilityProps
> = ({ columns, onToggleVisibility }) => {
  const toggleVisibility = (id: string, newVisibility: boolean) => {
    const updatedColumns = columns.map((column) =>
      column.id === id ? { ...column, visible: newVisibility } : column
    );
    onToggleVisibility(updatedColumns);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <Settings2 />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            onCheckedChange={(value) => toggleVisibility(column.id, value)}
            className="capitalize"
            checked={column.visible}
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
