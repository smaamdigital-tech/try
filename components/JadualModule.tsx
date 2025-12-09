import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

interface JadualModuleProps {
  type: string;
}

// --- CONSTANTS ---
const TEACHER_LIST = [
  "Zulkeffle bin Muhammad",
  "Noratikah binti Abd. Kadir",
  "Siti Aminah binti Mohamed",
  "Ahmad Albab bin Syukri",
  "Nurul Huda binti Ismail",
  "Razali bin Othman"
];

const CLASS_CODES = ["1 AL-HANAFI", "1 AL-MALIKI", "1 AL-SYAFIE", "2 AL-HANAFI", "2 AL-MALIKI", "3 AL-HANAFI", "3 AL-MALIKI", "4 AL-HANAFI", "4 AL-MALIKI", "5 AL-HANAFI", "5 AL-MALIKI"];

const timeSlots = ["7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "1:00", "1:30", "2:00", "2:30", "3:00"];
const days = ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis']; // Johor Week

export const JadualModule: React.FC<JadualModuleProps> = ({ type }) => {
  const { user, showToast, lastSyncTime } = useApp();
  const isAdmin = user?.role === 'admin' || user?.role === 'adminsistem';

  // --- STATE WITH PERSISTENCE ---
  const [reliefList, setReliefList] = useState<any[]>([]);
  const [classTeachers, setClassTeachers] = useState<any[]>([]);
  const [speechList, setSpeechList] = useState<any[]>([]);
  const [scheduleData, setScheduleData] = useState<Record<string, any>>({}); // Stores slots for both Personal and Class

  // Load Data
  useEffect(() => {
     const sRelief = localStorage.getItem('smaam_jadual_relief');
     if(sRelief) try { setReliefList(JSON.parse(sRelief)) } catch(e){}
     else setReliefList([
        {id: 1, time: '8:00 - 9:00', class: '5 AL-HANAFI', subject: 'Matematik', relief: 'Cikgu Razali', absent: 'Cikgu Murni'}
     ]);

     const sClassT = localStorage.getItem('smaam_jadual_classTeachers');
     if(sClassT) try { setClassTeachers(JSON.parse(sClassT)) } catch(e){}
     else setClassTeachers(CLASS_CODES.map((c, i) => ({ id: i, className: c, teacherName: TEACHER_LIST[i % TEACHER_LIST.length] })));

     const sSpeech = localStorage.getItem('smaam_jadual_speech');
     if(sSpeech) try { setSpeechList(JSON.parse(sSpeech)) } catch(e){}
     else setSpeechList([
         {id: 1, date: '12-01-2026', teacher: 'Zulkeffle bin Muhammad', topic: 'Amanat Tahun Baru'},
         {id: 2, date: '19-01-2026', teacher: 'Siti Aminah binti Mohamed', topic: 'Disiplin Pelajar'}
     ]);

     const sSched = localStorage.getItem('smaam_jadual_slots');
     if(sSched) try { setScheduleData(JSON.parse(sSched)) } catch(e){}

  }, [lastSyncTime]);

  // Persist Data
  useEffect(() => { localStorage.setItem('smaam_jadual_relief', JSON.stringify(reliefList)); }, [reliefList]);
  useEffect(() => { localStorage.setItem('smaam_jadual_classTeachers', JSON.stringify(classTeachers)); }, [classTeachers]);
  useEffect(() => { localStorage.setItem('smaam_jadual_speech', JSON.stringify(speechList)); }, [speechList]);
  useEffect(() => { localStorage.setItem('smaam_jadual_slots', JSON.stringify(scheduleData)); }, [scheduleData]);

  // --- UI STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'relief' | 'classTeacher' | 'scheduleSlot' | 'speech'>('relief');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  
  // Filters
  const [selectedTeacher, setSelectedTeacher] = useState(TEACHER_LIST[0]);
  const [selectedClass, setSelectedClass] = useState(CLASS_CODES[0]);

  // --- HELPERS ---
  const getSlotData = (contextKey: string, day: string, time: string) => {
    const key = `${contextKey}-${day}-${time}`;
    return scheduleData[key] || null;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalType === 'relief') {
        const newItem = { ...formData, id: editingItem?.id || Date.now() };
        if(editingItem) setReliefList(reliefList.map(r => r.id === newItem.id ? newItem : r));
        else setReliefList([...reliefList, newItem]);
    } 
    else if (modalType === 'classTeacher') {
        setClassTeachers(classTeachers.map(c => c.id === editingItem.id ? { ...c, teacherName: formData.teacherName } : c));
    }
    else if (modalType === 'speech') {
        const newItem = { ...formData, id: editingItem?.id || Date.now() };
        if(editingItem) setSpeechList(speechList.map(s => s.id === newItem.id ? newItem : s));
        else setSpeechList([...speechList, newItem]);
    }
    else if (modalType === 'scheduleSlot') {
        const key = `${formData.context}-${formData.day}-${formData.time}`;
        const newSlotData = { 
            subject: formData.subject, 
            code: formData.code, 
            info: formData.info,
            color: formData.color || 'bg-blue-900/50 text-blue-200 border-blue-700' 
        };
        // If empty subject, delete the key (clear slot)
        if (!newSlotData.subject) {
            const newData = {...scheduleData};
            delete newData[key];
            setScheduleData(newData);
        } else {
            setScheduleData(prev => ({ ...prev, [key]: newSlotData }));
        }
    }

    setIsModalOpen(false);
    showToast("Data berjaya disimpan.");
  };

  const openEditModal = (type: any, item: any, extraData?: any) => {
    setModalType(type);
    setEditingItem(item);
    setIsModalOpen(true);
    
    if (type === 'relief') {
        setFormData(item || { time: '', class: '', subject: '', relief: '', absent: '' });
    } else if (type === 'classTeacher') {
        setFormData({ teacherName: item.teacherName });
    } else if (type === 'speech') {
        setFormData(item || { date: '', teacher: '', topic: '' });
    } else if (type === 'scheduleSlot') {
        setFormData({ 
            ...extraData, 
            subject: item?.subject || '', 
            code: item?.code || '', 
            info: item?.info || '',
            color: item?.color || 'bg-blue-900/50 text-blue-200 border-blue-700'
        });
    }
  };

  const handleDelete = (type: string, id: number) => {
      if(!window.confirm("Padam rekod ini?")) return;
      if (type === 'relief') setReliefList(reliefList.filter(i => i.id !== id));
      if (type === 'speech') setSpeechList(speechList.filter(i => i.id !== id));
  };

  // --- VIEWS ---

  const GuruGantiView = () => (
    <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in">
      <div className="p-6 border-b border-gray-700 bg-[#0B132B] flex justify-between items-center">
         <h3 className="text-xl font-bold text-white flex items-center gap-2">🔁 Jadual Guru Ganti</h3>
         {isAdmin && <button onClick={() => openEditModal('relief', null)} className="bg-[#C9B458] text-[#0B132B] px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-yellow-400">+ Tambah</button>}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr className="bg-[#3A506B]/20 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-700">
              <th className="px-6 py-4 font-semibold">Masa</th>
              <th className="px-6 py-4 font-semibold">Kelas</th>
              <th className="px-6 py-4 font-semibold">Subjek</th>
              <th className="px-6 py-4 font-semibold text-red-400">Guru Tidak Hadir</th>
              <th className="px-6 py-4 font-semibold text-green-400">Guru Ganti</th>
              {isAdmin && <th className="px-6 py-4 font-semibold text-right">Tindakan</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 text-sm">
            {reliefList.length > 0 ? reliefList.map((item) => (
              <tr key={item.id} className="hover:bg-[#253252] transition-colors text-gray-300">
                <td className="px-6 py-4 font-mono">{item.time}</td>
                <td className="px-6 py-4 font-bold text-white">{item.class}</td>
                <td className="px-6 py-4">{item.subject}</td>
                <td className="px-6 py-4 text-red-300">{item.absent}</td>
                <td className="px-6 py-4 text-[#C9B458] font-bold bg-[#C9B458]/10 rounded">{item.relief}</td>
                {isAdmin && (
                    <td className="px-6 py-4 text-right flex justify-end gap-2">
                        <button onClick={() => openEditModal('relief', item)} className="text-blue-400 hover:text-white">✏️</button>
                        <button onClick={() => handleDelete('relief', item.id)} className="text-red-400 hover:text-white">🗑️</button>
                    </td>
                )}
              </tr>
            )) : (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Tiada guru ganti direkodkan.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const GuruKelasView = () => (
      <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in">
          <div className="p-6 border-b border-gray-700 bg-[#0B132B]">
              <h3 className="text-xl font-bold text-white">👨‍🏫 Senarai Guru Kelas 2026</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
              {classTeachers.map((ct) => (
                  <div key={ct.id} className="bg-[#0B132B] border border-gray-700 rounded-lg p-4 flex justify-between items-center group hover:border-[#C9B458] transition-colors">
                      <div>
                          <div className="text-xs text-[#C9B458] font-bold uppercase mb-1">Kelas</div>
                          <div className="text-lg font-bold text-white">{ct.className}</div>
                          <div className="text-sm text-gray-400 mt-1">{ct.teacherName}</div>
                      </div>
                      {isAdmin && (
                          <button 
                            onClick={() => openEditModal('classTeacher', ct)} 
                            className="w-8 h-8 rounded-full bg-[#1C2541] text-gray-400 hover:text-white hover:bg-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                              ✏️
                          </button>
                      )}
                  </div>
              ))}
          </div>
      </div>
  );

  const JadualBerucapView = () => (
      <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in">
          <div className="p-6 border-b border-gray-700 bg-[#0B132B] flex justify-between items-center">
             <h3 className="text-xl font-bold text-white">🎤 Jadual Berucap (Perhimpunan)</h3>
             {isAdmin && <button onClick={() => openEditModal('speech', null)} className="bg-[#C9B458] text-[#0B132B] px-4 py-2 rounded-lg text-sm font-bold shadow hover:bg-yellow-400">+ Tambah</button>}
          </div>
          <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#3A506B]/20 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-700">
                  <th className="px-6 py-4 font-semibold w-40">Tarikh</th>
                  <th className="px-6 py-4 font-semibold">Nama Guru</th>
                  <th className="px-6 py-4 font-semibold">Tajuk / Topik</th>
                  {isAdmin && <th className="px-6 py-4 font-semibold text-right w-24">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700 text-sm">
                {speechList.map((item) => (
                  <tr key={item.id} className="hover:bg-[#253252] transition-colors text-gray-300">
                    <td className="px-6 py-4 font-mono text-[#C9B458]">{item.date}</td>
                    <td className="px-6 py-4 font-bold text-white">{item.teacher}</td>
                    <td className="px-6 py-4 italic">"{item.topic}"</td>
                    {isAdmin && (
                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                            <button onClick={() => openEditModal('speech', item)} className="text-blue-400 hover:text-white">✏️</button>
                            <button onClick={() => handleDelete('speech', item.id)} className="text-red-400 hover:text-white">🗑️</button>
                        </td>
                    )}
                  </tr>
                ))}
              </tbody>
          </table>
      </div>
  );

  // Reusable Grid Schedule Component
  const ScheduleGridView = ({ contextTitle, contextValue, onContextChange, contextOptions, contextKey }: any) => (
      <div className="bg-[#1C2541] rounded-xl shadow-xl overflow-hidden border border-gray-700 fade-in flex flex-col h-full">
          <div className="p-4 border-b border-gray-700 bg-[#0B132B] flex flex-col sm:flex-row justify-between items-center gap-4 sticky left-0">
             <h3 className="text-xl font-bold text-white">{contextTitle}</h3>
             <div className="flex items-center gap-2">
                 <label className="text-xs text-gray-400 uppercase">Pilih:</label>
                 <select 
                    className="bg-[#1C2541] border border-gray-600 text-white rounded px-4 py-2 focus:border-[#C9B458] outline-none"
                    value={contextValue} onChange={(e) => onContextChange(e.target.value)}
                 >
                    {contextOptions.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                 </select>
             </div>
          </div>
          
          <div className="overflow-x-auto p-4 custom-scrollbar">
             <table className="w-full border-collapse min-w-[1500px]">
                <thead>
                   <tr>
                      <th className="p-3 border border-gray-700 bg-[#0B132B] text-[#C9B458] w-24 sticky left-0 z-10 shadow-lg">HARI</th>
                      {timeSlots.map(slot => <th key={slot} className="p-2 border border-gray-700 bg-[#0B132B] text-gray-400 text-[10px] font-mono w-24 text-center">{slot}</th>)}
                   </tr>
                </thead>
                <tbody>
                   {days.map(day => (
                      <tr key={day}>
                         <td className="p-3 border border-gray-700 bg-[#1C2541] font-bold text-white sticky left-0 z-10 shadow-lg uppercase text-sm">{day}</td>
                         {timeSlots.map(slot => {
                            const data = getSlotData(contextValue, day, slot);
                            return (
                               <td 
                                  key={slot} 
                                  className={`border border-gray-700 p-1 h-20 w-24 relative hover:bg-[#253252] transition-colors ${isAdmin ? 'cursor-pointer' : ''}`}
                                  onClick={() => isAdmin && openEditModal('scheduleSlot', data, { day, time: slot, context: contextValue })}
                               >
                                  {data ? (
                                      <div className={`w-full h-full rounded flex flex-col items-center justify-center text-center p-1 border shadow-sm overflow-hidden ${data.color}`}>
                                          <span className="font-bold text-xs leading-tight">{data.subject}</span>
                                          {data.code && <span className="text-[10px] opacity-80">{data.code}</span>}
                                          {data.info && <span className="text-[9px] mt-1 bg-black/20 px-1 rounded">{data.info}</span>}
                                      </div>
                                  ) : null}
                               </td>
                            );
                         })}
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
          <div className="p-2 bg-[#0B132B] text-[10px] text-gray-500 text-center border-t border-gray-700">
              * Klik petak untuk edit (Admin Sahaja). Data disimpan automatik.
          </div>
       </div>
  );

  return (
    <div className="p-4 md:p-8 space-y-6 pb-20 fade-in w-full">
       <div className="flex items-center gap-2 text-sm text-[#C9B458] font-mono mb-2">
         <span>JADUAL</span>
         <span>/</span>
         <span className="capitalize">{type}</span>
      </div>

       {type === 'Guru Ganti' && <GuruGantiView />}
       {type === 'Guru Kelas' && <GuruKelasView />}
       {type === 'Jadual Berucap' && <JadualBerucapView />}
       
       {type === 'Jadual Persendirian' && (
           <ScheduleGridView 
              contextTitle="Jadual Waktu Persendirian"
              contextValue={selectedTeacher}
              onContextChange={setSelectedTeacher}
              contextOptions={TEACHER_LIST}
              contextKey="teacher"
           />
       )}

       {type === 'Jadual Kelas' && (
           <ScheduleGridView 
              contextTitle="Jadual Waktu Kelas"
              contextValue={selectedClass}
              onContextChange={setSelectedClass}
              contextOptions={CLASS_CODES}
              contextKey="class"
           />
       )}
       
       {!['Guru Ganti', 'Guru Kelas', 'Jadual Berucap', 'Jadual Persendirian', 'Jadual Kelas'].includes(type) && (
           <div className="text-center p-10 text-gray-500">Modul {type} belum tersedia.</div>
       )}

       {/* --- UNIVERSAL MODAL --- */}
       {isModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm fade-in px-4">
             <div className="bg-[#1C2541] w-full max-w-md p-6 rounded-xl border border-[#C9B458] shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
                    {editingItem ? 'Kemaskini Data' : 'Tambah Data'}
                </h3>
                <form onSubmit={handleSave} className="space-y-4">
                    
                    {modalType === 'relief' && (
                        <>
                           <input placeholder="Masa (Cth: 8:00 - 9:00)" className="form-input" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                           <input placeholder="Kelas" className="form-input" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} />
                           <input placeholder="Subjek" className="form-input" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                           <input placeholder="Guru Tidak Hadir" className="form-input" value={formData.absent} onChange={e => setFormData({...formData, absent: e.target.value})} />
                           <input placeholder="Guru Ganti" className="form-input" value={formData.relief} onChange={e => setFormData({...formData, relief: e.target.value})} />
                        </>
                    )}

                    {modalType === 'classTeacher' && (
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400">Nama Guru Kelas</label>
                            <select className="form-input" value={formData.teacherName} onChange={e => setFormData({...formData, teacherName: e.target.value})}>
                                {TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    )}

                    {modalType === 'speech' && (
                        <>
                           <input type="date" className="form-input" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                           <select className="form-input" value={formData.teacher} onChange={e => setFormData({...formData, teacher: e.target.value})}>
                                <option value="">Pilih Guru</option>
                                {TEACHER_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                           </select>
                           <textarea placeholder="Tajuk Ucapan" className="form-input h-20" value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} />
                        </>
                    )}

                    {modalType === 'scheduleSlot' && (
                        <>
                           <div className="text-xs text-gray-500 mb-2">Slot: {formData.day} @ {formData.time}</div>
                           <input placeholder="Subjek (Kosongkan untuk padam)" className="form-input" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
                           <input placeholder="Kod / Kelas" className="form-input" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} />
                           <input placeholder="Info Tambahan (Bilik/Makmal)" className="form-input" value={formData.info} onChange={e => setFormData({...formData, info: e.target.value})} />
                           <div className="grid grid-cols-4 gap-2 mt-2">
                               {['bg-blue-900/50 text-blue-200 border-blue-700', 'bg-red-900/50 text-red-200 border-red-700', 'bg-green-900/50 text-green-200 border-green-700', 'bg-yellow-900/50 text-yellow-200 border-yellow-700'].map(color => (
                                   <div key={color} onClick={() => setFormData({...formData, color})} className={`h-8 rounded cursor-pointer border-2 ${color} ${formData.color === color ? 'ring-2 ring-white' : ''}`}></div>
                               ))}
                           </div>
                        </>
                    )}

                    <div className="flex gap-2 pt-4 border-t border-gray-700 mt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors">Batal</button>
                        <button type="submit" className="flex-1 py-2 bg-[#C9B458] text-[#0B132B] font-bold rounded hover:bg-yellow-400 transition-colors">Simpan</button>
                    </div>
                </form>
             </div>
           </div>
       )}

       <style>{`
         .form-input {
            width: 100%;
            background-color: #0B132B;
            border: 1px solid #374151;
            border-radius: 0.5rem;
            padding: 0.5rem 0.75rem;
            color: white;
            outline: none;
         }
         .form-input:focus {
            border-color: #C9B458;
         }
       `}</style>
    </div>
  );
};
