import React from 'react';
import { PostCard } from './PostCard';
import { MOCK_POSTS } from '../constants';

export const Feed: React.FC = () => {
  return (
    <div className="pt-24 pb-28 px-4 min-h-screen bg-slate-50">
      {/* Agency "Talent" / Stories Header */}
      <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
        {/* Your Story */}
        <div className="flex flex-col items-center flex-shrink-0 cursor-pointer group">
          <div className="w-[70px] h-[70px] rounded-full p-1 border-2 border-dashed border-slate-300 group-hover:border-black transition-colors">
            <div className="w-full h-full rounded-full bg-slate-200 flex items-center justify-center">
               <span className="text-2xl font-bold">+</span>
            </div>
          </div>
          <span className="text-xs font-bold mt-2 text-slate-900">Add Report</span>
        </div>

        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center flex-shrink-0 cursor-pointer">
            <div className="w-[70px] h-[70px] rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 to-red-500">
              <div className="w-full h-full rounded-full bg-white p-[2px]">
                <img src={`https://picsum.photos/seed/agency${i}/100/100`} className="w-full h-full rounded-full object-cover" alt="story" />
              </div>
            </div>
            <span className="text-xs font-bold mt-2 text-slate-500">Alert #{i}</span>
          </div>
        ))}
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <h2 className="text-2xl font-black tracking-tight px-1">Recent Scoops</h2>
        {MOCK_POSTS.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
        
        <div className="text-center py-10 opacity-50">
          <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl">🎉</div>
          <p className="font-bold text-slate-400">You're all caught up!</p>
        </div>
      </div>
    </div>
  );
};