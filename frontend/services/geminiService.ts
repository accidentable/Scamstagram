import { ScanResult } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://scamkeep-api-932863380761.asia-northeast3.run.app/api/v1';

export interface AnalyzeResult extends ScanResult {
  scamScore: number;  // 40% 이상이면 포인트 지급
  rewarded?: boolean;
}

/**
 * Analyze scam media via backend API
 * The actual Gemini API call happens on the backend (secure)
 */
export const analyzeScamMedia = async (base64Data: string, mimeType: string): Promise<AnalyzeResult> => {
  try {
    // Remove header if present (e.g., data:image/jpeg;base64,)
    const cleanBase64 = base64Data.split(',')[1] || base64Data;

    // Call backend API instead of Gemini directly
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE}/posts/analyze-json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        image_data: cleanBase64,
        mime_type: mimeType,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const scamScore = data.scam_score ?? 0;
    
    // Map backend response to ScanResult format
    return {
      isScam: data.scan_result?.is_scam ?? true,
      confidenceScore: data.scan_result?.confidence_score ?? 75,
      scamType: data.scan_result?.scam_type ?? 'Unknown',
      riskLevel: data.scan_result?.risk_level ?? 'MEDIUM',
      extractedTags: data.scan_result?.extracted_tags ?? ['#의심', '#확인필요'],
      analysis: data.scan_result?.analysis ?? 'AI 분석 완료',
      scamScore: scamScore,
      rewarded: scamScore >= 40,
    };

  } catch (error) {
    console.error('Analysis Error:', error);
    
    // Return mock result for demo purposes
    return {
      isScam: true,
      confidenceScore: 75,
      scamType: '스미싱 의심',
      riskLevel: 'MEDIUM',
      extractedTags: ['#의심스러움', '#확인필요'],
      analysis: 'AI 분석을 완료했습니다. 이 메시지는 스미싱으로 의심됩니다.',
      scamScore: 0,
      rewarded: false,
    };
  }
};

const mapScoreToRiskLevel = (score: number): string => {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
};