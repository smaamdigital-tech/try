
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Save, X, Edit } from 'lucide-react';
import { SchoolProfile } from '../types';

export const ProfilSekolah: React.FC = () => {
  const { user, schoolProfile, updateSchoolProfile } = useApp();
  const isAdminSystem = user?.role === 'adminsistem';

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<SchoolProfile>(schoolProfile);

  const handleEdit = () => {
    setFormData(schoolProfile);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(schoolProfile);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolProfile(formData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-4 md:p-8 pb-20 fade-in w-full max-w-7xl mx-auto relative">
      
      {/* Edit Toggle Button (Only for Admin Sistem) */}
      {isAdminSystem && !isEditing && (
        <button 
          onClick={handleEdit}
          className="absolute top-4 right-4 md:top-8 md:right-8 bg-[#C9B458] text-[#0B132B] px-4 py-2 rounded-full font-bold shadow-lg hover:bg-yellow-400 transition-transform hover:scale-105 flex items-center gap-2 z-20"
        >
          <Edit size={16} /> Edit Profil
        </button>
      )}

      {isEditing ? (
        // --- EDIT MODE ---
        <form onSubmit={handleSave} className="bg-[#1C2541] p-8 rounded-xl border border-[#C9B458] shadow-2xl relative">
          <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
            <h2 className="text-2xl font-bold text-white font-montserrat">Kemaskini Profil Sekolah</h2>
            <div className="flex gap-2">
                <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 flex items-center gap-1">
                    <X size={18} /> Batal
                </button>
                <button type="submit" className="px-4 py-2 bg-[#C9B458] text-[#0B132B] font-bold rounded hover:bg-yellow-400 flex items-center gap-1">
                    <Save size={18} /> Simpan
                </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Section: Principal */}
             <div className="space-y-4">
                <h3 className="text-[#C9B458] font-bold uppercase tracking-wider text-sm border-b border-gray-700 pb-1 mb-2">Maklumat Pengetua</h3>
                <div>
                    <label className="text-xs text-gray-400 block mb-1">Nama Pengetua</label>
                    <input name="principalName" value={formData.principalName} onChange={handleChange} className="w-full bg-[#0B132B] border border-gray-600 p-2 rounded text-white" />
                </div>
                 <div>
                    <label className="text-xs text-gray-400 block mb-1">Gelaran Jawatan</label>
                    <input name="principalTitle" value={formData.principalTitle} onChange={handleChange} className="w-full bg-[#0B132B] border border-gray-600 p-2 rounded text-white" />
                </div>
                <div>
                    <label className="text-xs text-gray-400 block mb-1">URL Gambar Pengetua</label>
                    <input name="principalImage" value={formData.principalImage} onChange={handleChange} className="w-full bg-[#0B132B] border border-gray-600 p-2 rounded text-white" />
                </div>
                <div>
                    <label className="text-xs text-gray-400 block mb-1">Ucapan/Quote Pengetua</label>
                    <textarea name="principalQuote" value={formData.principalQuote} onChange={handleChange} className="w-full bg-[#0B132B] border border-gray-600 p-2 rounded text-white h-24" />
                </div>
             </div>

             {/* Section: School Data */}
             <div className="space-y-4">
                <h3 className="text-[#C9B458] font-bold uppercase tracking-wider text-sm border-b border-gray-700 pb-1 mb-2">Data Sekolah</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">Kod Sekolah</label>
                        <input name="schoolCode" value={formData.schoolCode} onChange={handleChange} className="w-full bg-[#0B132B] border border-gray-600 p-2 rounded text-white" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">No. Telefon</label>
                        <input name="schoolPhone" value={formData.schoolPhone} onChange={handleChange} className="w-full bg-[#0B132B] border border-gray-600 p-2 rounded text-white" />
                    </div>
                </div>
                <div>
                    <label className="text-xs text-gray-400 block mb-1">Alamat</label>
                    <input name="schoolAddress" value={formData.schoolAddress} onChange={handleChange} className="w-full bg-[#0B132B] border border-gray-600 p-2 rounded text-white" />
                </div>
                <div>
                    <label className="text-xs text-gray-400 block mb-1">Emel</label>
                    <input name="schoolEmail" value={formData.schoolEmail} onChange={handleChange} className="w-full bg-[#0B132B] border border-gray-600 p-2 rounded text-white" />
                </div>
                 <div className="grid grid-cols-3 gap-2">
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">Gred/Status</label>
                        <input name="schoolGrade" value={formData.schoolGrade} onChange={handleChange} className="w-full bg-[#0B132B] border border-gray-600 p-2 rounded text-white" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">Bil. Pelajar</label>
                        <input name="studentCount" value={formData.studentCount} onChange={handleChange} className="w-full bg-[#0B132B] border border-gray-600 p-2 rounded text-white" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">Bil. Guru</label>
                        <input name="teacherCount" value={formData.teacherCount} onChange={handleChange} className="w-full bg-[#0B132B] border border-gray-600 p-2 rounded text-white" />
                    </div>
                 </div>
             </div>

             {/* Section: Identity */}
             <div className="md:col-span-2 space-y-4">
                <h3 className="text-[#C9B458] font-bold uppercase tracking-wider text-sm border-b border-gray-700 pb-1 mb-2">Identiti Sekolah</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">Motto</label>
                        <input name="motto" value={formData.motto} onChange={handleChange} className="w-full bg-[#0B132B] border border-gray-600 p-2 rounded text-white" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">Slogan</label>
                        <input name="slogan" value={formData.slogan} onChange={handleChange} className="w-full bg-[#0B132B] border border-gray-600 p-2 rounded text-white" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">Visi</label>
                        <textarea name="vision" value={formData.vision} onChange={handleChange} className="w-full bg-[#0B132B] border border-gray-600 p-2 rounded text-white h-20" />
                    </div>
                    <div>
                        <label className="text-xs text-gray-400 block mb-1">Misi</label>
                        <textarea name="mission" value={formData.mission} onChange={handleChange} className="w-full bg-[#0B132B] border border-gray-600 p-2 rounded text-white h-20" />
                    </div>
                     <div className="md:col-span-2">
                        <label className="text-xs text-gray-400 block mb-1">Piagam Pelanggan</label>
                        <textarea name="charter" value={formData.charter} onChange={handleChange} className="w-full bg-[#0B132B] border border-gray-600 p-2 rounded text-white h-20" />
                    </div>
                </div>
             </div>
          </div>
        </form>
      ) : (
        // --- VIEW MODE ---
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT PANEL - PRINCIPAL & SPEECH */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-[#1C2541] rounded-xl shadow-2xl border border-gray-700 overflow-hidden relative p-8 text-center group">
                {/* Decorative Background Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                  <span className="text-[200px] font-bold text-white">SMAAM</span>
                </div>

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-40 h-40 rounded-full border-4 border-[#C9B458] shadow-[0_0_20px_rgba(201,180,88,0.3)] mb-6 overflow-hidden bg-[#0B132B] flex items-center justify-center">
                      {/* Principal Photo */}
                      {schoolProfile.principalImage ? (
                        <img 
                          src={schoolProfile.principalImage} 
                          alt={schoolProfile.principalName} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="text-[#C9B458] text-4xl">👤</div>
                      )}
                  </div>
                  
                  <h2 className="text-xl font-bold text-[#C9B458] font-montserrat uppercase tracking-wide mb-1">
                      {schoolProfile.principalName}
                  </h2>
                  <p className="text-white font-medium text-sm mb-6 bg-[#0B132B] px-4 py-1 rounded-full border border-gray-700">
                      {schoolProfile.principalTitle}
                  </p>

                  <div className="w-full border-t border-gray-700 my-4"></div>

                  <h3 className="text-[#C9B458] font-bold text-sm tracking-[0.2em] mb-4 uppercase">
                      "Ucapan Pentadbir"
                  </h3>

                  <blockquote className="text-gray-300 italic text-sm leading-relaxed font-light">
                      "{schoolProfile.principalQuote}"
                  </blockquote>
                </div>
            </div>
          </div>

          {/* RIGHT PANEL - SCHOOL INFO */}
          <div className="lg:col-span-8 space-y-8">
            
            <div className="bg-[#1C2541] rounded-xl shadow-2xl border border-gray-700 p-8">
                <h2 className="text-2xl font-bold text-[#C9B458] font-montserrat mb-6 border-b-2 border-[#C9B458] pb-2 inline-block">
                  MAKLUMAT ASAS SEKOLAH
                </h2>

                {/* DATA UTAMA */}
                <div className="mb-8">
                  <h3 className="text-white font-bold text-lg mb-4 border-l-4 border-[#3A506B] pl-3 uppercase">
                      Data Utama
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm">
                      <div className="md:col-span-3 text-gray-400 font-semibold">Nama Sekolah:</div>
                      <div className="md:col-span-9 text-white font-medium uppercase">SMA AL-KHAIRIAH AL-ISLAMIAH MERSING</div>
                      
                      <div className="md:col-span-3 text-gray-400 font-semibold">Kod Sekolah:</div>
                      <div className="md:col-span-9 text-white font-medium">{schoolProfile.schoolCode}</div>
                      
                      <div className="md:col-span-3 text-gray-400 font-semibold">Alamat:</div>
                      <div className="md:col-span-9 text-white font-medium">{schoolProfile.schoolAddress}</div>
                      
                      <div className="md:col-span-3 text-gray-400 font-semibold">Emel:</div>
                      <div className="md:col-span-9 text-white font-medium">{schoolProfile.schoolEmail}</div>
                      
                      <div className="md:col-span-3 text-gray-400 font-semibold">No. Telefon:</div>
                      <div className="md:col-span-9 text-white font-medium flex justify-between">
                        <span>{schoolProfile.schoolPhone}</span>
                        <span className="text-[#C9B458] text-xs border border-[#C9B458] px-2 py-0.5 rounded">Gred: {schoolProfile.schoolGrade}</span>
                      </div>
                  </div>
                </div>

                {/* STATISTIK */}
                <div className="mb-8 bg-[#0B132B] rounded-lg p-4 border border-gray-700">
                  <h3 className="text-[#C9B458] font-bold text-sm mb-3 uppercase tracking-wider">
                      Statistik Semasa
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                        <span className="text-gray-300">Jumlah Guru:</span>
                        <div className="text-right">
                            <span className="text-xl font-bold text-white block">{schoolProfile.teacherCount} orang</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                        <span className="text-gray-300">Jumlah Murid:</span>
                        <div className="text-right">
                            <span className="text-xl font-bold text-white block">{schoolProfile.studentCount} orang</span>
                        </div>
                      </div>
                  </div>
                </div>

                {/* MISI, VISI, MOTO */}
                <div className="mb-8 space-y-5">
                  <h3 className="text-white font-bold text-lg mb-4 border-l-4 border-[#3A506B] pl-3 uppercase">
                      Misi, Visi, Moto, Slogan & Piagam
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm">
                      <div className="md:col-span-3 text-gray-400 font-semibold">Misi:</div>
                      <div className="md:col-span-9 text-white">{schoolProfile.mission}</div>
                      
                      <div className="md:col-span-3 text-gray-400 font-semibold">Visi:</div>
                      <div className="md:col-span-9 text-white">{schoolProfile.vision}</div>
                      
                      <div className="md:col-span-3 text-gray-400 font-semibold">Moto:</div>
                      <div className="md:col-span-9 text-[#C9B458] font-bold tracking-widest uppercase">{schoolProfile.motto}</div>
                      
                      <div className="md:col-span-3 text-gray-400 font-semibold">Slogan:</div>
                      <div className="md:col-span-9 text-white italic">{schoolProfile.slogan}</div>

                      <div className="md:col-span-3 text-gray-400 font-semibold">Piagam Pelanggan:</div>
                      <div className="md:col-span-9 text-white text-justify">{schoolProfile.charter}</div>
                  </div>
                </div>

                {/* PENTADBIRAN */}
                <div>
                  <h3 className="text-white font-bold text-lg mb-4 border-l-4 border-[#3A506B] pl-3 uppercase">
                      Pentadbiran
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-sm">
                      <div className="md:col-span-3 text-gray-400 font-semibold">Nama Pengetua:</div>
                      <div className="md:col-span-9 text-white font-medium">{schoolProfile.principalName}</div>
                      
                      <div className="md:col-span-3 text-gray-400 font-semibold">Jawatan:</div>
                      <div className="md:col-span-9 text-white font-medium">{schoolProfile.principalTitle}</div>
                  </div>
                </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
