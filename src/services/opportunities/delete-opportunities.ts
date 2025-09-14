import axios from "axios";

export const deleteOpportunity = async (id: number) => {
  const response = await axios.delete(`http://localhost:3000/opportunities/${id}`);

  return response.data;
}
