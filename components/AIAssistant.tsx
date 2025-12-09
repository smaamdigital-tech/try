import React, { useState } from 'react';
import { Bot, BookOpen, Send, Loader2 } from 'lucide-react';
import { generateLessonPlan, chatWithSchoolAI } from '../services/geminiService';
import Button from './Button';

type Tab = 'CHAT' | 'LESSON_PLAN';

const AIAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('CHAT');
  
  // Chat State
  const [messages, setMessages] = useState<{role: 'user' | 'ai', content: string}[]>([
      { role: 'ai', content: 'Hai! Saya Cikgu AI. Boleh saya bantu anda menguruskan kelas atau memberi idea pengajaran hari ini?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Lesson Plan State
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('60 minit');
  const [lessonPlanResult, setLessonPlanResult] = useState('');
  const [planLoading, setPlanLoading] = useState(false);

  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setChatLoading(true);
    
    try {
        const response = await chatWithSchoolAI(userMsg);
        setMessages(prev => [...prev, { role: 'ai', content: response }]);
    } catch (e) {
        setMessages(prev => [...prev, { role: 'ai', content: "Maaf, ralat berlaku." }]);
    } finally {
        setChatLoading(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !topic) return;
    setPlanLoading(true);
    try {
        const plan = await generateLessonPlan(subject, topic, duration);
        setLessonPlanResult(plan);
    } catch (e) {
        setLessonPlanResult("Gagal menjana RPH.");
    } finally {
        setPlanLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Pembantu AI Pintar</h2>
        <p className="text-slate-500">Alat bantu mengajar dikuasakan oleh Google Gemini.</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        <button 
            onClick={() => setActiveTab('CHAT')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'CHAT' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
            <div className="flex items-center gap-2"><Bot size={16}/> Chat Sekolah</div>
        </button>
        <button 
            onClick={() => setActiveTab('LESSON_PLAN')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'LESSON_PLAN' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
            <div className="flex items-center gap-2"><BookOpen size={16}/> Jana RPH (Lesson Plan)</div>
        </button>
      </div>

      <div className="flex-1 min-h-0 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {activeTab === 'CHAT' ? (
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            </div>
                        </div>
                    ))}
                    {chatLoading && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 text-slate-500 text-sm">
                                <Loader2 className="animate-spin" size={16} /> Sedang menaip...
                            </div>
                        </div>
                    )}
                </div>
                <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
                    <input 
                        className="flex-1 border border-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tanya sesuatu tentang pengurusan sekolah..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChatSend()}
                    />
                    <Button onClick={handleChatSend} disabled={chatLoading || !chatInput.trim()}>
                        <Send size={18} />
                    </Button>
                </div>
            </div>
        ) : (
            <div className="flex flex-col md:flex-row h-full">
                <div className="w-full md:w-1/3 p-6 border-r border-slate-100 bg-slate-50">
                    <h3 className="font-semibold text-slate-800 mb-4">Parameter RPH</h3>
                    <form onSubmit={handleCreatePlan} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Subjek</label>
                            <input 
                                className="w-full border border-slate-200 rounded-lg px-3 py-2"
                                placeholder="Cth: Matematik"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Topik</label>
                            <input 
                                className="w-full border border-slate-200 rounded-lg px-3 py-2"
                                placeholder="Cth: Pecahan Mudah"
                                value={topic}
                                onChange={e => setTopic(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Tempoh Kelas</label>
                            <select 
                                className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white"
                                value={duration}
                                onChange={e => setDuration(e.target.value)}
                            >
                                <option>30 minit</option>
                                <option>60 minit</option>
                                <option>90 minit</option>
                                <option>120 minit</option>
                            </select>
                        </div>
                        <Button type="submit" className="w-full" isLoading={planLoading}>
                            Jana Rancangan
                        </Button>
                    </form>
                </div>
                <div className="flex-1 p-8 overflow-y-auto bg-white">
                    {lessonPlanResult ? (
                        <article className="prose prose-slate max-w-none">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Rancangan Pengajaran Harian</h3>
                            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100">
                                {lessonPlanResult}
                            </div>
                        </article>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <BookOpen size={48} className="mb-4 text-slate-200" />
                            <p>Isi borang di sebelah untuk menjana RPH automatik.</p>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
