import google.generativeai as genai
from typing import Optional
from pydantic import BaseModel
from app.config import settings


class ScanResultData(BaseModel):
    is_scam: bool
    confidence_score: int
    scam_type: str
    risk_level: str  # LOW, MEDIUM, HIGH, CRITICAL
    extracted_tags: list[str]
    analysis: str


def calculate_scam_score(risk_level: str, confidence_score: int) -> int:
    """Calculate final scam score based on risk level and confidence"""
    risk_weights = {
        "CRITICAL": 1.0,
        "HIGH": 0.8,
        "MEDIUM": 0.5,
        "LOW": 0.2,
    }
    weight = risk_weights.get(risk_level.upper(), 0.5)
    return int(confidence_score * weight)


async def analyze_scam_image(base64_data: str, mime_type: str) -> ScanResultData:
    """Analyze image for potential scam content using Gemini AI"""

    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your-gemini-api-key-here":
        # Return mock result if no API key
        return ScanResultData(
            is_scam=True,
            confidence_score=75,
            scam_type="Suspicious Content",
            risk_level="MEDIUM",
            extracted_tags=["Unknown", "ReviewRequired"],
            analysis="API key not configured. This is a placeholder analysis."
        )

    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.0-flash")

    prompt = """이 이미지에서 스캠/피싱 콘텐츠가 있는지 분석해주세요.
    다음 필드를 포함한 JSON 객체로 응답해주세요:
    - isScam: boolean (스캠으로 보이면 true)
    - confidenceScore: number (0-100, 확신도)
    - scamType: string (예: "보이스피싱", "스미싱", "투자사기", "로맨스스캠", "안전")
    - riskLevel: string (반드시 다음 중 하나: "LOW", "MEDIUM", "HIGH", "CRITICAL")
    - extractedTags: string array (최대 3개, 한국어 태그, 예: "택배", "은행", "가족사칭")
    - analysis: string (왜 이것이 스캠인지 또는 안전한지 2-3문장으로 한국어로 설명)

    반드시 유효한 JSON만 응답하고, 마크다운 포맷팅 없이 응답하세요."""

    try:
        # Remove data URL prefix if present
        if "," in base64_data:
            base64_data = base64_data.split(",")[1]

        print(f"[Gemini] Calling API with mime_type: {mime_type}, data length: {len(base64_data)}")
        
        response = model.generate_content([
            {"mime_type": mime_type, "data": base64_data},
            prompt
        ])

        print(f"[Gemini] Response received: {response.text[:200] if response.text else 'No text'}")

        import json
        result_text = response.text.strip()
        # Remove markdown code blocks if present
        if result_text.startswith("```"):
            result_text = result_text.split("```")[1]
            if result_text.startswith("json"):
                result_text = result_text[4:]

        result = json.loads(result_text)
        print(f"[Gemini] Parsed result: {result}")

        return ScanResultData(
            is_scam=result.get("isScam", True),
            confidence_score=min(100, max(0, int(result.get("confidenceScore", 50)))),
            scam_type=result.get("scamType", "Unknown"),
            risk_level=result.get("riskLevel", "MEDIUM").upper(),
            extracted_tags=result.get("extractedTags", [])[:3],
            analysis=result.get("analysis", "Analysis completed.")
        )

    except Exception as e:
        import traceback
        print(f"[Gemini] ERROR: {type(e).__name__}: {e}")
        print(f"[Gemini] Traceback: {traceback.format_exc()}")
        return ScanResultData(
            is_scam=True,
            confidence_score=60,
            scam_type="Suspicious Content",
            risk_level="MEDIUM",
            extracted_tags=["Error", "ManualReview"],
            analysis=f"AI 분석 중 오류가 발생했습니다. 수동 검토가 필요합니다."
        )


async def generate_post_description(scan_result: ScanResultData) -> str:
    """Generate a post description based on scan result using AI"""
    
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your-gemini-api-key-here":
        return f"'{scan_result.scam_type}' 유형의 스캠으로 의심됩니다. 주의하세요!"
    
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel("gemini-2.0-flash")
    
    prompt = f"""다음 스캠 분석 결과를 바탕으로 SNS 피드에 올릴 짧은 경고 글을 작성해주세요.

스캠 유형: {scan_result.scam_type}
위험도: {scan_result.risk_level}
분석 내용: {scan_result.analysis}
태그: {', '.join(scan_result.extracted_tags)}

요구사항:
- 1-2문장으로 간결하게 작성
- 다른 사용자들에게 경고하는 톤
- 한국어로 작성
- 이모지 사용 가능
- 절대 링크 클릭하지 말라는 경고 포함

글만 작성하세요, 다른 설명 없이."""

    try:
        response = model.generate_content(prompt)
        description = response.text.strip()
        # 너무 길면 자르기
        if len(description) > 200:
            description = description[:197] + "..."
        return description
    except Exception as e:
        print(f"[Gemini] Generate description error: {e}")
        return f"⚠️ '{scan_result.scam_type}' 스캠 주의! 절대 링크를 클릭하지 마세요."
