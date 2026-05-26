import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { openai } from '../lib/openai';
import { useToast } from './Toast';
import RoleColorBadge from './RoleColorBadge';
import { UploadCloud, CheckCircle, AlertTriangle, FileText, BarChart } from 'lucide-react';

export default function ScreeningPanel({ mode }) {
  const { addToast } = useToast();

  // Shared state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [candidateName, setCandidateName] = useState('');

  // Resume mode state
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);

  // Manual mode state
  const [answers, setAnswers] = useState(Array(20).fill(''));

  const handleFileUpload = (e) => {
     const selected = e.target.files[0];
     if (selected && selected.type === 'application/pdf') {
        setFile(selected);
     } else {
        addToast("Please upload a PDF file.", "error");
     }
  };

  const processResume = async () => {
    if (!file) return;
    setLoading(true);

    try {
      // 1. In a real app, we'd extract text from the PDF here (e.g., using pdf.js).
      // For this demo, we mock the extracted text and send to OpenAI.
      const mockExtractedText = `Candidate has 5 years experience in sales. Highly driven, competitive, and focuses on closing deals. Often takes charge of meetings and persuades clients effectively. Weakness in detailed documentation.`;

      const prompt = `You are a behavioral talent analyst for RoleColorFinder. Analyze the following resume text and return JSON with exactly these keys: predicted_rolecolor ("Red", "Yellow", "Green", or "Blue"), confidence_pct (number 0-100), match_score (number 0-100), strengths (array of 3 strings), red_flags (array of 2 strings), recommended_questions (array of 5 strings), hiring_recommendation (string paragraph).

      Resume text: "${mockExtractedText}"`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "system", content: prompt }],
        response_format: { type: "json_object" }
      });

      const aiResult = JSON.parse(response.choices[0].message.content);
      setResult(aiResult);
      addToast("Resume analyzed successfully");

    } catch (error) {
      console.error(error);
      addToast("Failed to analyze resume.", "error");
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
     if (!result || !candidateName) {
        addToast("Please enter a candidate name.", "error");
        return;
     }

     try {
        const { error } = await supabase.from('candidates').insert([{
           name: candidateName,
           email: `${candidateName.replace(/\s+/g, '.').toLowerCase()}@example.com`,
           rolecolor: result.predicted_rolecolor,
           score: result.match_score,
           stage: 'Screening',
           notes: result.hiring_recommendation,
           source: mode === 'Resume' ? 'AI Parsed Resume' : 'Manual Assessment'
        }]);

        if (error) throw error;
        addToast("Candidate saved to database.");
        setResult(null);
        setCandidateName('');
        setFile(null);
     } catch (e) {
        addToast(e.message, "error");
     }
  };


  if (mode === 'Resume') {
    return (
      <div className="space-y-6">
         {!result ? (
            <div className="max-w-xl mx-auto">
               <div
                  className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors ${file ? 'border-[#28BCE8] bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); handleFileUpload({ target: { files: e.dataTransfer.files } }); }}
               >
                  <UploadCloud size={48} className={file ? 'text-[#28BCE8] mb-4' : 'text-gray-400 mb-4'} />
                  {file ? (
                     <div>
                        <p className="text-gray-900 font-medium mb-1">{file.name}</p>
                        <p className="text-gray-500 text-sm mb-4">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        <button onClick={() => setFile(null)} className="text-sm text-red-500 hover:underline">Remove</button>
                     </div>
                  ) : (
                     <div>
                        <p className="text-gray-900 font-medium mb-1">Drag & drop a PDF resume here</p>
                        <p className="text-gray-500 text-sm mb-4">or click to browse from your computer</p>
                        <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-700 shadow-sm hover:bg-gray-50 font-medium text-sm">
                           Browse Files
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf" className="hidden" />
                     </div>
                  )}
               </div>

               <div className="mt-6 flex justify-end">
                  <button
                     onClick={processResume}
                     disabled={!file || loading}
                     className={`px-6 py-2 rounded-md font-medium text-white shadow-sm transition-colors ${!file || loading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#242E42] hover:bg-[#1a2130]'}`}
                  >
                     {loading ? 'Analyzing...' : 'Analyze Resume'}
                  </button>
               </div>
            </div>
         ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-3xl mx-auto">
               <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-start">
                  <div>
                     <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">AI Analysis Complete <CheckCircle size={18} className="text-green-500"/></h3>
                     <p className="text-sm text-gray-500 mt-1">Confidence: {result.confidence_pct}%</p>
                  </div>
                  <div className="text-right">
                     <span className="text-sm text-gray-500 block mb-1">Match Score</span>
                     <span className="text-2xl font-bold text-[#28BCE8]">{result.match_score}/100</span>
                  </div>
               </div>

               <div className="p-6 space-y-6">
                  <div className="flex items-center gap-4 border p-4 rounded-lg bg-gray-50/50">
                     <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Name (to save profile)</label>
                        <input type="text" value={candidateName} onChange={e => setCandidateName(e.target.value)} placeholder="e.g. Jane Doe" className="w-full border border-gray-300 rounded-md p-2" />
                     </div>
                     <div className="w-px h-10 bg-gray-200 mx-2"></div>
                     <div>
                        <span className="block text-sm font-medium text-gray-700 mb-2">Predicted RoleColor</span>
                        <RoleColorBadge color={result.predicted_rolecolor} className="text-sm px-3 py-1" />
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                     <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Core Strengths</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                           {result.strengths.map((s, i) => <li key={i} className="flex items-start gap-2"><span className="text-green-500 mt-0.5">•</span> {s}</li>)}
                        </ul>
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-500"/> Potential Red Flags</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                           {result.red_flags.map((s, i) => <li key={i} className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">•</span> {s}</li>)}
                        </ul>
                     </div>
                  </div>

                  <div>
                     <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2"><FileText size={16} className="text-indigo-500"/> Recommended Interview Questions</h4>
                     <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
                        {result.recommended_questions.map((q, i) => <li key={i}>{q}</li>)}
                     </ol>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                     <h4 className="text-sm font-bold text-blue-900 mb-2">Hiring Recommendation</h4>
                     <p className="text-sm text-blue-800 leading-relaxed">{result.hiring_recommendation}</p>
                  </div>
               </div>

               <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                  <button onClick={() => setResult(null)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium text-sm">Discard</button>
                  <button onClick={saveProfile} className="px-6 py-2 bg-[#242E42] text-white rounded-md hover:bg-[#1a2130] font-medium text-sm">Save to Candidate Profile</button>
               </div>
            </div>
         )}
      </div>
    );
  }

  const quizQuestions = [
    { text: "When facing a deadline, I typically:", options: ["Take charge and push the team", "Create a detailed schedule", "Ensure the final output is perfect", "Brainstorm new approaches"] },
    { text: "In a meeting, I am most likely to:", options: ["Speak up and drive the conversation", "Take notes and action items", "Analyze data before speaking", "Suggest out-of-the-box ideas"] },
    { text: "My ideal work environment is:", options: ["Fast-paced and competitive", "Structured and predictable", "Quiet and detail-oriented", "Creative and flexible"] },
    { text: "When solving a problem, I:", options: ["Make a quick decision", "Follow established procedures", "Research all possible outcomes", "Look for a novel solution"] },
    { text: "I am motivated by:", options: ["Achieving goals and winning", "Completing tasks efficiently", "Accuracy and mastery", "Innovation and big picture"] },
  ];

  const handleStartQuiz = () => {
    setResult({ ...result, quizStarted: true, currentQuestion: 0, answers: [] });
  };

  const handleAnswer = (answerIndex) => {
    const newAnswers = [...(result?.answers || []), answerIndex];
    if (result.currentQuestion < quizQuestions.length - 1) {
      setResult({ ...result, answers: newAnswers, currentQuestion: result.currentQuestion + 1 });
    } else {
      // Calculate result mock
      const counts = [0, 0, 0, 0];
      newAnswers.forEach(a => counts[a]++);
      const maxIdx = counts.indexOf(Math.max(...counts));
      const colors = ['Red', 'Yellow', 'Green', 'Blue'];
      setResult({
        quizComplete: true,
        predicted_rolecolor: colors[maxIdx],
        match_score: 85,
        strengths: ["Task-oriented", "Reliable", "Structured"],
        red_flags: ["May struggle with ambiguity"],
        recommended_questions: ["Tell me about a time you had to adapt?", "How do you handle missed deadlines?"],
        hiring_recommendation: "Based on the assessment, the candidate shows strong alignment with the target role."
      });
    }
  };

  if (mode === 'Manual') {
    if (result?.quizComplete) {
      return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden max-w-3xl mx-auto">
               <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-start">
                  <div>
                     <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">Assessment Complete <CheckCircle size={18} className="text-green-500"/></h3>
                  </div>
               </div>

               <div className="p-6 space-y-6">
                  <div className="flex items-center gap-4 border p-4 rounded-lg bg-gray-50/50">
                     <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Name</label>
                        <input type="text" value={candidateName} onChange={e => setCandidateName(e.target.value)} placeholder="e.g. Jane Doe" className="w-full border border-gray-300 rounded-md p-2" />
                     </div>
                     <div className="w-px h-10 bg-gray-200 mx-2"></div>
                     <div>
                        <span className="block text-sm font-medium text-gray-700 mb-2">Assigned RoleColor</span>
                        <RoleColorBadge color={result.predicted_rolecolor} className="text-sm px-3 py-1" />
                     </div>
                  </div>
               </div>

               <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                  <button onClick={() => setResult(null)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 font-medium text-sm">Discard</button>
                  <button onClick={saveProfile} className="px-6 py-2 bg-[#242E42] text-white rounded-md hover:bg-[#1a2130] font-medium text-sm">Save to Candidate Profile</button>
               </div>
            </div>
      );
    }

    if (result?.quizStarted) {
      const q = quizQuestions[result.currentQuestion];
      return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
           <div className="mb-6 flex justify-between text-sm text-gray-500">
             <span>Question {result.currentQuestion + 1} of {quizQuestions.length}</span>
           </div>
           <h2 className="text-xl font-bold text-gray-900 mb-6">{q.text}</h2>
           <div className="space-y-3">
              {q.options.map((opt, i) => (
                 <button key={i} onClick={() => handleAnswer(i)} className="w-full text-left px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                    {opt}
                 </button>
              ))}
           </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
         <BarChart size={48} className="mx-auto text-gray-400 mb-4" />
         <h2 className="text-xl font-bold text-gray-900 mb-2">Manual Assessment</h2>
         <p className="text-gray-500 mb-6">Administer a behavioral quiz to assign a RoleColor manually.</p>

         <button onClick={handleStartQuiz} className="px-6 py-2 bg-[#28BCE8] text-white rounded-md hover:bg-[#209bc2] font-medium transition-colors">
            Start Assessment Quiz
         </button>
      </div>
    );
  }
}
