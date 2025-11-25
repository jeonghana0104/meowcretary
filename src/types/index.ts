export type KeywordItem = {
  id: number;
  name: string;
};

export type CrawledDataItem = {
  id: number;
  keywordId: number;
  title: string;
  summary: string;
  date: string;
  source: string;
};

export type PageType = 'login' | 'signup' | 'dashboard' | 'keywords' | 'settings';