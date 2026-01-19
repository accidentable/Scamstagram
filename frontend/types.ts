export enum Tab {
  FEED = 'FEED',
  SCAN = 'SCAN',
  WALLET = 'WALLET',
}

export interface User {
  id: string;
  username: string;
  avatar: string;
  level: number;
  isVerified: boolean;
}

export interface Post {
  id: string;
  user: User;
  imageUrl: string;
  description: string;
  scamType: string;
  tags: string[];
  timestamp: string;
  metooCount: number;
  isVerifiedScam: boolean;
}

export interface ScanResult {
  isScam: boolean;
  confidenceScore: number; // 0-100
  scamType: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  extractedTags: string[];
  analysis: string;
}

export interface WalletData {
  balance: number;
  dailyHuntCount: number;
  dailyHuntLimit: number;
  history: { day: string; amount: number }[];
}

export interface MarketItem {
  id: string;
  name: string;
  price: number;
  icon: string;
  category: string;
}