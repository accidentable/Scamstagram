import React, { useState, useEffect } from 'react';
import { PostCard } from './PostCard';
import { MOCK_POSTS } from '../constants';
import { TrendingUp, AlertCircle, Users, Loader2 } from 'lucide-react';
import { Post } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://scamkeep-api-932863380761.asia-northeast3.run.app/api/v1';

// API 응답 (snake_case) -> 프론트엔드 타입 (camelCase) 변환
const transformPost = (apiPost: any): Post => ({
  id: apiPost.id,
  user: {
    id: apiPost.user?.id || 'unknown',
    username: apiPost.user?.username || '익명',
    avatar: apiPost.user?.avatar || `https://picsum.photos/seed/${apiPost.id}/200/200`,
    level: apiPost.user?.level || 1,
    isVerified: apiPost.user?.is_verified || false,
  },
  imageUrl: apiPost.image_url?.startsWith('/') 
    ? `${API_BASE.replace('/api/v1', '')}${apiPost.image_url}` 
    : apiPost.image_url || '',
  description: apiPost.description || '',
  scamType: apiPost.scam_type || 'Unknown',
  tags: typeof apiPost.tags === 'string' ? JSON.parse(apiPost.tags || '[]') : (apiPost.tags || []),
  timestamp: apiPost.created_at || apiPost.timestamp || new Date().toISOString(),
  likeCount: apiPost.like_count || 0,
  commentCount: apiPost.comment_count || 0,
  comments: apiPost.comments || [],
  isVerifiedScam: apiPost.is_verified_scam || false,
  scamScore: apiPost.scam_score || 0,
});

export const Feed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setPosts(MOCK_POSTS);
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch(`${API_BASE}/posts/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          console.log('[Feed] API Response:', data);
          // API 응답 변환
          const rawPosts = data.posts || data || [];
          const apiPosts = rawPosts.map(transformPost);
          // API 게시물 먼저, 그 다음 mock 데이터
          setPosts([...apiPosts, ...MOCK_POSTS]);
        } else {
          console.error('[Feed] API Error:', res.status);
          setPosts(MOCK_POSTS);
        }
      } catch (e) {
        console.error('Failed to fetch posts:', e);
        setPosts(MOCK_POSTS);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="pt-24 pb-28 px-4 min-h-screen bg-slate-50">
      {/* 통계 카드 */}
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4">
        <div className="min-w-[140px] bg-gradient-to-br from-red-500 to-red-600 text-white rounded-2xl p-4 shadow-lg">
          <AlertCircle className="w-5 h-5 mb-2 opacity-80" />
          <p className="text-2xl font-black">2,847</p>
          <p className="text-xs font-medium opacity-80">오늘 신고된 스캠</p>
        </div>
        <div className="min-w-[140px] bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-4 shadow-lg">
          <Users className="w-5 h-5 mb-2 opacity-80" />
          <p className="text-2xl font-black">15.2K</p>
          <p className="text-xs font-medium opacity-80">활동 중인 헌터</p>
        </div>
        <div className="min-w-[140px] bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-4 shadow-lg">
          <TrendingUp className="w-5 h-5 mb-2 opacity-80" />
          <p className="text-2xl font-black">89%</p>
          <p className="text-xs font-medium opacity-80">피해 예방률</p>
        </div>
      </div>

      {/* 트렌딩 스캠 유형 */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-slate-500 mb-3 px-1">실시간 트렌드</h3>
        <div className="flex gap-2 flex-wrap">
          {['가족사칭', '투자사기', '기관사칭', '로맨스스캠', '채용사기'].map((tag, i) => (
            <button
              key={tag}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                i === 0 ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-500'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* 피드 */}
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-black tracking-tight">최신 스캠 사례</h2>
          <button className="text-sm text-blue-600 font-bold">전체보기</button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-10 opacity-50">
            <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">📭</div>
            <p className="font-bold text-slate-400">아직 게시물이 없습니다</p>
            <p className="text-sm text-slate-400 mt-1">스캠을 발견하면 신고해주세요!</p>
          </div>
        )}

        <div className="text-center py-10 opacity-50">
          <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">🛡️</div>
          <p className="font-bold text-slate-400">모든 사례를 확인했습니다!</p>
          <p className="text-sm text-slate-400 mt-1">새로운 스캠 발견시 신고해주세요</p>
        </div>
      </div>
    </div>
  );
};
