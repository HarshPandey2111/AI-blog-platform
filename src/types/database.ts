export interface Post {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      posts: {
        Row: Post;
        Insert: Omit<Post, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Post, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}