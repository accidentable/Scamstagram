import { Post, User, WalletData, MarketItem } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  username: 'NeoHunter_99',
  avatar: 'https://picsum.photos/seed/neo/200/200',
  level: 3,
  isVerified: true,
};

export const INITIAL_WALLET: WalletData = {
  balance: 1250, // Higher balance for FISH currency
  dailyHuntCount: 1,
  dailyHuntLimit: 3,
  history: [
    { day: 'Mon', amount: 50 },
    { day: 'Tue', amount: 120 },
    { day: 'Wed', amount: 30 },
    { day: 'Thu', amount: 150 },
    { day: 'Fri', amount: 80 },
  ]
};

export const MARKET_ITEMS: MarketItem[] = [
  { id: '1', name: 'Verified Badge', price: 500, icon: '🛡️', category: 'Profile' },
  { id: '2', name: 'Neon Frame', price: 300, icon: '🖼️', category: 'Cosmetic' },
  { id: '3', name: 'XP Boost 2x', price: 150, icon: '⚡', category: 'Power-up' },
  { id: '4', name: 'Iced Coffee', price: 2500, icon: '☕', category: 'Voucher' },
  { id: '5', name: 'Donation', price: 1000, icon: '🤝', category: 'Charity' },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    user: {
      id: 'u2',
      username: 'CryptoSlayer',
      avatar: 'https://picsum.photos/seed/slayer/200/200',
      level: 5,
      isVerified: true
    },
    imageUrl: 'https://picsum.photos/seed/scam1/600/800',
    description: 'Found this classic "mom lost her phone" text. Total garbage. #smishing #fail',
    scamType: 'Smishing',
    tags: ['#Urgent', '#FamilyScam', '#SMS'],
    timestamp: '2h ago',
    metooCount: 342,
    isVerifiedScam: true
  },
  {
    id: 'p2',
    user: {
      id: 'u3',
      username: 'GlitchWatcher',
      avatar: 'https://picsum.photos/seed/glitch/200/200',
      level: 2,
      isVerified: false
    },
    imageUrl: 'https://picsum.photos/seed/scam2/600/800',
    description: 'Fake job offer via WhatsApp. They asked for USDT deposit immediately.',
    scamType: 'Job Scam',
    tags: ['#JobScam', '#CryptoFraud', '#WhatsApp'],
    timestamp: '5h ago',
    metooCount: 128,
    isVerifiedScam: true
  }
];