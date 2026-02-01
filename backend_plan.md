# ScamStagram 백엔드 구현 계획서

> 작성일: 2026-02-01
> 상태: 구현 완료

---

## 1. 개요

FastAPI + PostgreSQL 기반 백엔드 구축

### 요구사항
1. **사용자 인증**: 일반 회원가입 + admin 계정 (미리 생성)
2. **이미지 업로드**: 로컬 파일시스템 저장 (`uploads/`)
3. **AI 자동 분석**: Gemini API로 위험도+빈번도 기반 0~100점 산출

---

## 2. 디렉토리 구조

```
backend/
├── main.py                     # FastAPI 앱 진입점, CORS, admin 생성
├── requirements.txt            # Python 의존성
├── .env                        # 환경변수 설정
├── uploads/images/             # 이미지 저장 폴더
└── app/
    ├── __init__.py
    ├── config.py               # Pydantic Settings 기반 설정 관리
    ├── database.py             # SQLAlchemy async 엔진, 세션 관리
    │
    ├── models/                 # SQLAlchemy ORM 모델
    │   ├── __init__.py
    │   ├── user.py             # User 모델
    │   ├── post.py             # Post 모델
    │   ├── comment.py          # Comment, Like 모델
    │   ├── scan_result.py      # ScanResult 모델 (AI 분석 결과)
    │   └── wallet.py           # Wallet, WalletTransaction, DailyActivity
    │
    ├── schemas/                # Pydantic 스키마 (요청/응답)
    │   ├── __init__.py
    │   ├── auth.py             # UserRegister, UserLogin, Token
    │   ├── user.py             # UserResponse, UserPublic
    │   ├── post.py             # PostResponse, ScanResultResponse
    │   └── wallet.py           # WalletResponse, WalletDetailResponse
    │
    ├── api/
    │   ├── __init__.py
    │   ├── deps.py             # 의존성 (get_current_user, get_current_admin)
    │   ├── router.py           # 라우터 통합
    │   └── v1/
    │       ├── __init__.py
    │       ├── auth.py         # 회원가입/로그인 API
    │       ├── posts.py        # 게시물 CRUD + AI 분석 API
    │       └── wallet.py       # 지갑/포인트 API
    │
    ├── services/               # 비즈니스 로직
    │   ├── __init__.py
    │   ├── gemini_service.py   # Gemini AI 분석 서비스
    │   └── wallet_service.py   # 포인트 적립/차감 서비스
    │
    └── core/                   # 핵심 유틸리티
        ├── __init__.py
        └── security.py         # JWT 토큰, 비밀번호 해싱 (bcrypt)
```

---

## 3. 데이터베이스 스키마 (PostgreSQL)

### 3.1 users 테이블
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| username | VARCHAR(50) | 유니크, 필수 |
| email | VARCHAR(255) | 유니크, 필수 |
| hashed_password | VARCHAR(255) | bcrypt 해시 |
| avatar | VARCHAR(500) | 프로필 이미지 URL |
| level | INTEGER | 사용자 레벨 (기본값: 1) |
| is_verified | BOOLEAN | 인증 여부 |
| is_admin | BOOLEAN | 관리자 여부 |
| created_at | TIMESTAMP | 생성 시간 |
| updated_at | TIMESTAMP | 수정 시간 |

### 3.2 posts 테이블
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| user_id | UUID | FK → users |
| image_url | VARCHAR(500) | 이미지 경로 |
| description | TEXT | 설명 |
| scam_type | VARCHAR(100) | 스캠 유형 (AI 분류) |
| tags | TEXT[] | 태그 배열 |
| scam_score | INTEGER | AI 점수 (0-100) |
| like_count | INTEGER | 좋아요 수 |
| comment_count | INTEGER | 댓글 수 |
| is_verified_scam | BOOLEAN | 검증된 스캠 여부 |
| created_at | TIMESTAMP | 생성 시간 |

### 3.3 scan_results 테이블
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| post_id | UUID | FK → posts (1:1) |
| is_scam | BOOLEAN | 스캠 여부 |
| confidence_score | INTEGER | 신뢰도 (0-100) |
| scam_type | VARCHAR(100) | 스캠 유형 |
| risk_level | VARCHAR(20) | LOW/MEDIUM/HIGH/CRITICAL |
| extracted_tags | TEXT[] | 추출된 태그 |
| analysis | TEXT | AI 분석 설명 |
| created_at | TIMESTAMP | 분석 시간 |

### 3.4 wallets 테이블
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| user_id | UUID | FK → users (1:1) |
| balance | INTEGER | 포인트 잔액 |
| total_reports | INTEGER | 총 신고 수 |
| total_quizzes | INTEGER | 총 퀴즈 완료 수 |
| created_at | TIMESTAMP | 생성 시간 |

### 3.5 wallet_transactions 테이블
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| wallet_id | UUID | FK → wallets |
| amount | INTEGER | 포인트 변동량 |
| type | VARCHAR(50) | report/quiz/social_like/social_comment |
| description | TEXT | 설명 |
| created_at | TIMESTAMP | 거래 시간 |

### 3.6 daily_activities 테이블 (1일 1회 제한)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| user_id | UUID | FK → users |
| activity_type | VARCHAR(50) | report/quiz |
| activity_date | DATE | 활동 날짜 |
| UNIQUE | - | (user_id, activity_type, activity_date) |

