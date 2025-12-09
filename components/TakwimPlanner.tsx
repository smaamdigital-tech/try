import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface TakwimPlannerProps {
  type: string;
}

// --- INTERFACES ---
interface SchoolWeekRow {
  id: number;
  week: string;
  date: string;
  notes: string;
  totalDays: string;
  totalWeeks: string;
  rowSpan?: number;
  isHoliday?: boolean;
}

interface ExamWeekRow {
  id: number;
  week: string;
  date: string;
  dalaman: string;
  jaj: string;
  awam: string;
  isHoliday?: boolean;
}

interface CalendarEvent {
  day: number;
  label: string;
  isHoliday?: boolean;
  isSchoolHoliday?: boolean;
  color?: string; 
  icon?: string;
  islamicDate?: string;
}

interface MonthData {
  id: number;
  name: string;
  islamicMonth: string;
  headerColor1: string;
  headerColor2: string;
  startDay: number; // 0=Sun, 1=Mon, etc.
  daysInMonth: number;
  catatan: React.ReactNode;
  events: CalendarEvent[];
}

// --- DATA INITIALIZATION ---

// 2026 Calendar Data (Full Year)
const calendar2026Data: MonthData[] = [
  {
    id: 0,
    name: 'JANUARI 2026',
    islamicMonth: "REJAB - SYA'BAN 1447",
    headerColor1: 'bg-[#1a237e]',
    headerColor2: 'bg-[#2e7d32]',
    startDay: 4, // Thursday
    daysInMonth: 31,
    catatan: <p className="text-xs">11 Jan: Mula Sekolah Sesi 2026</p>,
    events: [
      { day: 1, label: 'Tahun Baru', isHoliday: true },
      { day: 11, label: 'Mula Sekolah', icon: '🎒' },
    ]
  },
  {
    id: 1,
    name: 'FEBRUARI 2026',
    islamicMonth: "SYA'BAN - RAMADAN 1447",
    headerColor1: 'bg-[#b71c1c]',
    headerColor2: 'bg-[#f57f17]',
    startDay: 0, // Sunday
    daysInMonth: 28,
    catatan: <p className="text-xs">17 Feb: Awal Ramadan</p>,
    events: [
      { day: 1, label: 'Hari Thaipusam', isHoliday: true },
      { day: 17, label: 'Awal Ramadan', icon: '🌙' },
    ]
  },
  {
    id: 2,
    name: 'MAC 2026',
    islamicMonth: "RAMADAN - SYAWAL 1447",
    headerColor1: 'bg-[#006064]',
    headerColor2: 'bg-[#4a148c]',
    startDay: 0, // Sunday
    daysInMonth: 31,
    catatan: <p className="text-xs">Cuti Hari Raya Aidilfitri</p>,
    events: [
      { day: 20, label: 'Raya Aidilfitri', isHoliday: true, color: 'bg-green-200' },
      { day: 21, label: 'Raya Aidilfitri', isHoliday: true, color: 'bg-green-200' },
    ]
  },
  {
    id: 3,
    name: 'APRIL 2026',
    islamicMonth: "SYAWAL - ZULKAEDAH 1447",
    headerColor1: 'bg-[#33691e]',
    headerColor2: 'bg-[#827717]',
    startDay: 3, // Wednesday
    daysInMonth: 30,
    catatan: <p className="text-xs">Mesyuarat Agung PIBG</p>,
    events: []
  },
  {
    id: 4,
    name: 'MEI 2026',
    islamicMonth: "ZULKAEDAH - ZULHIJJAH 1447",
    headerColor1: 'bg-[#bf360c]',
    headerColor2: 'bg-[#3e2723]',
    startDay: 5, // Friday
    daysInMonth: 31,
    catatan: <p className="text-xs">1 Mei: Hari Pekerja<br/>4 Mei: Hari Wesak</p>,
    events: [
        { day: 1, label: 'Hari Pekerja', isHoliday: true },
        { day: 4, label: 'Hari Wesak', isHoliday: true },
        { day: 16, label: 'Hari Guru', icon: '👨‍🏫' }
    ]
  },
  {
    id: 5,
    name: 'JUN 2026',
    islamicMonth: "ZULHIJJAH 1447 - MUHARRAM 1448",
    headerColor1: 'bg-[#0d47a1]',
    headerColor2: 'bg-[#1b5e20]',
    startDay: 1, // Monday
    daysInMonth: 30,
    catatan: <p className="text-xs">Cuti Penggal 1<br/>Hari Raya Haji</p>,
    events: [
        { day: 1, label: 'Hari Gawai', isHoliday: true },
        { day: 2, label: 'Hari Gawai', isHoliday: true },
        { day: 6, label: 'Keputeraan YDPA', isHoliday: true },
        { day: 27, label: 'Raya Haji', isHoliday: true },
    ]
  },
  {
    id: 6,
    name: 'JULAI 2026',
    islamicMonth: "MUHARRAM - SAFAR 1448",
    headerColor1: 'bg-[#4a148c]',
    headerColor2: 'bg-[#c2185b]',
    startDay: 3, // Wednesday
    daysInMonth: 31,
    catatan: <p className="text-xs">18 Julai: Awal Muharram</p>,
    events: [
        { day: 7, label: 'Hari Bandar Warisan Dunia', isHoliday: false },
        { day: 18, label: 'Awal Muharram', isHoliday: true },
    ]
  },
  {
    id: 7,
    name: 'OGOS 2026',
    islamicMonth: "SAFAR - RABIULAWAL 1448",
    headerColor1: 'bg-[#e65100]',
    headerColor2: 'bg-[#263238]',
    startDay: 6, // Saturday
    daysInMonth: 31,
    catatan: <p className="text-xs">31 Ogos: Hari Kebangsaan</p>,
    events: [
        { day: 31, label: 'Merdeka', isHoliday: true },
    ]
  },
  {
    id: 8,
    name: 'SEPTEMBER 2026',
    islamicMonth: "RABIULAWAL - RABIULAKHIR 1448",
    headerColor1: 'bg-[#004d40]',
    headerColor2: 'bg-[#880e4f]',
    startDay: 2, // Tuesday
    daysInMonth: 30,
    catatan: <p className="text-xs">16 Sept: Hari Malaysia</p>,
    events: [
        { day: 16, label: 'Hari Malaysia', isHoliday: true },
        { day: 28, label: 'Maulidur Rasul', isHoliday: true },
    ]
  },
  {
    id: 9,
    name: 'OKTOBER 2026',
    islamicMonth: "RABIULAKHIR - JAMADILAWAL 1448",
    headerColor1: 'bg-[#311b92]',
    headerColor2: 'bg-[#01579b]',
    startDay: 4, // Thursday
    daysInMonth: 31,
    catatan: <p className="text-xs">Bulan Sukan Negara</p>,
    events: [
        { day: 10, label: 'Hari Sukan Negara', icon: '⚽' },
    ]
  },
  {
    id: 10,
    name: 'NOVEMBER 2026',
    islamicMonth: "JAMADILAWAL - JAMADILAKHIR 1448",
    headerColor1: 'bg-[#b71c1c]',
    headerColor2: 'bg-[#006064]',
    startDay: 0, // Sunday
    daysInMonth: 30,
    catatan: <p className="text-xs">12 Nov: Deepavali</p>,
    events: [
        { day: 12, label: 'Deepavali', isHoliday: true },
    ]
  },
  {
    id: 11,
    name: 'DISEMBER 2026',
    islamicMonth: "JAMADILAKHIR - REJAB 1448",
    headerColor1: 'bg-[#1b5e20]',
    headerColor2: 'bg-[#b71c1c]',
    startDay: 2, // Tuesday
    daysInMonth: 31,
    catatan: <p className="text-xs">Cuti Akhir Tahun bermula</p>,
    events: [
        { day: 25, label: 'Hari Krismas', isHoliday: true },
    ]
  },
];

