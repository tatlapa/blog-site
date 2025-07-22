export interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  createdAt: Date;
}

export interface CreateArticleData {
  title: string;
  excerpt: string;
  content: string;
}

export interface UpdateArticleData {
  title?: string;
  excerpt?: string;
  content?: string;
}
