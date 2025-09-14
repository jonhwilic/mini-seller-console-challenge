import axios from "axios";

interface CreateLeadData {
  name: string;
  company: string;
  email: string;
  source: string;
  score: number;
  status: string;
}

export const createLead = async (leadData: CreateLeadData) => {
  const response = await axios.post(`http://localhost:3000/leads`, {
    ...leadData,
    id: Date.now(),
  });

  return response.data;
}
