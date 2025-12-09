import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Book, Plus, Edit, Trash, X, Save } from 'lucide-react';
import { Teacher } from '../types';

const Teachers: React.FC = () => {
  const { teachers, addTeacher, updateTeacher, deleteTeacher, user, showToast } = useApp();
  const isAdmin = user?.role === 'admin' || user?.role === 'adminsistem';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Teacher>>({
      name: '',
      subject: '',
      classes: []
  });

  const handleOpenModal = (teacher?: Teacher) => {
      if (teacher) {
          setEditingId(teacher.id);
          setFormData(teacher);
      } else {
          setEditingId(null);
          setFormData({ name: '', subject: '', classes: [] });
      }
      setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      
      const teacherData: Teacher = {
          id: editingId || `T${Date.now().toString().substr(-4)}`, // Simple ID gen
          name: formData.name || 'Nama Guru',
          subject: formData.subject || 'Subjek',
          classes: Array.isArray(formData.classes) ? formData.classes : (formData.classes as string || '').split(',').map(s => s.trim())
      };

      if (editingId) {
          updateTeacher(teacherData);
      } else {
          addTeacher(teacherData);
      }
      setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
      if(window.confirm("Adakah anda pasti ingin memadam guru ini?")) {
          deleteTeacher(id);
      }
  };

  return (
    <div className="space-y-6 pb-20 fade-in">
      <div className="flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Bilik Guru</h2>
            <p className="text-slate-500">Senarai tenaga pengajar sekolah.</p>
        </div>
        {isAdmin && (
            <button 
                onClick={() => handleOpenModal()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 shadow-lg"
            >
                <Plus size={18} /> Tambah Guru
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative group">
            
            {isAdmin && (
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(teacher)} className="p-2 bg-slate-100 hover:bg-blue-100 text-blue-600 rounded-full">
                        <Edit size={16} />
                    </button>
                    <button onClick={() => handleDelete(teacher.id)} className="p-2 bg-slate-100 hover:bg-red-100 text-red-600 rounded-full">
                        <Trash size={16} />
                    </button>
                </div>
            )}

            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg uppercase">
                {teacher.name.charAt(0)}
              </div>
              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-medium">
                {teacher.id}
              </span>
            </div>
            
            <h3 className="font-bold text-lg text-slate-800 mb-1">{teacher.name}</h3>
            <p className="text-blue-600 text-sm font-medium mb-4">{teacher.subject}</p>
            
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Book size={16} />
                    <span>Kelas: {Array.isArray(teacher.classes) ? teacher.classes.join(', ') : teacher.classes}</span>
                </div>
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Mail size={16} />
                    <span>email@sekolah.edu.my</span>
                </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                <button onClick={() => showToast("Jadual belum tersedia")} className="flex-1 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200">
                    Jadual
                </button>
                <button className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg">
                    Hubungi
                </button>
            </div>
          </div>
        ))}
        
        {/* Add New Teacher Card Placeholder */}
        {isAdmin && (
            <div 
                onClick={() => handleOpenModal()}
                className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer min-h-[280px]"
            >
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                    <Plus size={24} />
                </div>
                <p className="font-medium">Tambah Guru Baru</p>
            </div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm fade-in">
              <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-slate-800">{editingId ? 'Edit Guru' : 'Tambah Guru'}</h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">Nama Penuh</label>
                          <input 
                            required
                            type="text" 
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">Subjek Utama</label>
                          <input 
                            type="text" 
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={formData.subject}
                            onChange={e => setFormData({...formData, subject: e.target.value})}
                            placeholder="Contoh: Matematik"
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-600 mb-1">Kelas Diajar (Asingkan dengan koma)</label>
                          <input 
                            type="text" 
                            className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                            value={Array.isArray(formData.classes) ? formData.classes.join(', ') : formData.classes}
                            onChange={e => setFormData({...formData, classes: e.target.value.split(',').map(s=>s.trim())})}
                            placeholder="Contoh: 5 Bestari, 4 Cerdik"
                          />
                      </div>
                      <div className="flex gap-2 pt-4">
                          <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 text-slate-600 hover:bg-slate-50 border border-slate-200 rounded-lg">Batal</button>
                          <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                              <Save size={18} /> Simpan
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Teachers;
