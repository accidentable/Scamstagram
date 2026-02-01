import { Post, User, WalletData, RewardItem, QuizQuestion } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  username: '스캠헌터99',
  avatar: 'https://picsum.photos/seed/neo/200/200',
  level: 3,
  isVerified: true,
};

export const INITIAL_WALLET: WalletData = {
  balance: 850,
  todayReported: false,
  todayQuizCompleted: false,
  totalReports: 12,
  totalQuizzes: 28,
  history: [
    { day: '월', amount: 100, type: 'report' },
    { day: '화', amount: 50, type: 'quiz' },
    { day: '수', amount: 150, type: 'social' },
    { day: '목', amount: 100, type: 'report' },
    { day: '금', amount: 50, type: 'quiz' },
  ]
};

export const REWARD_ITEMS: RewardItem[] = [
  { id: '1', name: '스타벅스 아메리카노', description: '따뜻한 커피 한 잔', price: 500, icon: '☕', category: 'voucher' },
  { id: '2', name: 'CU 편의점 5천원권', description: '편의점 상품권', price: 800, icon: '🏪', category: 'voucher' },
  { id: '3', name: '경찰청 감사장', description: '시민 참여 감사장', price: 1000, icon: '🏆', category: 'badge' },
  { id: '4', name: '사기예방 기부', description: '피해자 지원 기금 기부', price: 300, icon: '💝', category: 'donation' },
  { id: '5', name: '배달의민족 1만원권', description: '맛있는 한 끼', price: 1500, icon: '🍕', category: 'voucher' },
];

export const DAILY_QUIZ: QuizQuestion[] = [
  {
    id: 'q1',
    type: 'ox',
    question: '은행은 절대 문자로 개인정보나 비밀번호를 요청하지 않습니다.',
    correctAnswer: true,
    explanation: '은행, 카드사, 정부기관은 문자나 전화로 비밀번호, 보안카드 번호 등을 절대 요청하지 않습니다. 이런 요청이 오면 100% 스미싱입니다.',
    points: 50,
  },
  {
    id: 'q2',
    type: 'multiple',
    question: '다음 중 스미싱 문자의 특징이 아닌 것은?',
    options: [
      '출처가 불분명한 URL 포함',
      '긴급/급함을 강조하는 문구',
      '공식 고객센터 전화번호 안내',
      '개인정보 입력 요청',
    ],
    correctAnswer: '공식 고객센터 전화번호 안내',
    explanation: '스미싱은 보통 가짜 URL로 유도하며, 공식 고객센터 번호를 안내하지 않습니다. 항상 공식 앱이나 홈페이지를 통해 직접 확인하세요.',
    points: 50,
  },
  {
    id: 'q3',
    type: 'ox',
    question: '"엄마 나 폰 고장났어. 이 번호로 연락해" 같은 문자는 가족을 사칭한 스미싱일 가능성이 높습니다.',
    correctAnswer: true,
    explanation: '가족 사칭 스미싱은 매우 흔한 수법입니다. 반드시 기존에 저장된 번호로 직접 전화해서 확인하세요.',
    points: 50,
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    user: {
      id: 'u2',
      username: '피싱헌터',
      avatar: 'https://picsum.photos/seed/slayer/200/200',
      level: 5,
      isVerified: true
    },
    imageUrl: 'https://picsum.photos/seed/scam1/600/800',
    description: '전형적인 "엄마 폰 고장" 스미싱입니다. 절대 링크 클릭하지 마세요!',
    scamType: '가족사칭',
    tags: ['스미싱', '가족사칭', 'SMS'],
    timestamp: '2시간 전',
    likeCount: 342,
    commentCount: 28,
    comments: [
      {
        id: 'c1',
        user: { id: 'u5', username: '조심해요', avatar: 'https://picsum.photos/seed/u5/100/100', level: 2, isVerified: false },
        content: '저도 똑같은 문자 받았어요! 공유 감사합니다.',
        timestamp: '1시간 전'
      }
    ],
    isVerifiedScam: true,
    scamScore: 95
  },
  {
    id: 'p2',
    user: {
      id: 'u3',
      username: '스캠워치',
      avatar: 'https://picsum.photos/seed/glitch/200/200',
      level: 2,
      isVerified: false
    },
    imageUrl: 'https://picsum.photos/seed/scam2/600/800',
    description: '카카오톡으로 온 가짜 재난지원금 안내. USDT 입금 요구하더라고요.',
    scamType: '투자사기',
    tags: ['코인사기', '재난지원금', '카카오톡'],
    timestamp: '5시간 전',
    likeCount: 128,
    commentCount: 15,
    comments: [],
    isVerifiedScam: true,
    scamScore: 88
  },
  {
    id: 'p3',
    user: {
      id: 'u4',
      username: '디지털수사대',
      avatar: 'https://picsum.photos/seed/detective/200/200',
      level: 7,
      isVerified: true
    },
    imageUrl: 'https://picsum.photos/seed/scam3/600/800',
    description: '검찰 사칭 보이스피싱 녹취록입니다. "계좌가 범죄에 연루" 이런 말 나오면 100% 사기!',
    scamType: '기관사칭',
    tags: ['보이스피싱', '검찰사칭', '녹취'],
    timestamp: '1일 전',
    likeCount: 567,
    commentCount: 89,
    comments: [],
    isVerifiedScam: true,
    scamScore: 98
  }
];

// 보상 포인트 설정
export const REWARD_POINTS = {
  REPORT: 100,        // 스캠 신고 시 (1일 1회)
  QUIZ_CORRECT: 50,   // 퀴즈 정답 시
  SOCIAL_LIKE: 5,     // 좋아요 받을 때
  SOCIAL_COMMENT: 10, // 댓글 받을 때
};
