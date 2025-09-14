import React from "react";
import { OpportunitiesDataTable } from "./opportunities-data-table";

export const OpportunitiesPage: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <OpportunitiesDataTable />
    </div>
  );
};
