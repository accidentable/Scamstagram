import React, { useState } from 'react';
import { Post } from '../types';
import { Heart, MessageCircle, Share2, MoreHorizontal, AlertTriangle, Send } from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(post.comments);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: `c${Date.now()}`,
        user: {
          id: 'me',
          username: '나',
          avatar: 'https://picsum.photos/seed/me/100/100',
          level: 1,
          isVerified: false
        },
        content: newComment,
        timestamp: '방금 전'
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  return (
    <article className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <img src={post.user.avatar} alt={post.user.username} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
          <div>
            <div className="flex items-center gap-1">
              <span className="font-black text-sm text-black">{post.user.username}</span>
              {post.user.isVerified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white">✓</div>
              )}
              <span className="text-xs font-bold text-slate-400 ml-1">Lv.{post.user.level}</span>
            </div>
            <p className="text-xs font-medium text-slate-400">{post.timestamp} · {post.scamType}</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-black">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Image Content */}
      <div className="px-2 relative">
        <div className="relative rounded-2xl overflow-hidden bg-slate-100">
          <img src={post.imageUrl} alt="스캠 사례" className="w-full h-auto object-cover max-h-[500px]" />

          {/* 위험도 점수 */}
          <div className="absolute top-3 left-3">
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 ${
              post.scamScore >= 90 ? 'bg-red-500 text-white' :
              post.scamScore >= 70 ? 'bg-orange-500 text-white' :
              post.scamScore >= 50 ? 'bg-yellow-400 text-black' :
              'bg-green-500 text-white'
            }`}>
              <AlertTriangle className="w-3 h-3" />
              위험도 {post.scamScore}%
            </div>
          </div>

          {/* 검증 스탬프 */}
          {post.isVerifiedScam && (
            <div className="absolute bottom-3 right-3">
              <div className="bg-red-600 text-white px-3 py-1.5 font-black uppercase text-xs transform -rotate-3 shadow-lg border-2 border-white rounded">
                AI 검증 완료
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center gap-1 mb-3">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full transition-all active:scale-90 ${
              liked ? 'text-red-500' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-all active:scale-90"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <button className="p-2 rounded-full text-slate-600 hover:bg-slate-100 transition-all active:scale-90">
            <Share2 className="w-6 h-6" />
          </button>
          <div className="flex-1" />
        </div>

        {/* 좋아요/댓글 수 */}
        <div className="flex items-center gap-4 mb-3 text-sm">
          <span className="font-bold">{likeCount.toLocaleString()}명이 공감</span>
          <span className="text-slate-400">댓글 {post.commentCount + comments.length - post.comments.length}개</span>
        </div>

        {/* 설명 */}
        <p className="text-sm text-slate-800 leading-relaxed">
          <span className="font-black mr-2">{post.user.username}</span>
          {post.description}
        </p>

        {/* 태그 */}
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.map(tag => (
            <span key={tag} className="text-xs font-bold text-blue-600">#{tag}</span>
          ))}
        </div>

        {/* 댓글 섹션 */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            {/* 댓글 목록 */}
            <div className="space-y-3 mb-4 max-h-40 overflow-y-auto">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-2">
                  <img src={comment.user.avatar} alt="" className="w-7 h-7 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-bold mr-1">{comment.user.username}</span>
                      {comment.content}
                    </p>
                    <span className="text-xs text-slate-400">{comment.timestamp}</span>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-2">첫 댓글을 남겨보세요!</p>
              )}
            </div>

            {/* 댓글 입력 */}
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글 작성..."
                className="flex-1 bg-slate-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <button
                onClick={handleAddComment}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
