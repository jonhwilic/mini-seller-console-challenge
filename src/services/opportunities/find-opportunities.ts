import axios from "axios";

export const findOpportunities = async (search: string) => {
  const term = (search || "").trim();
  
  const [opportunitiesResponse, leadsResponse] = await Promise.all([
    axios.get(`http://localhost:3000/opportunities`, {
      params: {
        q: term.length > 0 ? term : undefined,
        _sort: 'id',
        _order: 'desc',
      }
    }),
    axios.get(`http://localhost:3000/leads`, {
      params: {
        status: 'Converted',
        q: term.length > 0 ? term : undefined,
        _sort: 'id',
        _order: 'desc',
      }
    })
  ]);

  const opportunities = opportunitiesResponse.data || [];
  const convertedLeads = leadsResponse.data || [];

  const convertedLeadsAsOpportunities = convertedLeads.map((lead: { id: number; name: string; company: string; email: string; source: string; score: number; status: string; }) => ({
    id: lead.id,
    name: lead.name,
    stage: "Converted Lead",
    amount: undefined,
    accountName: lead.company,
    isConvertedLead: true,
    originalLead: lead
  }));

  const allOpportunities = [...opportunities, ...convertedLeadsAsOpportunities];
  
  return allOpportunities.sort((a, b) => b.id - a.id);
}
