import { GoogleGenAI } from "@google/genai";
import { Student } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-2.5-flash';

export const generateStudentReport = async (student: Student): Promise<string> => {
  try {
    const prompt = `
      Bertindak sebagai pengetua sekolah yang profesional dan penyayang.
      Sila tulis ulasan ringkas (maksimum 100 patah perkataan) untuk laporan prestasi pelajar berikut dalam Bahasa Melayu.
      
      Nama: ${student.name}
      Kelas: ${student.grade}
      Kehadiran: ${student.attendance}%
      Markah Purata: ${student.averageScore}
      Skor Kelakuan (1-10): ${student.behaviorScore}
      
      Berikan nasihat yang membina berdasarkan data di atas.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Tiada ulasan dapat dijana.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Gagal menjana laporan. Sila cuba lagi.");
  }
};

export const generateLessonPlan = async (subject: string, topic: string, duration: string): Promise<string> => {
  try {
    const prompt = `
      Bina satu rancangan pengajaran harian (RPH) ringkas untuk guru sekolah menengah.
      Subjek: ${subject}
      Topik: ${topic}
      Masa: ${duration}
      
      Format output dalam Markdown (gunakan bullet points). Sertakan Objektif, Aktiviti, dan Penutup.
      Bahasa: Bahasa Melayu.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Tiada rancangan dapat dijana.";
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Gagal menjana RPH.");
  }
};

export const chatWithSchoolAI = async (message: string): Promise<string> => {
    try {
        const prompt = `
         Anda adalah 'Cikgu AI', pembantu maya pintar untuk sistem pengurusan sekolah 'e-Sekolah PINTAR'.
         Jawab soalan pengguna berkaitan pengurusan sekolah, pedagogi, atau motivasi pelajar.
         Jawab dalam Bahasa Melayu yang sopan dan profesional.
         
         Soalan: ${message}
        `;

        const response = await ai.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
        });
        return response.text || "Maaf, saya tidak faham.";
    } catch (error) {
        console.error("Gemini Error:", error);
        throw new Error("Ralat sistem AI.");
    }
}
