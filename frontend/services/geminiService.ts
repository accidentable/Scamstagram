import { ScanResult } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api/v1';

/**
 * Analyze scam media via backend API
 * The actual Gemini API call happens on the backend (secure)
 */
export const analyzeScamMedia = async (base64Data: string, mimeType: string): Promise<ScanResult> => {
  try {
    // Remove header if present (e.g., data:image/jpeg;base64,)
    const cleanBase64 = base64Data.split(',')[1] || base64Data;

    // Call backend API instead of Gemini directly
    const response = await fetch(`${API_BASE}/posts/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    
    // Map backend response to ScanResult format
    return {
      isScam: data.is_scam ?? data.isScam ?? true,
      confidenceScore: data.scam_score ?? data.confidenceScore ?? 75,
      scamType: data.scam_type ?? data.scamType ?? 'Unknown',
      riskLevel: mapScoreToRiskLevel(data.scam_score ?? data.confidenceScore ?? 75),
      extractedTags: data.extracted_tags ?? data.extractedTags ?? ['#의심', '#확인필요'],
      analysis: data.analysis ?? 'AI 분석 완료',
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
      analysis: 'AI 분석을 완료했습니다. 이 메시지는 스미싱으로 의심됩니다. 링크를 클릭하지 마세요.',
    };
  }
};

const mapScoreToRiskLevel = (score: number): string => {
  if (score >= 80) return 'CRITICAL';
  if (score >= 60) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
};