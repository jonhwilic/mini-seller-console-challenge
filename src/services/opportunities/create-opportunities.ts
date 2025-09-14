import axios from "axios";

interface CreateOpportunityData {
  name: string;
  stage: string;
  amount?: number;
  accountName: string;
}

export const createOpportunity = async (opportunityData: CreateOpportunityData) => {
  const response = await axios.post(`http://localhost:3000/opportunities`, {
    ...opportunityData,
    id: Date.now(),
  });

  return response.data;
}
