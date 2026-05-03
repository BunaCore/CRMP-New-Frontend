import axios from "axios";

export interface Recommendation {
  id: string;
  name: string;
  score: number;
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
}

export async function getRecommendations(researcherId: string, topK = 5): Promise<Recommendation[]> {
  const mlApiUrl = process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:8001";
  const response = await axios.post<RecommendationResponse>(`${mlApiUrl}/recommend`, {
    researcher_id: researcherId,
    top_k: topK,
  });
  return response.data.recommendations;
}

export async function searchMembersML(query: string, topK = 10): Promise<Recommendation[]> {
  const mlApiUrl = process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:8001";
  const response = await axios.post<RecommendationResponse>(`${mlApiUrl}/search/members`, {
    query,
    top_k: topK,
  });
  return response.data.recommendations;
}
