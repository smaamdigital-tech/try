
export interface User {
  username: string;
  role: 'admin' | 'adminsistem' | null;
  name: string;
}

export interface Announcement {
  id: number;
  title: string;
  date: string;
  summary: string;
  views: number;
  likes: number;
}

export interface Program {
  id: number;
  title: string;
  date: string;
  time?: string;
  location?: string;
  category: string;
  description: string;
  image1?: string;
  image2?: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  classes: string[] | string;
}

export interface Permissions {
  pentadbiran: boolean;
  kurikulum: boolean;
  hem: boolean;
  kokurikulum: boolean;
  takwim: boolean;
  program: boolean;
  pengumuman: boolean;
  laporan: boolean;
}

export interface SiteConfig {
  systemTitle: string;
  schoolName: string;
  welcomeMessage: string;
  googleScriptUrl?: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  attendance: number;
  averageScore: number;
  behaviorScore: number;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  attendanceRate: number;
  averageGpa: number;
}

export interface SchoolProfile {
  principalName: string;
  principalImage: string;
  principalTitle: string; // e.g., Pengetua Cemerlang
  principalQuote: string;
  schoolCode: string;
  schoolAddress: string;
  schoolEmail: string;
  schoolPhone: string;
  schoolGrade: string;
  studentCount: string;
  teacherCount: string;
  mission: string;
  vision: string;
  motto: string;
  slogan: string;
  charter: string; // Piagam Pelanggan
}
