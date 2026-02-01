export enum Tab {
  FEED = 'FEED',
  REPORT = 'REPORT',
  QUIZ = 'QUIZ',
  WALLET = 'WALLET',
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  level: number;
  isVerified: boolean;
}

export interface Comment {
  id: string;
  user: User;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  user: User;
  imageUrl: string;
  description: string;
  scamType: string;
  tags: string[];
  timestamp: string;
  likeCount: number;
  commentCount: number;
  comments: Comment[];
  isVerifiedScam: boolean;
  scamScore: number;
}

export interface ScanResult {
  isScam: boolean;
  confidenceScore: number;
  scamType: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  extractedTags: string[];
  analysis: string;
}

export interface QuizQuestion {
  id: string;
  type: 'ox' | 'multiple';
  question: string;
  imageUrl?: string;
  options?: string[];
  correctAnswer: string | boolean;
  explanation: string;
  points: number;
}

export interface WalletData {
  balance: number;
  todayReported: boolean;
  todayQuizCompleted: boolean;
  totalReports: number;
  totalQuizzes: number;
  history: { day: string; amount: number; type: string }[];
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: 'voucher' | 'donation' | 'badge';
}
