import axios from "axios";

export const findLeads = async (search: string) => {
  const term = (search || "").trim();
  
  const response = await axios.get(`http://localhost:3000/leads`, {
    params: {
      q: term.length > 0 ? term : undefined,
      _sort: 'score',
      _order: 'desc',
    }
  });

  return response.data;
}
