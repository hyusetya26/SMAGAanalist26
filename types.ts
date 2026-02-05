
export interface Stock {
  id: string;
  name: string;
  code: string;
  basePrice: number;
  currentPrice: number;
  history: number[];
  volatility: number;
  category: 'Materials' | 'Digital' | 'Publishing' | 'Services';
}

export interface Property {
  id: string;
  name: string;
  price: number;
  category: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4' | 'Tier 5' | 'Premium';
  owned: boolean;
  appreciationRate: number;
  keyword: string; 
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  category: 'Concept' | 'Idea' | 'Sketch' | 'Coloring' | 'Finishing' | 'Evaluation';
}

export interface UserState {
  name: string;
  className: string;
  absen: string;
  cash: number;
  tokens: number;
  ownedStocks: Record<string, number>; // id -> quantity
  ownedProperties: string[]; // ids
  history: Transaction[];
  stats: {
    quizzesAnswered: number;
    correctAnswers: number;
  };
}

export interface Transaction {
  timestamp: number;
  type: 'BUY' | 'SELL';
  item: string;
  amount: number;
  price: number;
}

export interface LeaderboardEntry {
  name: string;
  className: string;
  absen: string;
  wealth: number;
  properties: number;
  stocks: number;
  quizzesAnswered: number;
  correctAnswers: number;
  lastUpdate: number;
}

export enum Page {
  Login = 'loginPage',
  Dashboard = 'dashboardPage',
  StockMarket = 'stockMarketPage',
  StockChart = 'stockChartPage',
  Property = 'propertyPage',
  Profile = 'profilePage',
  Quiz = 'quizPage',
  Score = 'scorePage',
  Leaderboard = 'leaderboardPage'
}
