import React from 'react';
import { Post } from '../types';
import { MessageCircle, Share, MoreHorizontal, ShieldAlert } from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
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
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{post.timestamp} • {post.scamType}</p>
          </div>
        </div>
        <button className="text-slate-400 hover:text-black">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Image Content - BeReal Style (Rounded inside container) */}
      <div className="px-2 relative">
        <div className="relative rounded-2xl overflow-hidden bg-slate-100">
            <img src={post.imageUrl} alt="Scam" className="w-full h-auto object-cover max-h-[500px]" />
            
            {/* Stamp Overlay */}
            {post.isVerifiedScam && (
              <div className="absolute bottom-4 right-4 stamp-animation">
                <div className="bg-red-600 text-white px-4 py-2 font-black uppercase text-sm transform -rotate-6 shadow-lg border-2 border-white">
                  Scam Verified
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
            <button className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
                <ShieldAlert className="w-4 h-4" />
                Me Too ({post.metooCount})
            </button>
            <button className="bg-slate-100 text-black px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-200 transition-colors">
                View Proof
            </button>
            <div className="flex-1"></div>
            <button className="p-2 text-slate-900 bg-slate-50 rounded-full hover:bg-slate-100">
                <Share className="w-5 h-5" />
            </button>
        </div>

        <p className="text-sm text-slate-800 leading-relaxed">
          <span className="font-black mr-2">{post.user.username}</span>
          {post.description}
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          {post.tags.map(tag => (
            <span key={tag} className="text-xs font-bold text-slate-400">#{tag.replace('#','')}</span>
          ))}
        </div>
      </div>
    </article>
  );
};