export interface NewsResults {
  featured: boolean;
  id: number;
  image_url: string;
//  launches: [];
  news_site: string;
  published_at: string;
  summary: string;
  title: string;
  updated_at: string;
  url: string;
}

export interface NewsApi {
  items: NewsResults[];
  count: number;
  next: string
  previous: string;
  results: Array<NewsResults>;
}
