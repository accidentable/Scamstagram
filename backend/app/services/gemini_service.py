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

    prompt = """Analyze this image for potential scam or phishing content.
    Return a JSON object with the following fields:
    - isScam: boolean (true if this appears to be a scam)
    - confidenceScore: number (0-100, how confident you are)
    - scamType: string (e.g., "Voice Phishing", "Smishing", "Investment Scam", "Romance Scam", "Safe")
    - riskLevel: string (must be one of: "LOW", "MEDIUM", "HIGH", "CRITICAL")
    - extractedTags: string array (max 3 relevant tags like "Urgent", "Bank", "Family")
    - analysis: string (2-3 sentence Korean explanation of why this is or isn't a scam)

    Respond ONLY with valid JSON, no markdown formatting."""

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
