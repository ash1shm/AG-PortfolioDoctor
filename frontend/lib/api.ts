import axios from 'axios';
import { PortfolioInput, AnalysisResult } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const analyzePortfolio = async (data: PortfolioInput): Promise<AnalysisResult> => {
    const response = await axios.post<AnalysisResult>(`${API_URL}/analyze`, data);
    return response.data;
};
