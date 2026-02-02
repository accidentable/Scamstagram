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
    console.log('[Frontend] Calling analyze-json API...');
    console.log('[Frontend] Token exists:', !!token);
    console.log('[Frontend] Base64 length:', cleanBase64.length);
    
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

    console.log('[Frontend] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Frontend] API Error response:', errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('[Frontend] API Response:', JSON.stringify(data, null, 2));
    
    // 백엔드 응답 구조: { scan_result: {...}, scam_score: number }
    const scamScore = data.scam_score ?? 0;
    const scanResult = data.scan_result ?? {};
    
    console.log('[Frontend] Parsed scamScore:', scamScore);
    console.log('[Frontend] Parsed scanResult:', scanResult);
    
    return {
      isScam: scanResult.is_scam ?? true,
      confidenceScore: scanResult.confidence_score ?? 75,
      scamType: scanResult.scam_type ?? 'Unknown',
      riskLevel: scanResult.risk_level ?? 'MEDIUM',
      extractedTags: scanResult.extracted_tags ?? ['#의심', '#확인필요'],
      analysis: scanResult.analysis ?? 'AI 분석 완료',
      scamScore: scamScore,
      rewarded: scamScore >= 40,
    };

  } catch (error) {
    console.error('[Frontend] Analysis Error:', error);
    
    // Return error result - scamScore stays 0 to indicate failure
    return {
      isScam: false,
      confidenceScore: 0,
      scamType: '분석 실패',
      riskLevel: 'LOW',
      extractedTags: ['#오류', '#재시도필요'],
      analysis: `분석 중 오류가 발생했습니다: ${error instanceof Error ? error.message : 'Unknown error'}`,
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