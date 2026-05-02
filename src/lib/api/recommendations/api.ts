import axios from "axios";

export interface Recommendation {
  id: number;
  name: string;
  score: number;
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
}

export async function getRecommendations(researcherId: number, topK = 5): Promise<Recommendation[]> {
  const mlApiUrl = process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:8000";
  const response = await axios.post<RecommendationResponse>(`${mlApiUrl}/recommend`, {
    researcher_id: researcherId,
    top_k: topK,
  });
  return response.data.recommendations;
}
