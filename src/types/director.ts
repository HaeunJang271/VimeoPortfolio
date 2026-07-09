export interface DirectorDescriptionLink {
  label: string;
  url: string;
}

export interface Director {
  id: string;
  name: string;
  slug: string;
  profileImage: string | null;
  description: string;
  descriptionLinks: DirectorDescriptionLink[];
  workOrder: string[];
  displayOrder: number;
  createdAt: string;
}

export interface DirectorFormData {
  name: string;
  slug: string;
  profileImage: string;
  description: string;
  descriptionLinks: DirectorDescriptionLink[];
  workOrder: string[];
  displayOrder: number;
}
