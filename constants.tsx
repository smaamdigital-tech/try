import { Student, Teacher, DashboardStats } from './types';
import { Users, GraduationCap, BookOpen, Brain, LayoutDashboard, Calendar } from 'lucide-react';

export const APP_NAME = "e-Sekolah PINTAR";

export const MOCK_STUDENTS: Student[] = [
  { id: 'S001', name: 'Ahmad Albab', grade: '5 Bestari', attendance: 95, averageScore: 88, behaviorScore: 9 },
  { id: 'S002', name: 'Siti Nurhaliza', grade: '5 Bestari', attendance: 98, averageScore: 92, behaviorScore: 10 },
  { id: 'S003', name: 'Chong Wei', grade: '4 Cerdik', attendance: 85, averageScore: 76, behaviorScore: 7 },
  { id: 'S004', name: 'Muthu Sami', grade: '4 Cerdik', attendance: 92, averageScore: 81, behaviorScore: 8 },
  { id: 'S005', name: 'Jessica Tan', grade: '3 Amanah', attendance: 78, averageScore: 65, behaviorScore: 6 },
  { id: 'S006', name: 'Farid Kamil', grade: '5 Bestari', attendance: 88, averageScore: 70, behaviorScore: 8 },
];

export const MOCK_TEACHERS: Teacher[] = [
  { id: 'T001', name: 'Cikgu Murni', subject: 'Bahasa Melayu', classes: ['5 Bestari', '4 Cerdik'] },
  { id: 'T002', name: 'Mr. Wilson', subject: 'Matematik', classes: ['5 Bestari', '3 Amanah'] },
  { id: 'T003', name: 'Puan Devi', subject: 'Sains', classes: ['4 Cerdik', '3 Amanah'] },
];

export const INITIAL_STATS: DashboardStats = {
  totalStudents: 1250,
  totalTeachers: 85,
  attendanceRate: 94.5,
  averageGpa: 3.2,
};

export const MENU_ITEMS = [
  { id: 'DASHBOARD', label: 'Papan Pemuka', icon: <LayoutDashboard size={20} /> },
  { id: 'STUDENTS', label: 'Pelajar', icon: <GraduationCap size={20} /> },
  { id: 'TEACHERS', label: 'Guru', icon: <Users size={20} /> },
  { id: 'AI_ASSISTANT', label: 'Pembantu AI', icon: <Brain size={20} /> },
];

export const ATTENDANCE_DATA = [
  { name: 'Isnin', hadir: 98, tidakHadir: 2 },
  { name: 'Selasa', hadir: 96, tidakHadir: 4 },
  { name: 'Rabu', hadir: 95, tidakHadir: 5 },
  { name: 'Khamis', hadir: 97, tidakHadir: 3 },
  { name: 'Jumaat', hadir: 92, tidakHadir: 8 },
];

export const PERFORMANCE_DATA = [
  { subject: 'BM', A: 40, B: 30, C: 20, D: 10, E: 0 },
  { subject: 'BI', A: 25, B: 35, C: 25, D: 10, E: 5 },
  { subject: 'Math', A: 20, B: 25, C: 30, D: 15, E: 10 },
  { subject: 'Sains', A: 30, B: 30, C: 25, D: 10, E: 5 },
  { subject: 'Sejarah', A: 45, B: 25, C: 20, D: 5, E: 5 },
];
