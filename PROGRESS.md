# ScamKeep 프로젝트 현황

> 마지막 업데이트: 2026-02-01 18:32

---

## 🎯 프로젝트 개요

**ScamKeep** - AI 기반 스캠 예방 플랫폼

| 핵심 기능 | 설명 |
|-----------|------|
| 🔍 AI 스캠 분석 | 스미싱/피싱 이미지 → Gemini AI 분석 → 위험도 점수 |
| 📱 스캠 피드 | 신고된 스캠 사례 SNS 스타일 공유 |
| 🎯 보안 퀴즈 | 스캠 예방 교육 퀴즈 |
| 💰 포인트 시스템 | 활동 보상 |

---

## 🛠 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React + TypeScript + Vite + TailwindCSS |
| Backend | FastAPI (Python 3.11) |
| Database | PostgreSQL (Railway) |
| AI | Google Gemini API |
| 배포 | Railway |

---

## 📊 진행 상황

```
백엔드 구현  ████████████████████ 100%
프론트엔드   ████████████████████ 100%
Railway 배포 ██████░░░░░░░░░░░░░░  30% ← 현재
```

### 배포 이슈
- **빌드**: ✅ 성공
- **헬스체크**: ❌ 실패
- **원인**: PostgreSQL 연결 필요

---

## 📁 프로젝트 구조

```
scamstagram/
├── backend/           # FastAPI 백엔드
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── Procfile
│   ├── nixpacks.toml
│   └── app/
│       ├── api/v1/    # API 라우터
│       ├── models/    # ORM 모델
│       ├── schemas/   # Pydantic 스키마
│       └── services/  # 비즈니스 로직
│
└── frontend/          # React 프론트엔드
    ├── App.tsx
    ├── vite.config.ts
    └── components/
```

---

## 🚀 다음 단계

1. **Railway에 PostgreSQL 추가**
2. **환경변수 설정** (DATABASE_URL, JWT_SECRET_KEY, GEMINI_API_KEY)
3. **백엔드 재배포**
4. **프론트엔드 배포**
5. **최종 테스트**

---

## 🔑 필수 환경변수

### Backend (Railway)
```env
DATABASE_URL=postgresql+asyncpg://...  # Railway PostgreSQL 자동 제공
JWT_SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-key
ADMIN_EMAIL=admin@scamstagram.com
ADMIN_PASSWORD=admin123
```

### Frontend
```env
VITE_API_BASE=https://your-backend.railway.app/api/v1
```

---

## 📝 테스트 계정

- Email: `admin@scamstagram.com`
- Password: `admin123`
