import axios from "axios";

export const deleteLead = async (id: number) => {
  const response = await axios.delete(`http://localhost:3000/leads/${id}`);

  return response.data;
}
