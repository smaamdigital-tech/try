import React, { useState } from 'react';
import { MOCK_STUDENTS } from '../constants';
import { Student } from '../types';
import { Sparkles, FileText, Search, MoreHorizontal } from 'lucide-react';
import { generateStudentReport } from '../services/geminiService';
import Button from './Button';

const Students: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [aiReport, setAiReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = MOCK_STUDENTS.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.grade.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateReport = async (student: Student) => {
    setIsLoading(true);
    setAiReport('');
    setSelectedStudent(student);
    try {
      const report = await generateStudentReport(student);
      setAiReport(report);
    } catch (error) {
      setAiReport("Ralat semasa menjana laporan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Direktori Pelajar</h2>
            <p className="text-slate-500">Urus maklumat pelajar dan jana laporan prestasi.</p>
        </div>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
                type="text" 
                placeholder="Cari nama atau kelas..." 
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Table List */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Nama Pelajar</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Kelas</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Kehadiran</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm">Markah Purata</th>
                  <th className="p-4 font-semibold text-slate-600 text-sm text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="p-4">
                        <div className="font-medium text-slate-800">{student.name}</div>
                        <div className="text-xs text-slate-400">ID: {student.id}</div>
                    </td>
                    <td className="p-4 text-slate-600">{student.grade}</td>
                    <td className="p-4">
                        <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${student.attendance > 90 ? 'bg-emerald-500' : student.attendance > 80 ? 'bg-amber-500' : 'bg-red-500'}`} 
                                    style={{ width: `${student.attendance}%` }}
                                />
                            </div>
                            <span className="text-xs font-medium text-slate-600">{student.attendance}%</span>
                        </div>
                    </td>
                    <td className="p-4 font-medium text-slate-800">{student.averageScore}</td>
                    <td className="p-4 text-right">
                      <Button 
                        variant="ghost" 
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => handleGenerateReport(student)}
                      >
                        <Sparkles size={16} />
                        <span className="hidden sm:inline">AI Report</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Report Panel (Slide over or Side panel) */}
        {selectedStudent && (
          <div className="w-full md:w-96 bg-white rounded-2xl shadow-lg border border-slate-100 flex flex-col animate-slide-in-right fixed md:static inset-y-0 right-0 z-40 md:z-0">
             <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                <div>
                    <h3 className="font-bold text-lg text-slate-800">Laporan AI</h3>
                    <p className="text-sm text-slate-500">Analisis untuk {selectedStudent.name}</p>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-600">
                    x
                </button>
             </div>
             
             <div className="p-6 flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-4">
                        <Sparkles className="animate-spin text-blue-500" size={32} />
                        <p className="text-sm animate-pulse">Gemini sedang menganalisis data pelajar...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h4 className="text-blue-800 font-semibold mb-2 flex items-center gap-2">
                                <FileText size={16} /> Ulasan Pengetua (AI)
                            </h4>
                            <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                                {aiReport}
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                             <div className="p-3 bg-slate-50 rounded-lg text-center">
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Kelakuan</div>
                                <div className="text-xl font-bold text-slate-800">{selectedStudent.behaviorScore}/10</div>
                             </div>
                             <div className="p-3 bg-slate-50 rounded-lg text-center">
                                <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Potensi</div>
                                <div className="text-xl font-bold text-slate-800">
                                    {selectedStudent.averageScore > 85 ? 'Tinggi' : 'Sederhana'}
                                </div>
                             </div>
                        </div>
                    </div>
                )}
             </div>
             
             <div className="p-4 border-t border-slate-100 bg-slate-50">
                <Button variant="secondary" className="w-full" onClick={() => handleGenerateReport(selectedStudent)}>
                    Jana Semula
                </Button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Students;
