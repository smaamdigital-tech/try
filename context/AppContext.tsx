
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Permissions, Announcement, Program, SiteConfig, Teacher, SchoolProfile } from '../types';
import { MOCK_TEACHERS } from '../constants';

interface AppContextType {
  user: User | null;
  login: (username: string, role: 'admin' | 'adminsistem') => void;
  logout: () => void;
  permissions: Permissions;
  updatePermissions: (newPermissions: Permissions) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Data SDK Simulation
  announcements: Announcement[];
  addAnnouncement: (announcement: Announcement) => void;
  programs: Program[];
  addProgram: (program: Program) => void;
  updateProgram: (program: Program) => void;
  deleteProgram: (id: number) => void;

  // Teacher Data
  teachers: Teacher[];
  addTeacher: (teacher: Teacher) => void;
  updateTeacher: (teacher: Teacher) => void;
  deleteTeacher: (id: string) => void;
  
  // Element SDK Simulation
  siteConfig: SiteConfig;
  updateSiteConfig: (config: Partial<SiteConfig>) => void;

  // School Profile Data
  schoolProfile: SchoolProfile;
  updateSchoolProfile: (profile: SchoolProfile) => void;

  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Cloud Sync
  saveToCloud: () => Promise<void>;
  loadFromCloud: () => Promise<void>;
  isSyncing: boolean;
  lastSyncTime: number; // To trigger re-renders in components
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultPermissions: Permissions = {
  pentadbiran: true,
  kurikulum: true,
  hem: true,
  kokurikulum: true,
  takwim: true,
  program: true,
  pengumuman: true,
  laporan: true,
};

const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Mesyuarat Agung PIBG Kali Ke-15",
    date: "25-10-2026",
    summary: "Semua ibu bapa dan guru dijemput hadir ke Dewan Utama bermula jam 8.00 pagi.",
    views: 124,
    likes: 45
  },
  {
    id: 2,
    title: "Cuti Peristiwa Sempena Sukan Tahunan",
    date: "01-11-2026",
    summary: "Sekolah akan bercuti pada hari Isnin sebagai cuti peristiwa.",
    views: 312,
    likes: 89
  }
];

const initialPrograms: Program[] = [
  {
    id: 1,
    title: "Minggu Bahasa & Budaya",
    date: "15-11-2026",
    time: "08:00 Pagi",
    location: "Dewan Terbuka SMAAM",
    category: "Kurikulum",
    description: "Pertandingan pidato, sajak dan penulisan esei yang melibatkan semua pelajar tingkatan 1 hingga 5. Program ini bertujuan memartabatkan bahasa kebangsaan.",
    image1: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=600&auto=format&fit=crop",
    image2: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Kem Kepimpinan Pengawas",
    date: "20-11-2026",
    time: "03:00 Petang",
    location: "Kem Bina Negara, Mersing",
    category: "HEM",
    description: "Program jati diri untuk semua pengawas lantikan baharu bagi sesi 2027. Aktiviti lasak dan ceramah kepimpinan akan dijalankan selama 3 hari 2 malam.",
    image1: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Kejohanan Futsal Antara Rumah",
    date: "05-12-2026",
    time: "08:00 Pagi",
    location: "Gelanggang Futsal Komuniti",
    category: "Sukan",
    description: "Saringan akhir di padang sekolah. Semua rumah sukan wajib menghantar wakil.",
    image1: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600&auto=format&fit=crop"
  }
];

const initialProfile: SchoolProfile = {
  principalName: "Zulkeffle bin Muhammad",
  principalTitle: "Pengetua SMAAM",
  principalImage: "https://i.postimg.cc/GpTZX8V9/us-zul.png",
  principalQuote: "Selamat datang ke SMA Al-Khairiah Al-Islamiah Mersing. Bersama-sama kita membentuk generasi ulul albab yang cemerlang di dunia dan akhirat.",
  schoolCode: "JFT4001",
  schoolAddress: "Jalan Dato' Onn, 86800 Mersing, Johor",
  schoolEmail: "jft4001@moe.edu.my",
  schoolPhone: "07-7996272",
  schoolGrade: "A | Luar Bandar",
  studentCount: "650",
  teacherCount: "45",
  mission: "Mengekalkan kegemilangan sekolah dan melahirkan generasi berilmu, beramal dan bertaqwa.",
  vision: "Pendidikan Berkualiti, Insan Terdidik, Negara Sejahtera.",
  motto: "ILMU. IMAN. AMAL.",
  slogan: "SMAAM Gemilang!",
  charter: "Kami komited untuk menyampaikan pendidikan yang holistik dan berkualiti kepada setiap pelajar bagi memastikan potensi individu dapat dikembangkan secara menyeluruh."
};

