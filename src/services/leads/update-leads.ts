import axios from "axios";

interface UpdateLeadData {
  id: number | string;
  name?: string;
  company?: string;
  email?: string;
  source?: string;
  score?: number;
  status?: string;
}

export const updateLead = async (leadData: UpdateLeadData) => {
  const { id, ...updateData } = leadData;

  const response = await axios.patch(`http://localhost:3000/leads/${id}`, updateData);

  return response.data;
}

