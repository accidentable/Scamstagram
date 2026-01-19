import React, { useState, useRef } from 'react';
import { Upload, Camera, Loader2, X, AlertTriangle, CheckCircle, Video, Mic, FileAudio } from 'lucide-react';
import { analyzeScamMedia } from '../services/geminiService';
import { ScanResult } from '../types';

export const Scanner: React.FC = () => {
  const [media, setMedia] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio'>('image');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const type = file.type.split('/')[0];
      if (type !== 'image' && type !== 'video' && type !== 'audio') {
        alert("Unsupported file type. Please upload Image, Video, or Audio.");
        return;
      }

      setMediaType(type as 'image' | 'video' | 'audio');
      setMimeType(file.type);

      const reader = new FileReader();
      reader.onloadend = () => {
        setMedia(reader.result as string);
        setResult(null); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!media) return;
    setIsAnalyzing(true);
    try {
      const data = await analyzeScamMedia(media, mimeType);
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-500 text-white';
      case 'HIGH': return 'bg-orange-500 text-white';
      case 'MEDIUM': return 'bg-yellow-400 text-black';
      default: return 'bg-green-500 text-white';
    }
  };

  const renderPreview = () => {
    if (!media) return null;
    
    if (mediaType === 'video') {
      return (
        <video 
          src={media} 
          controls 
          className={`w-full h-auto max-h-[60vh] rounded-2xl bg-black ${isAnalyzing ? 'opacity-50' : ''}`} 
        />
      );
    }
    if (mediaType === 'audio') {
      return (
        <div className="w-full h-64 bg-slate-900 rounded-2xl flex flex-col items-center justify-center gap-4 p-6">
          <div className="flex gap-1 items-center h-16">
             {[...Array(10)].map((_,i) => (
                <div key={i} className="w-2 bg-green-400 rounded-full animate-pulse" style={{ height: Math.random() * 40 + 10 + 'px', animationDelay: i * 0.1 + 's' }}></div>
             ))}
          </div>
          <audio src={media} controls className="w-full" />
          <div className="flex items-center gap-2 text-slate-400 text-sm">
             <FileAudio className="w-4 h-4" />
             <span>Audio Recording</span>
          </div>
        </div>
      );
    }
    // Default Image
    return (
       <img src={media} alt="Preview" className={`w-full h-auto max-h-[60vh] object-cover rounded-2xl ${isAnalyzing ? 'blur-sm scale-105 transition-transform duration-1000' : ''}`} />
    );
  };

  return (
    <div className="pt-24 pb-28 px-4 min-h-screen bg-slate-50 flex flex-col items-center justify-center">
      
      {!media ? (
        <div className="w-full max-w-sm animate-fade-in-up">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer bg-white rounded-[2rem] p-10 flex flex-col items-center justify-center text-center shadow-sm border-2 border-dashed border-slate-200 hover:border-black transition-colors group"
          >
            <div className="flex gap-4 mb-6">
               <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                 <Camera className="w-8 h-8 text-slate-400 group-hover:text-black" />
               </div>
               <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                 <Video className="w-8 h-8 text-slate-400 group-hover:text-black" />
               </div>
               <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                 <Mic className="w-8 h-8 text-slate-400 group-hover:text-black" />
               </div>
            </div>
            
            <h2 className="text-2xl font-black text-black mb-2">New Report</h2>
            <p className="text-slate-500 font-medium mb-8">Upload screenshot, video recording,<br/>or voice message.</p>

            <button className="bg-black text-white px-8 py-3 rounded-full font-bold w-full hover:bg-slate-800 transition-transform active:scale-95 flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" />
              Select Media
            </button>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*,video/*,audio/*" 
              className="hidden" 
            />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-md flex flex-col">
          {/* Media Container */}
          <div className="relative bg-white p-3 rounded-3xl shadow-lg mb-6">
            <div className="relative">
               {renderPreview()}

               {/* Analysis Loading */}
               {isAnalyzing && (
                 <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 rounded-2xl z-10">
                   <div className="bg-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3">
                     <Loader2 className="w-5 h-5 animate-spin text-black" />
                     <span className="font-bold text-sm">Analyzing {mediaType}...</span>
                   </div>
                 </div>
               )}

               {/* Close */}
               {!isAnalyzing && !result && (
                 <button 
                   onClick={() => setMedia(null)}
                   className="absolute top-3 right-3 w-8 h-8 bg-black/50 backdrop-blur text-white rounded-full flex items-center justify-center hover:bg-black transition-colors z-20"
                 >
                   <X className="w-4 h-4" />
                 </button>
               )}
            </div>
          </div>

          {/* Action Button */}
          {!result && !isAnalyzing && (
            <button 
              onClick={handleAnalyze}
              className="w-full py-4 bg-black text-white font-bold text-lg rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-95"
            >
              Scan Content
            </button>
          )}

          {/* Analysis Result Card */}
          {result && (
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 animate-slide-up">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-full ${result.isScam ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                   {result.isScam ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                </div>
                <div>
                   <h3 className="font-black text-xl leading-none">{result.isScam ? 'Potential Scam' : 'Looks Safe'}</h3>
                   <span className={`text-xs font-bold px-2 py-0.5 rounded mt-1 inline-block ${getRiskColor(result.riskLevel)}`}>
                     {result.riskLevel} RISK • {result.confidenceScore}% MATCH
                   </span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl mb-6">
                <p className="text-sm font-medium text-slate-700 leading-relaxed">{result.analysis}</p>
              </div>

              <div className="flex gap-2 mb-6">
                {result.extractedTags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <button 
                  onClick={() => {
                    alert("Published! +50 FISH added to wallet.");
                    setMedia(null);
                    setResult(null);
                  }}
                  className="py-3 bg-black text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                 >
                   Publish
                 </button>
                 <button 
                  onClick={() => { setMedia(null); setResult(null); }}
                  className="py-3 bg-slate-100 text-slate-900 font-bold rounded-xl hover:bg-slate-200"
                 >
                   Discard
                 </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};