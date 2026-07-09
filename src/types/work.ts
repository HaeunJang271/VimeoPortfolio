export interface Credit {
  role: string;
  name: string;
}

export interface Work {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  vimeo_url: string;
  description: string;
  credits: Credit[];
  created_at: string;
}

export interface WorkFormData {
  title: string;
  slug: string;
  thumbnail: string;
  vimeo_url: string;
  description: string;
  credits: Credit[];
}
