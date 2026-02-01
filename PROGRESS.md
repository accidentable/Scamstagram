# ScamKeep 프로젝트 진행 상황

> 작성일: 2026-02-01 14:16
> 상태: Railway 배포 준비 중

---

## 1. 프로젝트 개요

**ScamKeep** - AI 기반 스캠 예방 및 커뮤니티 보상 플랫폼

### 핵심 기능
- 🔍 **AI 스캠 리포트**: 스미싱/피싱 이미지 업로드 → Gemini AI 분석 → 위험도 점수 산출
- 📱 **스캠 피드**: 인스타그램 스타일 SNS 피드
- 🎯 **오늘의 퀴즈**: 보안 교육 퀴즈
- 💰 **포인트 시스템**: 신고/퀴즈 활동에 따른 보상

---

## 2. 기술 스택

| 영역 | 기술 |
|------|------|
| **프론트엔드** | React + TypeScript + Vite + TailwindCSS |
| **백엔드** | FastAPI (Python 3.11) |
| **데이터베이스** | SQLite (개발) → PostgreSQL (배포) |
| **AI** | Google Gemini API |
| **인증** | JWT + bcrypt |

---

## 3. 구현 완료 항목 ✅

### 백엔드 (90%)
- [x] FastAPI 앱 구조 (`main.py`, CORS, 라이프사이클)
- [x] SQLAlchemy ORM 모델 (User, Post, Comment, Like, Wallet, ScanResult)
- [x] Pydantic 스키마 (요청/응답)
- [x] JWT 인증 시스템 (`/api/v1/auth`)
- [x] 게시물 CRUD + AI 분석 API (`/api/v1/posts`)
- [x] 지갑/포인트 API (`/api/v1/wallet`)
- [x] Gemini AI 분석 서비스
- [x] 포인트 적립 서비스
- [x] Admin 자동 생성

### 프론트엔드 (95%)
- [x] React + Vite 프로젝트 설정
- [x] 스플래시 화면 (`SplashScreen.tsx`)
- [x] 로그인/회원가입 화면 (`AuthScreen.tsx`)
- [x] 하단 네비게이션 (`Navbar.tsx`)
- [x] 상단 바 + 로그아웃 (`TopBar.tsx`)
- [x] 스캠 피드 (`Feed.tsx`, `PostCard.tsx`)
- [x] 스캠 신고 화면 (`Report.tsx`)
- [x] 퀴즈 화면 (`Quiz.tsx`)
- [x] 지갑 화면 (`Wallet.tsx`)
- [x] API 환경변수 설정 (`VITE_API_BASE`)

---

## 4. 미완료 항목 ⏳

- [ ] 퀴즈 백엔드 API (`/api/v1/quiz`)
- [ ] 보상 상점 API
- [ ] 프론트엔드 ↔ 백엔드 실제 연동 (현재 Mock 데이터)
- [ ] 이미지 업로드 연동
- [ ] Railway 배포

---

## 5. 디렉토리 구조

```
scamstagram/
├── backend/
│   ├── main.py                 # FastAPI 앱
│   ├── Dockerfile              # 컨테이너 배포용
│   ├── requirements.txt
│   ├── .env
│   └── app/
│       ├── config.py           # 설정
│       ├── database.py         # DB 연결
│       ├── models/             # ORM 모델
│       ├── schemas/            # Pydantic 스키마
│       ├── api/v1/             # API 라우터
│       ├── services/           # 비즈니스 로직
│       └── core/               # 보안 유틸
│
└── frontend/
    ├── App.tsx                 # 메인 앱
    ├── index.html
    ├── vite.config.ts
    ├── .env.local              # API URL 설정
    └── components/
        ├── SplashScreen.tsx
        ├── AuthScreen.tsx
        ├── TopBar.tsx
        ├── Navbar.tsx
        ├── Feed.tsx
        ├── PostCard.tsx
        ├── Report.tsx
        ├── Quiz.tsx
        └── Wallet.tsx
```

---

## 6. 로컬 실행 방법

### 백엔드
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
→ http://localhost:8000/docs

### 프론트엔드
```bash
cd frontend
npm install
npm run dev
```
→ http://localhost:3000

### 테스트 계정
- Email: `admin@scamstagram.com`
- Password: `admin123`

---

## 7. 배포 계획 (Railway)

### 프론트엔드
1. GitHub에 푸시
2. Railway에서 `frontend/` 디렉토리 연결
3. Build: `npm run build`, Output: `dist`

### 백엔드
1. GitHub에 푸시
2. Railway에서 `backend/` 디렉토리 연결
3. PostgreSQL 플러그인 추가
4. 환경변수 설정

### 필요한 환경변수 (백엔드)
```env
DATABASE_URL=postgresql://...  # Railway가 자동 제공
JWT_SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-key
ADMIN_EMAIL=admin@scamstagram.com
ADMIN_PASSWORD=admin123
ADMIN_USERNAME=admin
```

---

## 8. 변경 이력

| 날짜 | 내용 |
|------|------|
| 2026-02-01 | 프로젝트 초기 구현 완료 |
| 2026-02-01 | SQLite → PostgreSQL 호환 모델 수정 |
| 2026-02-01 | 로그인/스플래시 화면 추가 |
| 2026-02-01 | Railway 배포 준비 |
