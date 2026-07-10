export interface Credit {
  role: string;
  name: string;
}

export interface Work {
  id: string;
  title: string;
  slug: string;
  thumbnail: string | null;
  vimeoUrl: string;
  vimeoVideoId: string | null;
  description: string;
  credits: Credit[];
  displayOrder: number;
  directorIds: string[];
  showOnWorkPage: boolean;
  createdAt: string;
}

export interface WorkFormData {
  title: string;
  slug: string;
  thumbnail: string;
  vimeoUrl: string;
  description: string;
  credits: Credit[];
  displayOrder: number;
  directorIds: string[];
  showOnWorkPage: boolean;
}