### 3.7 comments 테이블
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| post_id | UUID | FK → posts |
| user_id | UUID | FK → users |
| content | TEXT | 댓글 내용 |
| created_at | TIMESTAMP | 작성 시간 |

### 3.8 likes 테이블
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| post_id | UUID | FK → posts |
| user_id | UUID | FK → users |
| UNIQUE | - | (post_id, user_id) |

---

## 4. API 엔드포인트

### 4.1 인증 API (`/api/v1/auth`)
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | `/register` | 회원가입 | X |
| POST | `/login` | 로그인 (JWT 발급) | X |
| GET | `/me` | 현재 유저 정보 조회 | O |

### 4.2 게시물 API (`/api/v1/posts`)
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/` | 피드 조회 (페이지네이션) | O |
| POST | `/` | 이미지 업로드 + AI 분석 + 게시 | O |
| POST | `/analyze` | 미리보기 분석 (게시 안함) | O |
| GET | `/{post_id}` | 게시물 상세 조회 | O |
| POST | `/{post_id}/like` | 좋아요 토글 | O |
| GET | `/{post_id}/comments` | 댓글 목록 | O |
| POST | `/{post_id}/comments` | 댓글 작성 | O |
| GET | `/stats/trending` | 트렌딩 스캠 유형 | O |
| GET | `/stats/summary` | 전체 통계 | O |

### 4.3 지갑 API (`/api/v1/wallet`)
| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | `/` | 지갑 정보 + 주간 히스토리 | O |
| GET | `/status` | 오늘의 활동 상태 확인 | O |

---

## 5. AI 점수 산출 로직

```python
def calculate_scam_score(risk_level: str, confidence_score: int) -> int:
    """
    위험도(risk_level) + 신뢰도(confidence_score) 기반 최종 점수 산출

    Args:
        risk_level: LOW, MEDIUM, HIGH, CRITICAL
        confidence_score: 0-100 (AI가 판단한 확신도)

    Returns:
        0-100 사이의 최종 스캠 점수
    """
    risk_weights = {
        "CRITICAL": 1.0,   # 100% 반영
        "HIGH": 0.8,       # 80% 반영
        "MEDIUM": 0.5,     # 50% 반영
        "LOW": 0.2,        # 20% 반영
    }
    weight = risk_weights.get(risk_level.upper(), 0.5)
    return int(confidence_score * weight)
```

### 예시
| risk_level | confidence_score | 최종 점수 |
|------------|------------------|-----------|
| CRITICAL | 95 | 95 |
| HIGH | 90 | 72 |
| MEDIUM | 80 | 40 |
| LOW | 70 | 14 |

---

## 6. 포인트 보상 시스템

| 활동 유형 | 보상 포인트 | 제한 |
|----------|------------|------|
| 스캠 신고 | 100P | 1일 1회 |
| 퀴즈 정답 | 50P | 문제당 |
| 좋아요 받기 | 5P | 무제한 |
| 댓글 받기 | 10P | 무제한 |

---

## 7. 환경 변수 설정 (.env)

```env
# Database
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/scamstagram

# JWT
JWT_SECRET_KEY=your-super-secret-jwt-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key-here

# File Upload
UPLOAD_DIR=uploads/images

# Admin Account (자동 생성됨)
ADMIN_EMAIL=admin@scamstagram.com
ADMIN_PASSWORD=admin123
ADMIN_USERNAME=admin
```

---

## 8. 실행 방법

### 8.1 사전 요구사항
- Python 3.11+
- PostgreSQL 15+
- Gemini API Key (선택사항)

### 8.2 설치 및 실행

```bash
# 1. 백엔드 폴더로 이동
cd backend

# 2. 가상환경 생성 및 활성화
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux

# 3. 의존성 설치
pip install -r requirements.txt

# 4. PostgreSQL에 데이터베이스 생성
# psql -U postgres
# CREATE DATABASE scamstagram;

# 5. .env 파일 수정 (실제 값 입력)

# 6. 서버 실행
python main.py
# 또는: uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 8.3 접속
- API 서버: http://localhost:8000
- Swagger 문서: http://localhost:8000/docs
- ReDoc 문서: http://localhost:8000/redoc

---

## 9. Admin 계정

서버 시작 시 자동으로 admin 계정이 생성됩니다.

| 항목 | 값 |
|------|-----|
| Email | admin@scamstagram.com |
| Password | admin123 |
| Level | 10 |
| 초기 포인트 | 10,000P |

---

## 10. 프론트엔드 연동 참고

### API 호출 예시 (TypeScript)

```typescript
const API_BASE = 'http://localhost:8000/api/v1';

// 로그인
const login = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const { access_token } = await res.json();
  localStorage.setItem('token', access_token);
};

// 이미지 업로드 + AI 분석
const uploadPost = async (file: File, description: string) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('description', description);

  const res = await fetch(`${API_BASE}/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: formData
  });
  return res.json();
};
```

---

## 11. 향후 확장 계획

- [ ] 퀴즈 API (`/api/v1/quiz`)
- [ ] 보상 상점 API (`/api/v1/rewards`)
- [ ] Admin 전용 API (`/api/v1/admin`)
- [ ] 이미지 리사이징/최적화
- [ ] Redis 캐싱
- [ ] 푸시 알림
- [ ] 프론트엔드 API 연동
