import React from 'react';
import { INITIAL_WALLET, MARKET_ITEMS } from '../constants';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { ArrowUpRight, Fish, ShoppingBag, Gift } from 'lucide-react';

export const Wallet: React.FC = () => {
  return (
    <div className="pt-24 pb-28 px-4 min-h-screen bg-slate-50">
      <div className="max-w-md mx-auto space-y-8">
        
        {/* Balance Card */}
        <div className="bg-blue-600 text-white rounded-[2rem] p-8 relative overflow-hidden shadow-2xl shadow-blue-200">
          <div className="relative z-10 flex flex-col h-full justify-between min-h-[160px]">
             <div className="flex justify-between items-start">
                <div>
                  <span className="text-blue-200 font-bold text-xs uppercase tracking-widest">Total Catch</span>
                  <div className="flex items-baseline gap-2 mt-1">
                     <h2 className="text-5xl font-black tracking-tighter">
                       {Math.floor(INITIAL_WALLET.balance)}
                     </h2>
                     <span className="text-3xl">🐟</span>
                  </div>
                  <span className="text-sm font-bold text-blue-200">FISH TOKENS</span>
                </div>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                   <Fish className="w-5 h-5" />
                </div>
             </div>
             
             <div className="flex items-center gap-2 mt-auto">
                <div className="w-8 h-5 bg-white/20 rounded sm-chip backdrop-blur-sm" />
                <span className="font-mono text-sm text-blue-100">Hunter ID: 8821</span>
             </div>
          </div>
          
          {/* Water Bubbles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full opacity-50 blur-2xl -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400 rounded-full opacity-30 blur-xl -ml-5 -mb-5"></div>
        </div>

        {/* Fish Market */}
        <div>
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="font-black text-xl flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    Fish Market
                </h3>
                <span className="text-xs font-bold text-slate-400">Spend your catch</span>
            </div>
            
            <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide">
                {MARKET_ITEMS.map((item) => (
                    <div key={item.id} className="min-w-[160px] bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col items-center text-center hover:border-blue-500 transition-colors cursor-pointer group">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform">
                            {item.icon}
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{item.name}</h4>
                        <span className="text-xs text-slate-400 mb-3">{item.category}</span>
                        <button className="mt-auto bg-black text-white px-4 py-2 rounded-full text-xs font-bold w-full flex items-center justify-center gap-1 group-hover:bg-blue-600 transition-colors">
                            {item.price} 🐟
                        </button>
                    </div>
                ))}
            </div>
        </div>

        {/* Stats */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm h-64">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-lg">Weekly Catch</h3>
           </div>
           <ResponsiveContainer width="100%" height="80%">
             <BarChart data={INITIAL_WALLET.history}>
               <XAxis 
                  dataKey="day" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10} 
               />
               <Tooltip 
                  cursor={{fill: '#f1f5f9', radius: 8}}
                  contentStyle={{ backgroundColor: '#000', borderRadius: '12px', border: 'none', padding: '8px 12px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  formatter={(value) => [`${value} 🐟`]}
               />
               <Bar 
                  dataKey="amount" 
                  fill="#3b82f6" 
                  radius={[6, 6, 6, 6]}
                  barSize={16}
               />
             </BarChart>
           </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};