const initialSchoolWeeks: SchoolWeekRow[] = [
  { id: 1, week: '1', date: '12 – 16 Jan 2026', notes: '', totalDays: '43', totalWeeks: '10', rowSpan: 10 },
  { id: 2, week: '2', date: '19 – 23 Jan 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 3, week: '3', date: '26 – 30 Jan 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 4, week: '4', date: '02 – 06 Feb 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 5, week: '5', date: '09 – 13 Feb 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 6, week: '6', date: '16 – 20 Feb 2026', notes: '17 Feb: Awal Ramadan', totalDays: '', totalWeeks: '' },
  { id: 7, week: '7', date: '23 – 27 Feb 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 8, week: '8', date: '02 – 06 Mac 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 9, week: '9', date: '09 – 13 Mac 2026', notes: '', totalDays: '', totalWeeks: '' },
  { id: 10, week: '10', date: '16 – 20 Mac 2026', notes: 'Ujian 1', totalDays: '', totalWeeks: '' },
  { id: 11, week: 'CUTI', date: '23 – 31 Mac 2026', notes: 'CUTI PERTENGAHAN PENGGAL 1\nHARI RAYA AIDILFITRI', totalDays: '9', totalWeeks: '1', isHoliday: true },
];

const initialExamWeeks: ExamWeekRow[] = [
    { id: 1, week: '10', date: '16 – 20 Mac 2026', dalaman: 'Ujian Sumatif 1', jaj: '', awam: '' },
    { id: 2, week: '20', date: '25 – 29 Mei 2026', dalaman: 'Peperiksaan Pertengahan Tahun', jaj: '', awam: '' },
    { id: 3, week: '35', date: '14 – 18 Sep 2026', dalaman: 'Percubaan SPM', jaj: 'Percubaan STAM', awam: '' },
    { id: 4, week: '40', date: '19 – 23 Okt 2026', dalaman: 'Peperiksaan Akhir Tahun', jaj: '', awam: '' },
    { id: 5, week: '42', date: '02 – 06 Nov 2026', dalaman: '', jaj: '', awam: 'SPM Bermula (Jangkaan)' },
];

