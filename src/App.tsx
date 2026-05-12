import React, { useState } from 'react';
import { Download, Link as LinkIcon, Loader2, Play, ShieldCheck, Zap, AlertCircle, CheckCircle2, Music, Monitor, Smartphone } from 'lucide-react';

const App = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [videoData, setVideoData] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.includes('tiktok.com')) {
      setError('กรุณาใส่ลิงก์ TikTok ที่ถูกต้อง');
      return;
    }

    setLoading(true);
    setError('');
    setVideoData(null);

    try {
      // ใช้ TikWM API ซึ่งรองรับไฟล์ระดับ HD (Original Quality)
      const response = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`);
      const result = await response.json();

      if (result.code === 0 && result.data) {
        const data = result.data;
        setVideoData({
          title: data.title || "วิดีโอ TikTok",
          author: data.author.nickname || data.author.unique_id,
          avatar: data.author.avatar,
          thumbnail: data.cover,
          hdVideoUrl: data.hdplay || data.play, 
          sdVideoUrl: data.play,
          wmVideoUrl: data.wmplay,
          music: data.music_info.title,
          stats: {
            plays: data.play_count,
            likes: data.digg_count,
            size: data.size,
            hd_size: data.hd_size
          }
        });
      } else {
        setError(result.msg || 'ไม่สามารถดึงข้อมูลวิดีโอต้นฉบับได้ ลิงก์อาจจะหมดอายุหรือเข้าถึงไม่ได้');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (videoUrl: string, prefix = 'video') => {
    try {
      setDownloading(true);
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `tiktok_${prefix}_${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // ล้างหน่วยความจำ
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // ถ้า fetch ติด CORS ให้ใช้วิธี fallback เปิดแท็บใหม่แทน
      window.open(videoUrl, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return 'N/A';
    const mb = bytes / (1024 * 1024);
    return mb.toFixed(2) + ' MB';
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 font-sans selection:bg-pink-500/30">
      {/* Glow Effect Background */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-pink-600/10 blur-[120px] pointer-events-none -z-10"></div>
      
      {/* Navigation */}
      <nav className="bg-[#0F172A]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-[#FE2C55] to-[#FF6B6B] p-2.5 rounded-2xl shadow-lg shadow-pink-500/20">
              <Download className="text-white w-6 h-6" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-xl tracking-tighter italic text-white">TikTok Downloader</span>
              <span className="text-[10px] font-bold text-[#FE2C55] tracking-widest uppercase mt-1">By Manakk.</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Ultra HD Ready</span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-pink-500/10 text-pink-500 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-pink-500/20">
            <Zap size={14} /> NEW: Direct Download Support
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-tight">
            ดาวน์โหลดคุณภาพ <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FE2C55] via-pink-400 to-[#25F4EE]">ต้นฉบับ (Original)</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            สัมผัสประสบการณ์ดาวน์โหลดวิดีโอระดับพรีเมียม โดย <span className="text-white font-bold italic underline decoration-[#FE2C55] decoration-2 underline-offset-4">Manakk.</span>
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-4 md:p-10 mb-12 border border-white/10 shadow-2xl">
          <form onSubmit={fetchVideo} className="space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <LinkIcon className="text-slate-500 group-focus-within:text-pink-500 transition-colors" size={24} />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="วางลิงก์วิดีโอ TikTok ที่นี่..."
                className="w-full pl-16 pr-6 py-6 bg-slate-900/50 border-2 border-white/5 rounded-[1.5rem] focus:ring-4 focus:ring-pink-500/20 focus:border-[#FE2C55] outline-none transition-all text-lg font-medium placeholder:text-slate-600"
              />
              <button
                type="submit"
                disabled={loading || !url}
                className="md:absolute md:right-3 md:top-3 w-full md:w-auto mt-4 md:mt-0 px-10 py-4 bg-[#FE2C55] hover:bg-[#ff4066] text-white font-black rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 h-[60px] shadow-xl shadow-pink-500/20 active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <Download size={24} />}
                {loading ? 'กำลังประมวลผล...' : 'เริ่มดาวน์โหลด'}
              </button>
            </div>
            {error && (
              <div className="flex items-center gap-3 text-pink-400 text-sm font-bold bg-pink-500/10 p-5 rounded-2xl border border-pink-500/20">
                <AlertCircle size={20} />
                {error}
              </div>
            )}
          </form>

          {/* Result Section */}
          {videoData && (
            <div className="mt-12 pt-12 border-t border-white/10 animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* Preview */}
                <div className="relative mx-auto w-full max-w-[320px]">
                   <div className="absolute -inset-4 bg-gradient-to-tr from-[#FE2C55] to-cyan-500 rounded-[3rem] blur-2xl opacity-20 animate-pulse"></div>
                   <div className="relative rounded-[2rem] overflow-hidden aspect-[9/16] bg-black border-8 border-white/5 shadow-2xl">
                      <img 
                        src={videoData.thumbnail} 
                        alt="Preview" 
                        className="w-full h-full object-cover opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-8">
                         <div className="flex items-center gap-3 mb-4">
                            <img src={videoData.avatar} className="w-10 h-10 rounded-full border-2 border-white/20" alt="" />
                            <span className="font-bold text-white text-lg">{videoData.author}</span>
                         </div>
                         <p className="text-white/80 text-sm line-clamp-2 italic">"{videoData.title}"</p>
                      </div>
                   </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col justify-center space-y-8">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm tracking-widest uppercase">
                       <Monitor size={16} /> Original Resolution
                    </div>
                    <h2 className="text-3xl font-black text-white leading-tight">พร้อมดาวน์โหลดแบบไม่มีลายน้ำ</h2>
                    <div className="flex flex-wrap gap-3">
                       <span className="px-4 py-2 bg-white/5 rounded-full text-xs font-bold border border-white/10">HD MP4</span>
                       <span className="px-4 py-2 bg-white/5 rounded-full text-xs font-bold border border-white/10">{formatSize(videoData.stats.hd_size || videoData.stats.size)}</span>
                       <span className="px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5">
                         <ShieldCheck size={12} /> ปลอดภัย 100%
                       </span>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <button 
                      onClick={() => handleDownload(videoData.hdVideoUrl, 'hd')}
                      disabled={downloading}
                      className="group w-full py-6 bg-gradient-to-r from-[#FE2C55] to-pink-600 text-white font-black rounded-3xl shadow-2xl shadow-pink-500/40 transition-all flex items-center justify-center gap-4 text-xl active:scale-[0.98] disabled:opacity-70"
                    >
                      {downloading ? <Loader2 className="animate-spin" size={28} /> : <Download size={28} className="group-hover:translate-y-1 transition-transform" />}
                      {downloading ? 'กำลังดาวน์โหลด...' : 'DOWNLOAD HD ORIGINAL'}
                    </button>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => handleDownload(videoData.sdVideoUrl, 'sd')}
                        disabled={downloading}
                        className="py-5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Smartphone size={18} /> Normal SD
                      </button>
                      <button 
                         onClick={() => handleDownload(videoData.hdVideoUrl, 'audio')}
                         disabled={downloading}
                         className="py-5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <Music size={18} /> MP3 Audio
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-20 pt-10 border-t border-white/5 text-center">
          <p className="text-slate-500 text-sm font-medium">
            © 2026 TikTok Downloader. Developed by <span className="text-pink-500 font-bold">Manakk.</span>
          </p>
        </div>
      </main>
    </div>
  );
};

export default App;
