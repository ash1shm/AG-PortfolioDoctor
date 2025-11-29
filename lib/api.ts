import axios from 'axios';
import { PortfolioInput, AnalysisResult } from './types';

// Use environment variable for production backend URL, fallback to localhost for development
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';

export const analyzePortfolio = async (data: PortfolioInput): Promise<AnalysisResult> => {
    const response = await axios.post<AnalysisResult>(`${API_URL}/analyze`, data);
    return response.data;
};
