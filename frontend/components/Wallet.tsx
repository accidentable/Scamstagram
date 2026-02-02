import React, { useState, useEffect } from 'react';
import { REWARD_ITEMS, MOCK_USER } from '../constants';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { Gift, ShoppingBag, TrendingUp, Award, ChevronRight, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://scamkeep-api-932863380761.asia-northeast3.run.app/api/v1';

interface WalletData {
  balance: number;
  total_reports: number;
  total_quizzes: number;
  today_reported: boolean;
  today_quiz_completed: boolean;
  history: Array<{ day: string; amount: number; type: string }>;
}

export const Wallet: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch(`${API_BASE}/wallet/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setWalletData(data);
        }
      } catch (e) {
        console.error('Failed to fetch wallet:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  const categories = [
    { id: 'all', label: '전체' },
    { id: 'voucher', label: '상품권' },
    { id: 'badge', label: '뱃지' },
    { id: 'donation', label: '기부' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? REWARD_ITEMS
    : REWARD_ITEMS.filter(item => item.category === selectedCategory);

  if (loading) {
    return (
      <div className="pt-24 pb-28 px-4 min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const balance = walletData?.balance ?? 0;
  const totalReports = walletData?.total_reports ?? 0;
  const totalQuizzes = walletData?.total_quizzes ?? 0;
  const history = walletData?.history ?? [];

  return (
    <div className="pt-24 pb-28 px-4 min-h-screen bg-slate-50">
      <div className="max-w-md mx-auto space-y-6">

        {/* 포인트 카드 */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-3xl p-6 relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-blue-200 font-bold text-xs uppercase tracking-widest">내 포인트</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <h2 className="text-4xl font-black tracking-tight">
                    {balance.toLocaleString()}
                  </h2>
                  <span className="text-xl font-bold text-blue-200">P</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                <Gift className="w-6 h-6" />
              </div>
            </div>

            {/* 활동 통계 */}
            <div className="flex gap-4">
              <div className="flex-1 bg-white/10 rounded-xl p-3">
                <p className="text-blue-200 text-xs font-medium">신고</p>
                <p className="text-xl font-black">{totalReports}건</p>
              </div>
              <div className="flex-1 bg-white/10 rounded-xl p-3">
                <p className="text-blue-200 text-xs font-medium">퀴즈</p>
                <p className="text-xl font-black">{totalQuizzes}회</p>
              </div>
              <div className="flex-1 bg-white/10 rounded-xl p-3">
                <p className="text-blue-200 text-xs font-medium">레벨</p>
                <p className="text-xl font-black">Lv.{MOCK_USER.level}</p>
              </div>
            </div>
          </div>

          {/* 배경 장식 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full opacity-30 blur-2xl -mr-10 -mt-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400 rounded-full opacity-20 blur-xl -ml-5 -mb-5" />
        </div>

        {/* 주간 활동 차트 */}
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              주간 활동
            </h3>
            <span className="text-xs font-bold text-slate-400">포인트 획득 현황</span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={history}>
                <XAxis
                  dataKey="day"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <Tooltip
                  cursor={{ fill: '#f1f5f9', radius: 8 }}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', padding: '8px 12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value) => [`${value}P`]}
                />
                <Bar
                  dataKey="amount"
                  fill="#3b82f6"
                  radius={[6, 6, 6, 6]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 보상 상점 */}
        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="font-black text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              보상 상점
            </h3>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 상품 목록 */}
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const canAfford = balance >= item.price;

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 transition-all ${
                    canAfford ? 'hover:border-blue-500 cursor-pointer' : 'opacity-60'
                  }`}
                >
                  <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-2xl">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                  <button
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1 transition-colors ${
                      canAfford
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {item.price}P
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 포인트 사용 안내 */}
        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-blue-800 mb-1">포인트 적립 방법</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 스캠 신고: 1일 1회, 100P</li>
                <li>• 퀴즈 정답: 문제당 50P</li>
                <li>• 피드 좋아요 받기: 5P</li>
                <li>• 피드 댓글 받기: 10P</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