const DEFAULT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxZRbQndRE48rCgUpEHjGqBXr_rBd8vWyD4KHbCVW-TXifbk42FfRGPGuzbs9FuRl6gSg/exec";

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permissions>(defaultPermissions);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(initialProfile);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(Date.now());
  
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    systemTitle: "PENGURUSAN DIGITAL SMAAM",
    schoolName: "SMA Al-Khairiah Al-Islamiah Mersing",
    welcomeMessage: "Selamat Datang ke Dashboard Utama",
    googleScriptUrl: DEFAULT_SCRIPT_URL
  });

  // Load data from localStorage
  useEffect(() => {
    const savedPermissions = localStorage.getItem('smaam_permissions');
    if (savedPermissions) setPermissions(JSON.parse(savedPermissions));

    const savedConfig = localStorage.getItem('smaam_config');
    if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (!parsed.googleScriptUrl || parsed.googleScriptUrl.includes("AKfycbxpzq6lpFYRe7QQ6lGF7J")) {
            parsed.googleScriptUrl = DEFAULT_SCRIPT_URL;
        }
        setSiteConfig(parsed);
    }
    
    // Check session
    const savedUser = sessionStorage.getItem('smaam_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    // Load Teachers
    const savedTeachers = localStorage.getItem('smaam_teachers');
    if (savedTeachers) setTeachers(JSON.parse(savedTeachers));

    // Load School Profile
    const savedProfile = localStorage.getItem('smaam_school_profile');
    if (savedProfile) setSchoolProfile(JSON.parse(savedProfile));
    
  }, []);

  // Save teachers to local storage whenever changed
  useEffect(() => {
    localStorage.setItem('smaam_teachers', JSON.stringify(teachers));
  }, [teachers]);

  const login = (username: string, role: 'admin' | 'adminsistem') => {
    const newUser = { username, role, name: role === 'adminsistem' ? 'Admin Sistem' : 'Admin Bertugas' };
    setUser(newUser);
    sessionStorage.setItem('smaam_user', JSON.stringify(newUser));
    showToast(`Selamat datang, ${newUser.name}`);
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('smaam_user');
    setActiveTab('Dashboard');
    showToast("Log keluar berjaya");
  };

  const updatePermissions = (newPermissions: Permissions) => {
    setPermissions(newPermissions);
    localStorage.setItem('smaam_permissions', JSON.stringify(newPermissions));
  };

  const updateSiteConfig = (config: Partial<SiteConfig>) => {
    const newConfig = { ...siteConfig, ...config };
    setSiteConfig(newConfig);
    localStorage.setItem('smaam_config', JSON.stringify(newConfig));
  };

  const updateSchoolProfile = (profile: SchoolProfile) => {
    setSchoolProfile(profile);
    localStorage.setItem('smaam_school_profile', JSON.stringify(profile));
    showToast("Profil sekolah dikemaskini");
  };

  const addAnnouncement = (item: Announcement) => {
    setAnnouncements([item, ...announcements]);
    showToast("Pengumuman ditambah");
  };

  const addProgram = (item: Program) => {
    setPrograms([item, ...programs]);
    showToast("Program ditambah");
  };

  const updateProgram = (updatedItem: Program) => {
    setPrograms(programs.map(p => p.id === updatedItem.id ? updatedItem : p));
    showToast("Program dikemaskini");
  };

  const deleteProgram = (id: number) => {
    setPrograms(programs.filter(p => p.id !== id));
    showToast("Program dipadam");
  };

  // Teacher Handlers
  const addTeacher = (teacher: Teacher) => {
      setTeachers([...teachers, teacher]);
      showToast("Guru ditambah");
  };

  const updateTeacher = (updated: Teacher) => {
      setTeachers(teachers.map(t => t.id === updated.id ? updated : t));
      showToast("Maklumat guru dikemaskini");
  };

  const deleteTeacher = (id: string) => {
      setTeachers(teachers.filter(t => t.id !== id));
      showToast("Rekod guru dipadam");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- GOOGLE SHEETS SYNC LOGIC ---

  const getLocalStorageData = () => {
    const data: Record<string, any> = {};
    for(let i=0; i<localStorage.length; i++) {
        const key = localStorage.key(i);
        if(key && key.startsWith('smaam_') && 
           !['smaam_permissions', 'smaam_config', 'smaam_teachers', 'smaam_school_profile'].includes(key)) {
            try {
                data[key] = JSON.parse(localStorage.getItem(key)!);
            } catch {
                data[key] = localStorage.getItem(key);
            }
        }
    }
    return data;
  };

  const saveToCloud = async () => {
    if (!siteConfig.googleScriptUrl) {
      alert("Sila tetapkan URL Google Apps Script di Tetapan Admin dahulu.");
      return;
    }

    setIsSyncing(true);
    showToast("Sedang menyimpan semua data ke Cloud...");

    try {
      const payload = {
        action: 'save',
        data: {
          permissions,
          siteConfig,
          announcements,
          programs,
          teachers,
          schoolProfile, // Add profile to payload
          customData: getLocalStorageData() 
        }
      };

      const response = await fetch(siteConfig.googleScriptUrl, {
        method: 'POST',
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      
      if (result.status === 'success') {
         showToast("✅ Berjaya disimpan di Google Sheet!");
      } else {
         showToast("⚠️ Ralat: " + result.message);
      }

    } catch (error) {
      console.error(error);
      showToast("❌ Gagal menyambung ke server.");
    } finally {
      setIsSyncing(false);
    }
  };

  const loadFromCloud = async () => {
    if (!siteConfig.googleScriptUrl) {
      alert("Sila tetapkan URL Google Apps Script di Tetapan Admin dahulu.");
      return;
    }

    setIsSyncing(true);
    showToast("Sedang memuat turun data...");

    try {
       const url = `${siteConfig.googleScriptUrl}?action=read`;
       const response = await fetch(url);
       const result = await response.json();

       if (result.status === 'success' && result.data) {
          const d = result.data;
          
          if(d.permissions) {
             setPermissions(d.permissions);
             localStorage.setItem('smaam_permissions', JSON.stringify(d.permissions));
          }
          if(d.siteConfig) {
             const mergedConfig = { ...d.siteConfig, googleScriptUrl: siteConfig.googleScriptUrl };
             setSiteConfig(mergedConfig);
             localStorage.setItem('smaam_config', JSON.stringify(mergedConfig));
          }
          if(d.announcements) setAnnouncements(d.announcements);
          if(d.programs) setPrograms(d.programs);
          if(d.teachers) setTeachers(d.teachers);
          
          if(d.schoolProfile) {
              setSchoolProfile(d.schoolProfile);
              localStorage.setItem('smaam_school_profile', JSON.stringify(d.schoolProfile));
          }

          // Restore custom data
          if (d.customData) {
             Object.keys(d.customData).forEach(key => {
                 const val = d.customData[key];
                 localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
             });
             setLastSyncTime(Date.now());
          }

          showToast("✅ Data berjaya dimuat turun!");
       } else {
          showToast("⚠️ Tiada data dijumpai atau ralat server.");
       }

    } catch (error) {
       console.error(error);
       showToast("❌ Gagal memuat turun data.");
    } finally {
       setIsSyncing(false);
    }
  };

  return (
    <AppContext.Provider value={{
      user, login, logout,
      permissions, updatePermissions,
      activeTab, setActiveTab,
      announcements, addAnnouncement,
      programs, addProgram, updateProgram, deleteProgram,
      teachers, addTeacher, updateTeacher, deleteTeacher,
      siteConfig, updateSiteConfig,
      schoolProfile, updateSchoolProfile,
      toastMessage, showToast,
      saveToCloud, loadFromCloud, isSyncing, lastSyncTime
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
