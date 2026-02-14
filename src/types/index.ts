// Portfolio and Projects Types
export interface CaseStudy {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: Category;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  featuredImage: string;
  featuredVideo?: string;
  videoThumbnail?: string;
  images: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  slug: string;
  featured: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Portfolio {
  id: string;
  caseStudies: CaseStudy[];
  totalProjects: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ServiceOffering {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  features: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  slug: string;
  position: string;
  bio: string;
  avatar: string;
  specialties: string[];
  socialLinks?: SocialLink[];
}

export interface ContactFormData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  projectType: string;
  budget?: string;
  message: string;
  createdAt?: Date;
}

export interface NavigationLink {
  label: string;
  href: string;
  submenu?: NavigationLink[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}
