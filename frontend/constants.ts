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
  },
  {
    id: 'p4',
    user: {
      id: 'u6',
      username: '택배조심',
      avatar: 'https://picsum.photos/seed/user6/200/200',
      level: 4,
      isVerified: true
    },
    imageUrl: 'https://picsum.photos/seed/delivery/600/800',
    description: '[CJ대한통운] 주소 불일치로 배송 불가. 주소 확인 요망 → 전형적인 택배 사칭 스미싱입니다!',
    scamType: '택배사칭',
    tags: ['스미싱', '택배사칭', 'CJ대한통운'],
    timestamp: '3시간 전',
    likeCount: 256,
    commentCount: 42,
    comments: [
      {
        id: 'c2',
        user: { id: 'u7', username: '배송알림', avatar: 'https://picsum.photos/seed/u7/100/100', level: 1, isVerified: false },
        content: '요즘 이런 문자 너무 많아요. 항상 공식 앱으로 확인하세요!',
        timestamp: '2시간 전'
      }
    ],
    isVerifiedScam: true,
    scamScore: 92
  },
  {
    id: 'p5',
    user: {
      id: 'u8',
      username: '금융감시단',
      avatar: 'https://picsum.photos/seed/finance/200/200',
      level: 6,
      isVerified: true
    },
    imageUrl: 'https://picsum.photos/seed/bank/600/800',
    description: '[국민은행] 고객님 계좌가 정지되었습니다. 본인확인 필요 - 은행은 절대 문자로 계좌정지 안내 안합니다!',
    scamType: '은행사칭',
    tags: ['스미싱', '은행사칭', '계좌정지'],
    timestamp: '4시간 전',
    likeCount: 423,
    commentCount: 67,
    comments: [],
    isVerifiedScam: true,
    scamScore: 96
  },
  {
    id: 'p6',
    user: {
      id: 'u9',
      username: '정부지원금헌터',
      avatar: 'https://picsum.photos/seed/gov/200/200',
      level: 3,
      isVerified: false
    },
    imageUrl: 'https://picsum.photos/seed/support/600/800',
    description: '긴급재난지원금 신청하세요! 라는 문자... 정부 지원금은 절대 문자 링크로 신청 안받아요.',
    scamType: '정부사칭',
    tags: ['스미싱', '지원금사기', '정부사칭'],
    timestamp: '6시간 전',
    likeCount: 189,
    commentCount: 31,
    comments: [
      {
        id: 'c3',
        user: { id: 'u10', username: '공공기관', avatar: 'https://picsum.photos/seed/u10/100/100', level: 4, isVerified: true },
        content: '정부24나 공식 앱으로만 신청하세요!',
        timestamp: '5시간 전'
      }
    ],
    isVerifiedScam: true,
    scamScore: 89
  },
  {
    id: 'p7',
    user: {
      id: 'u11',
      username: '중고나라경찰',
      avatar: 'https://picsum.photos/seed/market/200/200',
      level: 5,
      isVerified: true
    },
    imageUrl: 'https://picsum.photos/seed/trade/600/800',
    description: '중고거래 사기범 수법 공개! "안전결제" 링크 보내면서 피싱 사이트로 유도합니다.',
    scamType: '중고거래사기',
    tags: ['중고거래', '안전결제사기', '피싱'],
    timestamp: '8시간 전',
    likeCount: 534,
    commentCount: 78,
    comments: [],
    isVerifiedScam: true,
    scamScore: 91
  },
  {
    id: 'p8',
    user: {
      id: 'u12',
      username: '로맨스스캠신고',
      avatar: 'https://picsum.photos/seed/romance/200/200',
      level: 4,
      isVerified: true
    },
    imageUrl: 'https://picsum.photos/seed/love/600/800',
    description: 'SNS에서 만난 외국인이 투자를 권유하며 송금 요청... 전형적인 로맨스 스캠입니다.',
    scamType: '로맨스스캠',
    tags: ['로맨스스캠', 'SNS사기', '투자유도'],
    timestamp: '12시간 전',
    likeCount: 678,
    commentCount: 112,
    comments: [
      {
        id: 'c4',
        user: { id: 'u13', username: '피해자모임', avatar: 'https://picsum.photos/seed/u13/100/100', level: 2, isVerified: false },
        content: '저도 비슷한 경험 있어요... 이런 정보 공유 감사합니다.',
        timestamp: '10시간 전'
      }
    ],
    isVerifiedScam: true,
    scamScore: 94
  },
  {
    id: 'p9',
    user: {
      id: 'u14',
      username: '취준생지킴이',
      avatar: 'https://picsum.photos/seed/job/200/200',
      level: 3,
      isVerified: false
    },
    imageUrl: 'https://picsum.photos/seed/employ/600/800',
    description: '재택알바 월 500만원! 계좌만 빌려주세요 → 보이스피싱 대포통장 만드는 수법입니다!',
    scamType: '취업사기',
    tags: ['취업사기', '재택알바', '대포통장'],
    timestamp: '1일 전',
    likeCount: 892,
    commentCount: 145,
    comments: [],
    isVerifiedScam: true,
    scamScore: 97
  },
  {
    id: 'p10',
    user: {
      id: 'u15',
      username: '대출조심하세요',
      avatar: 'https://picsum.photos/seed/loan/200/200',
      level: 5,
      isVerified: true
    },
    imageUrl: 'https://picsum.photos/seed/money/600/800',
    description: '저금리 대환대출 문자 받으셨나요? 선입금 요구하면 100% 사기입니다!',
    scamType: '대출사기',
    tags: ['대출사기', '선입금', '저금리유혹'],
    timestamp: '1일 전',
    likeCount: 445,
    commentCount: 56,
    comments: [
      {
        id: 'c5',
        user: { id: 'u16', username: '금융피해자', avatar: 'https://picsum.photos/seed/u16/100/100', level: 1, isVerified: false },
        content: '수수료 먼저 내라고 해서 의심했는데 역시 사기였네요...',
        timestamp: '20시간 전'
      }
    ],
    isVerifiedScam: true,
    scamScore: 93
  },
  {
    id: 'p11',
    user: {
      id: 'u17',
      username: '리딩방피해자',
      avatar: 'https://picsum.photos/seed/stock/200/200',
      level: 2,
      isVerified: false
    },
    imageUrl: 'https://picsum.photos/seed/trading/600/800',
    description: '카톡 주식리딩방 수익 인증 다 조작입니다. 가입비 내면 끝! 절대 속지 마세요.',
    scamType: '리딩방사기',
    tags: ['리딩방', '주식사기', '카카오톡'],
    timestamp: '2일 전',
    likeCount: 1023,
    commentCount: 189,
    comments: [],
    isVerifiedScam: true,
    scamScore: 96
  },
  {
    id: 'p12',
    user: {
      id: 'u18',
      username: '결제알림주의',
      avatar: 'https://picsum.photos/seed/payment/200/200',
      level: 4,
      isVerified: true
    },
    imageUrl: 'https://picsum.photos/seed/card/600/800',
    description: '[결제완료] 1,250,000원 승인 → 본인 아닐 경우 연락 바람. 이 문자 받으면 절대 전화하지 마세요!',
    scamType: '결제사칭',
    tags: ['결제사기', '카드사칭', '전화유도'],
    timestamp: '2일 전',
    likeCount: 756,
    commentCount: 98,
    comments: [
      {
        id: 'c6',
        user: { id: 'u19', username: '카드회사직원', avatar: 'https://picsum.photos/seed/u19/100/100', level: 6, isVerified: true },
        content: '카드사는 이런 식으로 문자 안 보냅니다. 공식 앱에서 확인하세요!',
        timestamp: '1일 전'
      }
    ],
    isVerifiedScam: true,
    scamScore: 94
  },
  {
    id: 'p13',
    user: {
      id: 'u20',
      username: '경찰청협력',
      avatar: 'https://picsum.photos/seed/police/200/200',
      level: 8,
      isVerified: true
    },
    imageUrl: 'https://picsum.photos/seed/cyber/600/800',
    description: '수사기관 사칭 전화 녹음 공개! "범죄에 연루되어 조사가 필요하다"며 금전 요구하는 전형적 수법.',
    scamType: '수사기관사칭',
    tags: ['보이스피싱', '경찰사칭', '금전요구'],
    timestamp: '3일 전',
    likeCount: 1567,
    commentCount: 234,
    comments: [],
    isVerifiedScam: true,
    scamScore: 99
  }
];

// 보상 포인트 설정
export const REWARD_POINTS = {
  REPORT: 100,        // 스캠 신고 시 (1일 1회)
  QUIZ_CORRECT: 50,   // 퀴즈 정답 시
  SOCIAL_LIKE: 5,     // 좋아요 받을 때
  SOCIAL_COMMENT: 10, // 댓글 받을 때
};