export const TakwimPlanner: React.FC<TakwimPlannerProps> = ({ type }) => {
  const { user, showToast, lastSyncTime } = useApp();
  const isAdmin = user?.role === 'admin' || user?.role === 'adminsistem';
  
  // --- STATE WITH PERSISTENCE ---
  const [schoolWeeks, setSchoolWeeks] = useState<SchoolWeekRow[]>(initialSchoolWeeks);
  const [examWeeks, setExamWeeks] = useState<ExamWeekRow[]>(initialExamWeeks);
  
  useEffect(() => {
    const savedSchoolWeeks = localStorage.getItem('smaam_takwim_schoolWeeks');
    if (savedSchoolWeeks) try { setSchoolWeeks(JSON.parse(savedSchoolWeeks)); } catch (e) {}
    const savedExamWeeks = localStorage.getItem('smaam_takwim_examWeeks');
    if (savedExamWeeks) try { setExamWeeks(JSON.parse(savedExamWeeks)); } catch (e) {}
  }, [lastSyncTime]);

  useEffect(() => { localStorage.setItem('smaam_takwim_schoolWeeks', JSON.stringify(schoolWeeks)); }, [schoolWeeks]);
  useEffect(() => { localStorage.setItem('smaam_takwim_examWeeks', JSON.stringify(examWeeks)); }, [examWeeks]);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editType, setEditType] = useState<'school' | 'exam'>('school');
  const [editingRow, setEditingRow] = useState<any>(null);

  const handleOpenEdit = (type: 'school' | 'exam', row: any) => {
      setEditType(type);
      setEditingRow(row);
      setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editType === 'school') {
          setSchoolWeeks(schoolWeeks.map(row => row.id === editingRow.id ? editingRow : row));
      } else {
          setExamWeeks(examWeeks.map(row => row.id === editingRow.id ? editingRow : row));
      }
      setIsEditModalOpen(false);
      showToast("Data berjaya dikemaskini.");
  };

  const renderCalendarView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {calendar2026Data.map((month) => (
        <div key={month.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full border border-gray-200">
          {/* Header */}
          <div className="flex text-white h-16">
            <div className={`flex-1 ${month.headerColor1} flex items-center justify-center font-bold text-lg tracking-wider`}>
              {month.name.split(' ')[0]}
            </div>
            <div className={`flex-1 ${month.headerColor2} flex flex-col items-center justify-center text-[10px] text-center px-1 leading-tight`}>
              {month.islamicMonth}
            </div>
          </div>
          
          {/* Days Grid */}
          <div className="p-2 flex-1">
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {['A','I','S','R','K','J','S'].map((d, i) => (
                <div key={i} className={`text-xs font-bold ${i===6?'text-blue-600':i===0?'text-red-600':'text-gray-600'}`}>
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {Array.from({ length: month.startDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-8"></div>
              ))}
              {Array.from({ length: month.daysInMonth }).map((_, i) => {
                const day = i + 1;
                const event = month.events.find(e => e.day === day);
                const isWeekend = (month.startDay + i) % 7 === 5 || (month.startDay + i) % 7 === 6; // Fri & Sat in Johor
                
                return (
                  <div 
                    key={day} 
                    className={`h-8 flex items-center justify-center text-sm rounded relative group
                      ${event?.isHoliday ? 'bg-yellow-200 font-bold text-red-600 border border-yellow-400' : 
                        isWeekend ? 'bg-gray-100 text-blue-800' : 'text-gray-700 hover:bg-gray-50'}
                      ${event?.color ? event.color : ''}
                    `}
                  >
                    {day}
                    {event && (
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none">
                        {event.label}
                      </div>
                    )}
                    {event?.icon && <span className="absolute -bottom-1 -right-1 text-[10px]">{event.icon}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Notes */}
          <div className="bg-yellow-50 p-3 border-t border-yellow-100 min-h-[60px] flex items-center justify-center text-center">
            {month.catatan}
          </div>
        </div>
      ))}
    </div>
  );

  const SchoolWeeksView = () => (
      <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in">
            <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse border border-gray-600 min-w-[800px]">
                    <thead>
                        <tr className="bg-[#C9B458] text-[#0B132B] font-bold text-sm uppercase">
                            <th className="border border-gray-600 px-4 py-3 w-16">MINGGU</th>
                            <th className="border border-gray-600 px-4 py-3 w-48">TARIKH</th>
                            <th className="border border-gray-600 px-4 py-3">PERKARA / CATATAN</th>
                            <th className="border border-gray-600 px-4 py-3 w-20">HARI</th>
                            <th className="border border-gray-600 px-4 py-3 w-20">MINGGU</th>
                            {isAdmin && <th className="border border-gray-600 px-4 py-3 w-16">EDIT</th>}
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {schoolWeeks.map((item, index) => (
                            <tr key={item.id} className={`${item.isHoliday ? 'bg-[#C9B458] text-[#0B132B] font-bold' : 'hover:bg-[#253252] text-gray-300'}`}>
                                <td className="border border-gray-600 py-3">{item.week}</td>
                                <td className="border border-gray-600 py-3 px-2 font-mono whitespace-nowrap">{item.date}</td>
                                <td className="border border-gray-600 py-3 px-4 text-left whitespace-pre-line leading-relaxed">{item.notes}</td>
                                
                                {item.rowSpan && item.rowSpan > 0 ? (
                                     <td rowSpan={item.rowSpan} className="border border-gray-600 py-3 align-middle bg-[#0B132B] text-white font-bold text-lg">{item.totalDays}</td>
                                ) : ( item.totalDays && <td className="border border-gray-600 py-3">{item.totalDays}</td> )}
                                
                                {item.rowSpan && item.rowSpan > 0 ? (
                                     <td rowSpan={item.rowSpan} className="border border-gray-600 py-3 align-middle bg-[#0B132B] text-white font-bold text-lg">{item.totalWeeks}</td>
                                ) : ( item.totalWeeks && <td className="border border-gray-600 py-3">{item.totalWeeks}</td> )}

                                {isAdmin && (
                                    <td className="border border-gray-600 py-3 px-2">
                                        <button onClick={() => handleOpenEdit('school', item)} className="p-1 rounded hover:bg-white/20">✏️</button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
      </div>
  );

  const TakwimPeperiksaanView = () => (
      <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in">
           <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse border border-gray-600 min-w-[900px]">
                    <thead>
                        <tr className="bg-[#C9B458] text-[#0B132B] text-sm uppercase font-bold">
                            <th className="border border-gray-600 px-2 py-3 w-12">M</th>
                            <th className="border border-gray-600 px-4 py-3 w-40">TARIKH</th>
                            <th className="border border-gray-600 px-4 py-3">PEPERIKSAAN DALAMAN</th>
                            <th className="border border-gray-600 px-4 py-3">PEPERIKSAAN JAJ</th>
                            <th className="border border-gray-600 px-4 py-3">PEPERIKSAAN AWAM</th>
                            {isAdmin && <th className="border border-gray-600 px-2 py-3 w-16">EDIT</th>}
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {examWeeks.map((item) => (
                             <tr key={item.id} className="hover:bg-[#253252] text-gray-300 transition-colors">
                                    <td className="border border-gray-600 py-3 font-mono text-[#C9B458] font-bold">{item.week}</td>
                                    <td className="border border-gray-600 py-3 px-2 text-white whitespace-nowrap">{item.date}</td>
                                    <td className="border border-gray-600 py-3 px-2 text-left font-medium text-blue-300">{item.dalaman}</td>
                                    <td className="border border-gray-600 py-3 px-2 text-left font-medium text-green-300">{item.jaj}</td>
                                    <td className="border border-gray-600 py-3 px-2 text-left font-medium text-red-300">{item.awam}</td>
                                    {isAdmin && (
                                        <td className="border border-gray-600 py-2 px-2 text-center">
                                             <button onClick={() => handleOpenEdit('exam', item)} className="p-1 rounded hover:bg-white/20">✏️</button>
                                        </td>
                                    )}
                             </tr>
                        ))}
                    </tbody>
                </table>
            </div>
      </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6 pb-20 fade-in w-full">
      <div className="flex items-center gap-2 text-sm text-[#C9B458] font-mono mb-2">
         <span>TAKWIM</span>
         <span>/</span>
         <span className="capitalize">{type}</span>
      </div>

      <div className="flex justify-between items-end border-b border-gray-700 pb-4 mb-6">
        <h2 className="text-3xl font-bold text-white font-montserrat">
            {type === 'Kalendar' ? 'Kalendar Akademik 2026' : type}
        </h2>
        {type === 'Kalendar' && (
            <span className="text-xs text-gray-400 bg-[#1C2541] px-3 py-1 rounded-full border border-gray-600">
                Sesi Persekolahan 2026/2027
            </span>
        )}
      </div>

      {type === 'Kalendar' && renderCalendarView()}
      {type === 'Minggu Persekolahan' && <SchoolWeeksView />}
      {type === 'Takwim Peperiksaan' && <TakwimPeperiksaanView />}
      
      {!['Kalendar', 'Minggu Persekolahan', 'Takwim Peperiksaan'].includes(type) && (
          <div className="flex flex-col items-center justify-center p-20 text-center text-gray-500 bg-[#1C2541] rounded-xl border border-dashed border-gray-700">
              <span className="text-4xl mb-4">🚧</span>
              <p className="text-lg font-semibold text-gray-300">Modul {type}</p>
              <p className="text-sm">Sedang dalam proses kemaskini data.</p>
          </div>
      )}

      {/* --- EDIT MODAL --- */}
      {isEditModalOpen && editingRow && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in px-4">
              <div className="bg-[#1C2541] w-full max-w-lg p-6 rounded-xl border border-[#C9B458] shadow-2xl max-h-[90vh] overflow-y-auto">
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
                      Edit Data
                  </h3>
                  <form onSubmit={handleSaveEdit} className="space-y-4">
                      {Object.keys(editingRow).map((key) => {
                          if (key === 'id' || key === 'isHoliday' || key === 'rowSpan') return null;
                          return (
                              <div key={key}>
                                  <label className="text-xs text-[#C9B458] uppercase font-bold tracking-wider mb-1 block">
                                      {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </label>
                                  {key === 'notes' || key === 'dalaman' || key === 'jaj' || key === 'awam' ? (
                                      <textarea 
                                        className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white h-24 focus:border-[#C9B458] outline-none"
                                        value={editingRow[key]}
                                        onChange={e => setEditingRow({...editingRow, [key]: e.target.value})}
                                      />
                                  ) : (
                                      <input 
                                        className="w-full bg-[#0B132B] border border-gray-700 rounded p-2 text-white focus:border-[#C9B458] outline-none"
                                        value={editingRow[key]}
                                        onChange={e => setEditingRow({...editingRow, [key]: e.target.value})}
                                      />
                                  )}
                              </div>
                          )
                      })}
                      
                      <div className="flex gap-2 pt-4 border-t border-gray-700 mt-4">
                          <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors">Batal</button>
                          <button type="submit" className="flex-1 py-2 bg-[#C9B458] text-[#0B132B] font-bold rounded hover:bg-yellow-400 transition-colors">Simpan</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};
