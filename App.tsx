
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Page, UserState, Stock, Property, Transaction, LeaderboardEntry } from './types';
import { STOCKS, PROPERTIES, QUIZ_QUESTIONS, INITIAL_TOKEN, INITIAL_CASH } from './constants';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Home, 
  User, 
  Gamepad2, 
  Trophy, 
  Wallet, 
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  LogOut,
  Gem,
  Store,
  Medal,
  ChevronRight,
  Stars,
  LineChart,
  PieChart,
  BarChart3,
  Activity,
  Coins,
  Download,
  Users,
  ClipboardCheck,
  Search
} from 'lucide-react';
import { 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Login);
  const [user, setUser] = useState<UserState | null>(null);
  const [stocks, setStocks] = useState<Stock[]>(STOCKS);
  const [properties, setProperties] = useState<Property[]>(PROPERTIES);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [teacherView, setTeacherView] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const calculateWealth = useCallback((u: UserState, sList: Stock[], pList: Property[]) => {
    const stockWealth = Object.entries(u.ownedStocks).reduce((acc: number, entry) => {
      const [id, qty] = entry;
      const stock = sList.find(s => s.id === id);
      return acc + (stock ? Number(stock.currentPrice) * Number(qty) : 0);
    }, 0);
    const propertyWealth = u.ownedProperties.reduce((acc: number, id) => {
      const prop = pList.find(p => p.id === id);
      return acc + (prop ? Number(prop.price) : 0);
    }, 0);
    return Number(u.cash || 0) + stockWealth + propertyWealth;
  }, []);

  const totalWealth = useMemo(() => {
    if (!user) return 0;
    return calculateWealth(user, stocks, properties);
  }, [user, stocks, properties, calculateWealth]);

  const globalRecap = useMemo(() => {
    const totalCirculation = leaderboard.reduce((acc, p) => acc + p.wealth, 0);
    const totalProps = leaderboard.reduce((acc, p) => acc + p.properties, 0);
    const totalStocks = leaderboard.reduce((acc, p) => acc + p.stocks, 0);
    const avgWealth = leaderboard.length > 0 ? totalCirculation / leaderboard.length : 0;
    return { totalCirculation, totalProps, totalStocks, avgWealth, playerCount: leaderboard.length };
  }, [leaderboard]);

  useEffect(() => {
    const savedUser = localStorage.getItem('smaga_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentPage(Page.Dashboard);
    }
    const savedLeaderboard = localStorage.getItem('smaga_leaderboard');
    if (savedLeaderboard) setLeaderboard(JSON.parse(savedLeaderboard));
  }, []);

  useEffect(() => {
    if (!user) return;
    const currentEntry: LeaderboardEntry = {
      name: user.name,
      className: user.className,
      absen: user.absen,
      wealth: totalWealth,
      properties: user.ownedProperties.length,
      stocks: (Object.values(user.ownedStocks) as number[]).reduce((a: number, b: number) => a + b, 0),
      quizzesAnswered: user.stats.quizzesAnswered,
      correctAnswers: user.stats.correctAnswers,
      lastUpdate: Date.now()
    };
    setLeaderboard(prev => {
      const others = prev.filter(entry => entry.name !== user.name);
      const updated = [...others, currentEntry].sort((a, b) => b.wealth - a.wealth);
      localStorage.setItem('smaga_leaderboard', JSON.stringify(updated));
      return updated;
    });
  }, [totalWealth, user?.ownedProperties.length, user?.ownedStocks, user?.name, user?.className, user?.stats]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(stock => {
        const change = (Math.random() - 0.5) * stock.volatility * stock.currentPrice;
        const newPrice = Math.max(10, stock.currentPrice + change);
        const newHistory = [...stock.history, newPrice].slice(-20);
        return { ...stock, currentPrice: newPrice, history: newHistory };
      }));
      setProperties(prev => prev.map(prop => ({ ...prop, price: prop.price * (1 + (prop.appreciationRate / 100)) })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { if (user) localStorage.setItem('smaga_user', JSON.stringify(user)); }, [user]);

  const showPage = (page: Page) => {
    if (user && user.tokens <= 0 && [Page.Dashboard, Page.StockMarket, Page.Property].includes(page)) {
      setCurrentPage(Page.Quiz);
      return;
    }
    setCurrentPage(page);
  };

  const addTokens = (amount: number) => setUser(prev => prev ? ({ ...prev, tokens: prev.tokens + amount }) : null);
  const addCash = (amount: number) => setUser(prev => prev ? ({ ...prev, cash: prev.cash + amount }) : null);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setUser({
      name: formData.get('name') as string,
      className: formData.get('className') as string,
      absen: formData.get('absen') as string,
      cash: INITIAL_CASH,
      tokens: INITIAL_TOKEN,
      ownedStocks: {},
      ownedProperties: [],
      history: [],
      stats: { quizzesAnswered: 0, correctAnswers: 0 }
    });
    setCurrentPage(Page.Dashboard);
  };

  const exportToCSV = () => {
    const headers = ['Nama', 'Kelas', 'Absen', 'Total Kekayaan', 'Aset Properti', 'Aset Saham', 'Kuis Selesai', 'Jawaban Benar', 'Terakhir Update'];
    const rows = leaderboard.map(p => [
      p.name,
      p.className,
      p.absen,
      p.wealth,
      p.properties,
      p.stocks,
      p.quizzesAnswered,
      p.correctAnswers,
      new Date(p.lastUpdate).toLocaleString('id-ID')
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Rekap_SMAGA_TradeVerse_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const buyStock = (stockId: string, quantity: number) => {
    if (!user || user.tokens < 2) return;
    const stock = stocks.find(s => s.id === stockId);
    if (!stock || user.cash < stock.currentPrice * quantity) return;
    setUser(prev => {
      if (!prev) return null;
      const newOwned = { ...prev.ownedStocks, [stockId]: (prev.ownedStocks[stockId] || 0) + quantity };
      return { ...prev, cash: prev.cash - (stock.currentPrice * quantity), tokens: prev.tokens - 2, ownedStocks: newOwned };
    });
  };

  const sellStock = (stockId: string, quantity: number) => {
    if (!user || user.tokens < 2 || (user.ownedStocks[stockId] || 0) < quantity) return;
    const stock = stocks.find(s => s.id === stockId);
    if (!stock) return;
    setUser(prev => {
      if (!prev) return null;
      const newOwned = { ...prev.ownedStocks, [stockId]: prev.ownedStocks[stockId] - quantity };
      if (newOwned[stockId] <= 0) delete newOwned[stockId];
      return { ...prev, cash: prev.cash + (stock.currentPrice * quantity), tokens: prev.tokens - 2, ownedStocks: newOwned };
    });
  };

  const buyProperty = (propId: string) => {
    if (!user || user.tokens < 5) return;
    const prop = properties.find(p => p.id === propId);
    if (!prop || prop.owned || user.cash < prop.price) return;
    setUser(prev => prev ? ({ ...prev, cash: prev.cash - prop.price, tokens: prev.tokens - 5, ownedProperties: [...prev.ownedProperties, propId] }) : null);
    setProperties(prev => prev.map(p => p.id === propId ? { ...p, owned: true } : p));
  };

  const sellProperty = (propId: string) => {
    if (!user || user.tokens < 3) return;
    const prop = properties.find(p => p.id === propId);
    if (!prop || !user.ownedProperties.includes(propId)) return;
    setUser(prev => prev ? ({ ...prev, cash: prev.cash + prop.price, tokens: prev.tokens - 3, ownedProperties: prev.ownedProperties.filter(id => id !== propId) }) : null);
    setProperties(prev => prev.map(p => p.id === propId ? { ...p, owned: false } : p));
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);

  const getIconImage = (keyword: string, id: string) => {
    const finalKeyword = encodeURIComponent(`${keyword} 3d isometric icon game asset white background`);
    return `https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800&h=800&sig=${id}&q=${finalKeyword}`;
  };

  const Navigation = () => (
    <nav className="fixed bottom-0 left-0 right-0 glass-panel border-t border-slate-800 p-2 flex justify-around items-center z-50 md:top-0 md:bottom-auto md:flex-col md:w-20 md:h-screen md:justify-start md:space-y-8 md:pt-10">
      <button onClick={() => showPage(Page.Dashboard)} className={`p-3 rounded-2xl transition ${currentPage === Page.Dashboard ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400'}`}><LayoutDashboard size={24} /></button>
      <button onClick={() => showPage(Page.StockMarket)} className={`p-3 rounded-2xl transition ${currentPage === Page.StockMarket ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400'}`}><TrendingUp size={24} /></button>
      <button onClick={() => showPage(Page.Property)} className={`p-3 rounded-2xl transition ${currentPage === Page.Property ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400'}`}><Store size={24} /></button>
      <button onClick={() => showPage(Page.Quiz)} className={`p-3 rounded-2xl transition ${currentPage === Page.Quiz ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400'}`}><Gamepad2 size={24} /></button>
      <button onClick={() => showPage(Page.Leaderboard)} className={`p-3 rounded-2xl transition ${currentPage === Page.Leaderboard ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400'}`}><Trophy size={24} /></button>
      <button onClick={() => showPage(Page.Profile)} className={`p-3 rounded-2xl transition ${currentPage === Page.Profile ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400'}`}><User size={24} /></button>
    </nav>
  );

  if (currentPage === Page.Login) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-blue-950 to-emerald-950">
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl shadow-2xl border border-white/5 space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold font-futuristic bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 text-shadow text-center">SMAGA TradeVerse 2026</h1>
            <p className="text-sm text-slate-400 font-medium">Pembelajaran Seni Budaya Kelas XII – Create by HyuSetya</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Identitas Siswa</label>
              <input required name="name" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition text-white" placeholder="Nama Lengkap" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Kelas</label>
                <select name="className" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition text-white">
                  {['XII A', 'XII B', 'XII C', 'XII D', 'XII E', 'XII F', 'XII G'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest">No. Absen</label>
                <input required name="absen" type="number" min="0" max="40" className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition text-white" placeholder="0-40" />
              </div>
            </div>
            <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl font-black text-lg hover:scale-[1.02] transition shadow-lg shadow-blue-500/20 active:scale-95 uppercase tracking-widest">MULAI GAME</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-24 md:pb-0 md:pl-20">
      <Navigation />
      <header className="sticky top-0 z-40 glass-panel border-b border-slate-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center font-black text-lg shadow-lg">ST</div>
          <div>
            <h2 className="text-sm font-black font-futuristic text-white leading-tight uppercase">{user?.name}</h2>
            <p className="text-[10px] text-blue-400 uppercase tracking-widest font-black opacity-80">{user?.className} • NO {user?.absen}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[9px] uppercase text-slate-500 tracking-[0.2em] font-black">Net Worth</span>
            <span className="font-black text-emerald-400 text-lg leading-tight">{formatCurrency(totalWealth)}</span>
          </div>
          <div className="flex items-center bg-blue-900/40 px-4 py-2 rounded-2xl border border-blue-500/30 shadow-lg">
            <Zap size={18} className="text-yellow-400 mr-2 animate-pulse fill-yellow-400" />
            <span className="font-black text-lg text-white">{user?.tokens}</span>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        {currentPage === Page.Dashboard && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-[2rem] border-l-4 border-l-blue-500 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-125 transition duration-700 text-white"><Wallet size={160} /></div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-3">Available Liquid Cash</p>
                <h3 className="text-3xl font-black font-futuristic text-white">{formatCurrency(user?.cash || 0)}</h3>
              </div>
              <div className="glass-panel p-6 rounded-[2rem] border-l-4 border-l-emerald-500 shadow-2xl relative overflow-hidden group">
                 <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-125 transition duration-700 text-white"><TrendingUp size={160} /></div>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-3">Investment Assets</p>
                <h3 className="text-3xl font-black font-futuristic text-white">{formatCurrency(totalWealth - (user?.cash || 0))}</h3>
              </div>
              <div className="glass-panel p-6 rounded-[2rem] border-l-4 border-l-amber-500 shadow-2xl relative overflow-hidden group">
                 <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-125 transition duration-700 text-white"><Home size={160} /></div>
                <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-3">Controlled Properties</p>
                <h3 className="text-3xl font-black font-futuristic text-white">{user?.ownedProperties.length} Global Units</h3>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 glass-panel p-8 rounded-[2.5rem] shadow-2xl border border-white/5">
                <div className="flex justify-between items-center mb-8">
                    <h4 className="text-xl font-black font-futuristic uppercase tracking-widest text-blue-400 flex items-center gap-3">
                    <Activity size={24} /> Real-time Market Pulse
                    </h4>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full font-black tracking-widest uppercase animate-pulse">Live Tracking</span>
                </div>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stocks[0]?.history.map((h, i) => ({ time: i, price: h })) || []}>
                        <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="price" stroke="#3b82f6" fill="url(#colorPrice)" strokeWidth={4} animationDuration={1000} />
                    </AreaChart>
                    </ResponsiveContainer>
                </div>
              </div>
              
              <div className="glass-panel p-8 rounded-[2.5rem] shadow-2xl border border-white/5 space-y-6 flex flex-col justify-center">
                <h4 className="text-xl font-black font-futuristic uppercase tracking-widest text-emerald-400">Quick Actions</h4>
                <button onClick={() => showPage(Page.Property)} className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl font-black text-white shadow-xl hover:scale-[1.02] transition active:scale-95 flex items-center justify-center gap-3">
                    <Store size={24} /> BROWSE PROPERTY
                </button>
                <button onClick={() => showPage(Page.Quiz)} className="w-full py-5 bg-slate-800 rounded-2xl font-black text-slate-300 border border-white/5 hover:bg-slate-700 transition flex items-center justify-center gap-3">
                    <Zap size={24} className="text-yellow-400" /> FARM ENERGY & CASH
                </button>
              </div>
            </div>
          </div>
        )}

        {currentPage === Page.StockMarket && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h1 className="text-4xl font-black font-futuristic uppercase tracking-tighter text-shadow">Global Stock Exchange</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stocks.map(stock => (
                <div key={stock.id} className="glass-panel p-6 rounded-[2rem] border border-white/5 space-y-6 hover:border-blue-500/50 hover:-translate-y-1 transition duration-300 shadow-xl group">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center font-black text-2xl text-blue-500 shadow-inner group-hover:scale-110 transition">{stock.code[0]}</div>
                      <div>
                        <h4 className="font-black text-lg leading-tight text-white">{stock.name}</h4>
                        <span className="text-[10px] text-blue-400 uppercase tracking-widest font-black opacity-70">{stock.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Price per Share</p>
                        <p className="text-2xl font-black font-futuristic text-emerald-400">{formatCurrency(stock.currentPrice)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => buyStock(stock.id, 1)} disabled={user!.tokens < 2 || user!.cash < stock.currentPrice} className="px-5 py-2.5 bg-blue-600 rounded-xl font-black text-xs disabled:opacity-30 hover:bg-blue-500 transition shadow-lg shadow-blue-500/20 active:scale-95 text-white">BUY</button>
                      <button onClick={() => sellStock(stock.id, 1)} disabled={user!.tokens < 2 || !user!.ownedStocks[stock.id]} className="px-5 py-2.5 bg-slate-800 rounded-xl font-black text-xs disabled:opacity-30 hover:bg-slate-700 transition active:scale-95 text-white">SELL</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentPage === Page.Property && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <h1 className="text-4xl font-black font-futuristic uppercase tracking-tighter text-shadow">Real Assets Market</h1>
                <p className="text-slate-400 text-sm font-medium">Beli aset dari Tier 1 hingga Tier 5 untuk mendominasi pasar.</p>
              </div>
              <div className="flex gap-6 text-[10px] text-white bg-slate-900/90 px-6 py-3 rounded-2xl border border-white/10 font-black shadow-2xl">
                <span className="flex items-center gap-2 uppercase tracking-widest text-blue-400 font-black"><Zap size={14} className="fill-blue-400" /> Beli: -5</span>
                <span className="flex items-center gap-2 uppercase tracking-widest text-red-400 font-black"><Zap size={14} className="fill-red-400" /> Jual: -3</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map(prop => {
                const isOwned = user?.ownedProperties.includes(prop.id);
                const isLegendary = prop.category === 'Tier 5';
                const isPremium = prop.category === 'Premium';
                
                const tierLabels: Record<string, string> = { 
                  'Tier 1': 'ASSET PEMULA', 
                  'Tier 2': 'SMALL-MEDIUM', 
                  'Tier 3': 'MID ASSET', 
                  'Tier 4': 'LARGE ASSET', 
                  'Tier 5': 'LEGENDARY',
                  'Premium': 'BONUS PREMIUM'
                };
                
                const tierColors: Record<string, string> = { 
                  'Tier 1': 'bg-slate-700', 
                  'Tier 2': 'bg-blue-600', 
                  'Tier 3': 'bg-emerald-600', 
                  'Tier 4': 'bg-amber-600', 
                  'Tier 5': 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600',
                  'Premium': 'bg-gradient-to-r from-indigo-600 to-blue-600'
                };

                return (
                  <div 
                    key={prop.id} 
                    className={`glass-panel overflow-hidden rounded-[2.5rem] border transition-all duration-500 shadow-2xl group flex flex-col relative ${
                      isOwned ? 'border-blue-500/50 grayscale opacity-70 scale-95' : 
                      isLegendary ? 'border-purple-500/50 hover:-translate-y-2 ring-2 ring-purple-500/30 legendary-glow bg-slate-900/80' : 
                      'border-white/5 hover:border-emerald-500/40 hover:-translate-y-1'
                    }`}
                  >
                    {(isLegendary || isPremium) && (
                       <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 animate-pulse z-10"></div>
                    )}
                    <div className="h-52 bg-slate-950 relative overflow-hidden">
                      <img 
                        src={getIconImage(prop.keyword, prop.id)} 
                        className="w-full h-full object-contain p-8 opacity-90 group-hover:scale-110 transition duration-700" 
                        alt={prop.name} 
                        loading="lazy"
                      />
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <div className={`text-[8px] font-black px-3 py-1.5 rounded-xl text-white shadow-2xl uppercase tracking-widest ${tierColors[prop.category]}`}>
                          {tierLabels[prop.category]}
                        </div>
                        {isOwned && <span className="text-[8px] font-black px-3 py-1.5 rounded-xl bg-blue-500 text-white shadow-2xl uppercase tracking-widest">DIMILIKI</span>}
                      </div>
                      {(isLegendary || isPremium) && (
                        <div className="absolute top-4 right-4 bg-purple-600/20 p-2 rounded-2xl backdrop-blur-md border border-purple-500/30">
                          <Gem size={20} className="text-yellow-400 drop-shadow-lg animate-bounce fill-yellow-400/20" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="mb-4">
                        <h4 className={`text-lg font-black mb-1 line-clamp-2 leading-snug ${isLegendary ? 'bg-clip-text text-transparent bg-gradient-to-r from-purple-300 to-pink-300' : 'text-slate-100'}`}>{prop.name}</h4>
                        <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest opacity-80">SMAGA TradeVerse Registry</p>
                      </div>
                      <div className="flex justify-between items-end border-t border-white/5 pt-5">
                        <div>
                          <p className="text-[9px] text-slate-500 uppercase font-black mb-1 tracking-widest">Valuation</p>
                          <p className={`text-xl font-black font-futuristic ${isLegendary ? 'text-purple-400 animate-pulse' : 'text-emerald-400'}`}>
                            {formatCurrency(prop.price)}
                          </p>
                        </div>
                        {isOwned ? (
                          <button onClick={() => sellProperty(prop.id)} className="px-6 py-2.5 bg-red-600/15 border border-red-500/30 text-red-500 rounded-xl font-black text-xs hover:bg-red-600 hover:text-white transition shadow-lg shadow-red-500/10">JUAL</button>
                        ) : (
                          <button onClick={() => buyProperty(prop.id)} disabled={prop.owned || user!.cash < prop.price || user!.tokens < 5} className={`px-6 py-2.5 rounded-xl font-black text-xs shadow-2xl transition-all disabled:opacity-30 active:scale-95 text-white ${isLegendary ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/30' : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/30'}`}>BELI</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {currentPage === Page.Leaderboard && (
          <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500">
            <div className="text-center space-y-6">
              <div className="inline-block bg-yellow-500/20 p-6 rounded-[2.5rem] border border-yellow-500/30 shadow-yellow-500/10">
                <Medal size={64} className="text-yellow-500 drop-shadow-glow fill-yellow-500/20" />
              </div>
              <h1 className="text-5xl font-black font-futuristic uppercase tracking-tighter text-shadow text-center">Class Performance</h1>
              <p className="text-slate-400 max-w-xl mx-auto font-medium text-center">Statistik pencapaian ekonomi dan akademik siswa SMAGA TradeVerse.</p>
              
              <div className="flex justify-center gap-4 mt-8">
                <button 
                  onClick={() => setTeacherView(false)} 
                  className={`px-8 py-3 rounded-2xl font-black text-sm transition ${!teacherView ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-900 text-slate-500 border border-white/5'}`}
                >
                  <Trophy size={18} className="inline mr-2" /> LEADERBOARD
                </button>
                <button 
                  onClick={() => setTeacherView(true)} 
                  className={`px-8 py-3 rounded-2xl font-black text-sm transition ${teacherView ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-900 text-slate-500 border border-white/5'}`}
                >
                  <Users size={18} className="inline mr-2" /> REKAP GURU
                </button>
              </div>
            </div>

            {!teacherView ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-2">
                        <div className="flex items-center gap-2 text-blue-400 mb-2"><BarChart3 size={18}/><span className="text-[10px] font-black uppercase tracking-widest">Total Wealth Pool</span></div>
                        <p className="text-xl font-black text-white">{formatCurrency(globalRecap.totalCirculation)}</p>
                        <p className="text-[9px] text-slate-500 font-bold">Total kekayaan gabungan siswa</p>
                    </div>
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-400 mb-2"><Home size={18}/><span className="text-[10px] font-black uppercase tracking-widest">Global Real Estate</span></div>
                        <p className="text-xl font-black text-white">{globalRecap.totalProps} Units</p>
                        <p className="text-[9px] text-slate-500 font-bold">Aset properti yang dimiliki publik</p>
                    </div>
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-2">
                        <div className="flex items-center gap-2 text-amber-400 mb-2"><PieChart size={18}/><span className="text-[10px] font-black uppercase tracking-widest">Average Net Worth</span></div>
                        <p className="text-xl font-black text-white">{formatCurrency(globalRecap.avgWealth)}</p>
                        <p className="text-[9px] text-slate-500 font-bold">Rata-rata kekayaan per pemain</p>
                    </div>
                    <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-2">
                        <div className="flex items-center gap-2 text-indigo-400 mb-2"><User size={18}/><span className="text-[10px] font-black uppercase tracking-widest">Active Traders</span></div>
                        <p className="text-xl font-black text-white">{globalRecap.playerCount} Players</p>
                        <p className="text-[9px] text-slate-500 font-bold">Jumlah siswa yang terdaftar</p>
                    </div>
                </div>

                <div className="glass-panel rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/95 text-[11px] uppercase font-black text-slate-400 border-b border-white/5 tracking-[0.25em]">
                        <th className="p-8 text-center">RANK</th>
                        <th className="p-8">IDENTITY</th>
                        <th className="p-8 text-right">GLOBAL NET WORTH</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {leaderboard.map((player, i) => (
                        <tr key={i} className={`${player.name === user?.name ? 'bg-blue-600/15 border-l-4 border-l-blue-500' : 'hover:bg-white/5'} transition duration-300 group`}>
                          <td className="p-8 text-center font-black text-lg">
                            {i === 0 ? <span className="text-4xl drop-shadow-glow">🥇</span> : i === 1 ? <span className="text-4xl">🥈</span> : i === 2 ? <span className="text-4xl">🥉</span> : <span className="text-slate-500">{i + 1}</span>}
                          </td>
                          <td className="p-8">
                            <div className="font-black text-xl text-white group-hover:text-blue-400 transition">{player.name}</div>
                            <div className="text-[11px] text-blue-500 uppercase font-black tracking-widest mt-2 flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                                {player.className} • ABSEN {player.absen}
                            </div>
                          </td>
                          <td className="p-8 text-right font-black text-emerald-400 font-futuristic text-2xl tracking-tighter">{formatCurrency(player.wealth)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-4">
                  <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input 
                      type="text" 
                      placeholder="Cari siswa atau kelas..." 
                      className="w-full bg-slate-900 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white outline-none focus:border-emerald-500 transition"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={exportToCSV}
                    className="w-full md:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black text-sm transition border border-white/5 flex items-center justify-center gap-3"
                  >
                    <Download size={20} /> EKSPOR SPREADSHEET (CSV)
                  </button>
                </div>

                <div className="glass-panel rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                      <thead>
                        <tr className="bg-slate-900/95 text-[10px] uppercase font-black text-slate-400 border-b border-white/5 tracking-widest">
                          <th className="p-6">SISWA / KELAS</th>
                          <th className="p-6 text-center">ABSEN</th>
                          <th className="p-6">TOTAL KEKAYAAN</th>
                          <th className="p-6 text-center">ASET (P/S)</th>
                          <th className="p-6 text-center">KUIS (SET/ACC)</th>
                          <th className="p-6">UPDATE TERAKHIR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {leaderboard
                          .filter(p => 
                            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.className.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .map((p, i) => (
                          <tr key={i} className="hover:bg-white/5 transition duration-300">
                            <td className="p-6">
                              <div className="font-black text-slate-100">{p.name}</div>
                              <div className="text-[10px] text-blue-500 font-black uppercase mt-1">{p.className}</div>
                            </td>
                            <td className="p-6 text-center font-black text-slate-400">{p.absen}</td>
                            <td className="p-6 font-black text-emerald-400 font-futuristic">{formatCurrency(p.wealth)}</td>
                            <td className="p-6 text-center">
                              <span className="text-xs font-black text-slate-200">{p.properties}P</span>
                              <span className="mx-2 text-slate-700">|</span>
                              <span className="text-xs font-black text-slate-200">{p.stocks}S</span>
                            </td>
                            <td className="p-6 text-center">
                              <div className="flex flex-col">
                                <span className="text-xs font-black text-amber-500">{p.quizzesAnswered} Set</span>
                                <span className="text-[9px] font-black text-slate-500 uppercase">
                                  {p.quizzesAnswered > 0 ? Math.round((p.correctAnswers / (p.quizzesAnswered * 5)) * 100) : 0}% Acc
                                </span>
                              </div>
                            </td>
                            <td className="p-6">
                              <div className="text-[10px] text-slate-500 font-medium">
                                {new Date(p.lastUpdate).toLocaleDateString('id-ID')}
                              </div>
                              <div className="text-[10px] text-slate-600">
                                {new Date(p.lastUpdate).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {currentPage === Page.Quiz && (
          <div className="max-w-3xl mx-auto space-y-10 animate-in slide-in-from-bottom-8">
            <div className="text-center space-y-6">
              <div className="bg-amber-500/20 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto border border-amber-500/40 shadow-amber-500/10">
                 <Zap size={48} className="text-amber-500 animate-pulse fill-amber-500" />
              </div>
              <h1 className="text-5xl font-black font-futuristic uppercase tracking-tighter text-shadow text-center">Farm Tokens & Cash</h1>
              <p className="text-slate-400 font-medium max-w-md mx-auto text-lg leading-relaxed text-center">Kehabisan Energi? Jawab tantangan HOTS Ilustrasi untuk mengisi ulang saldo token dan dana riset kamu! (+5 Token & Rp100-1000 per Benar)</p>
            </div>
            <QuizComponent 
              questions={QUIZ_QUESTIONS} 
              onCorrect={(rewardCash) => {
                addTokens(5);
                addCash(rewardCash);
              }}
              onComplete={(correct) => {
                setUser(prev => prev ? ({ ...prev, stats: { quizzesAnswered: prev.stats.quizzesAnswered + 1, correctAnswers: prev.stats.correctAnswers + correct } }) : null);
                showPage(Page.Dashboard);
              }} 
            />
          </div>
        )}

        {currentPage === Page.Profile && (
          <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="glass-panel p-10 rounded-[3rem] w-full md:w-96 space-y-8 text-center border border-white/5 shadow-2xl h-fit sticky top-24">
                <div className="w-48 h-48 bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-600 rounded-[3.5rem] mx-auto p-1.5 overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition duration-700">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'Smaga'}&backgroundColor=0f172a`} alt="Avatar" className="w-full h-full object-cover bg-slate-950 rounded-[3.3rem]" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-3xl font-black font-futuristic text-white uppercase tracking-tight text-center">{user?.name}</h2>
                    <p className="text-blue-500 uppercase tracking-[0.3em] text-[10px] font-black flex items-center justify-center gap-3">
                        <Stars size={14} className="fill-blue-500" />
                        {user?.className} • ABSEN {user?.absen}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-6 py-8 border-y border-white/5">
                    <div className="text-center space-y-1">
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Portfolio Size</p>
                        <p className="text-2xl font-black text-white">{user?.ownedProperties.length}</p>
                    </div>
                    <div className="text-center border-l border-white/5 space-y-1">
                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Current Status</p>
                        <p className="text-2xl font-black text-emerald-400">#ACTIVE</p>
                    </div>
                </div>
                <button onClick={() => { if(confirm("Terminate TradeVerse session? Your progress is saved locally.")) { localStorage.removeItem('smaga_user'); window.location.reload(); } }} className="w-full py-5 bg-red-600/15 text-red-500 border border-red-500/20 rounded-2xl font-black text-xs hover:bg-red-600 hover:text-white transition duration-300 flex items-center justify-center gap-3 shadow-lg shadow-red-500/5 uppercase tracking-widest">Terminate Session</button>
              </div>
              
              <div className="flex-1 space-y-10">
                <div className="glass-panel p-8 rounded-[2.5rem] border-l-8 border-l-amber-500 space-y-8 shadow-2xl">
                  <div className="flex items-center gap-5"><Gamepad2 size={36} className="text-amber-500" /><h3 className="text-2xl font-black font-futuristic uppercase tracking-widest text-white">Educational Achievement</h3></div>
                  <div className="grid grid-cols-3 gap-8">
                    <div className="bg-slate-950/60 p-8 rounded-[2rem] border border-white/5 text-center shadow-inner group hover:border-blue-500/30 transition">
                        <p className="text-[10px] text-slate-500 uppercase font-black mb-3 tracking-widest">Sets Completed</p>
                        <p className="text-4xl font-black text-white">{user!.stats.quizzesAnswered}</p>
                    </div>
                    <div className="bg-slate-950/60 p-8 rounded-[2rem] border border-white/5 text-center shadow-inner group hover:border-emerald-500/30 transition">
                        <p className="text-[10px] text-slate-500 uppercase font-black mb-3 tracking-widest">HOTS Correct</p>
                        <p className="text-4xl font-black text-emerald-400">{user!.stats.correctAnswers}</p>
                    </div>
                    <div className="bg-slate-950/60 p-8 rounded-[2rem] border border-white/5 text-center shadow-inner group hover:border-red-500/30 transition">
                        <p className="text-[10px] text-slate-500 uppercase font-black mb-3 tracking-widest">Total Accuracy</p>
                        <p className="text-4xl font-black text-amber-500">
                          {user!.stats.quizzesAnswered > 0 ? Math.round((user!.stats.correctAnswers / (user!.stats.quizzesAnswered * 5)) * 100) : 0}%
                        </p>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-10 rounded-[2.5rem] space-y-8 shadow-2xl">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black font-futuristic uppercase tracking-widest text-blue-400">Inventory Property Index</h3>
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest bg-slate-900 px-4 py-2 rounded-xl border border-white/5">Portfolio Management</span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {user?.ownedProperties.length === 0 ? (
                        <div className="col-span-full py-16 text-center text-slate-600 font-black italic border-4 border-dashed border-white/5 rounded-[2rem] uppercase tracking-[0.3em]">No Assets Acquired</div>
                    ) : (
                        user?.ownedProperties.map((id, idx) => {
                        const p = properties.find(pr => pr.id === id);
                        return (
                            <div key={`${id}-${idx}`} className="flex flex-col gap-4 p-6 bg-slate-950/60 rounded-3xl border border-white/5 hover:border-blue-500/40 transition-all group shadow-xl">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-4">
                                        <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse shadow-blue-500 shadow-lg"></div>
                                        <div className="space-y-1">
                                            <span className="font-black text-lg text-slate-100 leading-tight block">{p?.name}</span>
                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Active Asset</span>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-400 font-futuristic tracking-tighter bg-emerald-500/10 px-3 py-1 rounded-lg">
                                        {formatCurrency(p?.price || 0)}
                                    </span>
                                </div>
                                <div className="flex gap-2 border-t border-white/5 pt-4">
                                    <button onClick={() => sellProperty(p!.id)} className="flex-1 py-3 bg-red-600/10 text-red-500 border border-red-500/20 rounded-xl font-black text-[10px] hover:bg-red-600 hover:text-white transition uppercase tracking-widest">Liquidate (-3 Tokens)</button>
                                </div>
                            </div>
                        );
                        })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const QuizComponent: React.FC<{ questions: any[], onCorrect: (cash: number) => void, onComplete: (correct: number) => void }> = ({ questions, onCorrect, onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizBatch, setQuizBatch] = useState<any[]>([]);
  const [shuffledOptions, setShuffledOptions] = useState<{ text: string, originalIndex: number }[]>([]);
  const [lastReward, setLastReward] = useState<number | null>(null);

  const shuffle = (array: any[]) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  useEffect(() => { 
    setQuizBatch(shuffle([...questions]).slice(0, 5)); 
  }, [questions]);

  useEffect(() => {
    if (quizBatch.length > 0 && currentIdx < 5) {
      const q = quizBatch[currentIdx];
      const opts = q.options.map((opt: string, i: number) => ({ text: opt, originalIndex: i }));
      setShuffledOptions(shuffle([...opts]));
    }
  }, [quizBatch, currentIdx]);

  const checkAnswer = (shuffledIdx: number) => {
    if (isAnswered) return;
    const selected = shuffledOptions[shuffledIdx];
    const q = quizBatch[currentIdx];
    
    setSelectedOpt(shuffledIdx);
    setIsAnswered(true);

    if (selected.originalIndex === q.correctAnswer) {
      const cashReward = Math.floor(Math.random() * 901) + 100;
      setCorrectCount(prev => prev + 1);
      setLastReward(cashReward);
      onCorrect(cashReward);
    } else {
      setLastReward(null);
    }
  };

  if (quizBatch.length === 0 || currentIdx >= 5) return null;
  const q = quizBatch[currentIdx];

  return (
    <div className="glass-panel p-10 rounded-[3rem] space-y-10 shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300 relative overflow-hidden">
      {isAnswered && lastReward && (
        <div className="absolute top-4 right-4 animate-bounce flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-2xl shadow-xl z-20">
          <Coins size={20} />
          <span className="font-black text-sm">+{lastReward} Cash & +5 Tokens!</span>
        </div>
      )}

      <div className="flex justify-between items-center border-b border-white/5 pb-8">
        <span className="text-[12px] font-black uppercase text-slate-500 tracking-[0.4em]">STATION {currentIdx + 1} / 5</span>
        <span className="text-[11px] font-black px-5 py-2.5 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-600/40 uppercase tracking-widest">{q.category}</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-black leading-tight text-white tracking-tight text-shadow text-left">{q.question}</h2>
      <div className="grid grid-cols-1 gap-5">
        {shuffledOptions.map((opt, i) => (
          <button 
            key={i} 
            disabled={isAnswered} 
            onClick={() => checkAnswer(i)} 
            className={`w-full p-6 text-left rounded-[1.8rem] border transition-all duration-300 relative group flex items-center gap-5 shadow-lg ${
                isAnswered ? 
                    (opt.originalIndex === q.correctAnswer ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-emerald-500/10 scale-[1.03] z-10' : 
                    (i === selectedOpt ? 'bg-red-500/20 border-red-500 text-red-400 shadow-red-500/10' : 'bg-slate-900 border-slate-800 opacity-40 grayscale scale-95')) : 
                    'bg-slate-900/80 border-slate-800 hover:border-blue-500 hover:bg-slate-800/80 hover:translate-x-3'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg border-2 transition-all ${isAnswered && opt.originalIndex === q.correctAnswer ? 'bg-emerald-500 text-white border-emerald-400 animate-bounce' : 'bg-slate-800 border-slate-700 text-slate-400 group-hover:border-blue-500'}`}>
                {String.fromCharCode(65 + i)}
            </div>
            <span className="font-bold text-lg md:text-xl text-slate-100">{opt.text}</span>
          </button>
        ))}
      </div>
      {isAnswered && (
        <button onClick={() => { if (currentIdx < 4) { setCurrentIdx(currentIdx + 1); setSelectedOpt(null); setIsAnswered(false); setLastReward(null); } else onComplete(correctCount); }} className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl font-black text-xl text-white hover:scale-[1.02] transition-all duration-300 shadow-2xl shadow-blue-600/30 uppercase tracking-[0.25em] active:scale-95">
          {currentIdx < 4 ? 'Next Challenge' : 'Finish & Claim Rewards'}
        </button>
      )}
    </div>
  );
};

export default App;
