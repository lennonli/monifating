import React, { useState } from 'react';
import EvidenceList from './components/EvidenceList';
import ChatInterface from './components/ChatInterface';
import { CourtPhase, AnalysisResult, EvidenceItem } from './types';
import { generateLegalContent } from './services/geminiService';
import { DEFAULT_CASE_CONTEXT, DEFAULT_EVIDENCE } from './constants';
import { Scale, FileText, MessageSquare, Gavel, PlayCircle, FolderOpen, PlusCircle, Clock } from 'lucide-react';

const App: React.FC = () => {
  const [activePhase, setActivePhase] = useState<CourtPhase>(CourtPhase.CASE_CHRONOLOGY);
  
  // State for Dynamic Case Management
  const [caseContext, setCaseContext] = useState<string>(DEFAULT_CASE_CONTEXT);
  const [evidence, setEvidence] = useState<EvidenceItem[]>(DEFAULT_EVIDENCE);
  const [generatedContent, setGeneratedContent] = useState<AnalysisResult>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [showNewCaseInput, setShowNewCaseInput] = useState(false);
  const [newCaseText, setNewCaseText] = useState('');

  const phases = [
    { id: CourtPhase.CASE_CHRONOLOGY, label: 'Chronology (大事记)', icon: Clock },
    { id: CourtPhase.EVIDENCE_ANALYSIS, label: 'Cross-Examination (质证)', icon: FileText },
    { id: CourtPhase.COURT_INVESTIGATION, label: 'Court Investigation (法庭调查)', icon: Scale },
    { id: CourtPhase.CROSS_EXAMINATION, label: 'Questioning (发问)', icon: MessageSquare },
    { id: CourtPhase.DISPUTE_FOCUS, label: 'Dispute Focus (争议焦点)', icon: Scale },
    { id: CourtPhase.DEBATE_PLAINTIFF, label: 'Plaintiff Defense (原告辩论)', icon: Gavel },
    { id: CourtPhase.DEBATE_DEFENDANT, label: 'Defendant Defense (被告辩论)', icon: Gavel },
    { id: CourtPhase.CLOSING_PLAINTIFF, label: 'Plaintiff Closing (原告陈词)', icon: FileText },
    { id: CourtPhase.CLOSING_DEFENDANT, label: 'Defendant Closing (被告陈词)', icon: FileText },
    { id: CourtPhase.CHAT, label: 'AI Assistant (案情对话)', icon: MessageSquare },
  ];

  const handlePhaseChange = async (phase: CourtPhase) => {
    setActivePhase(phase);
    if (phase === CourtPhase.CHAT) return;

    // Always regenerate if content is missing, allowing for updates if case context changed significantly 
    // (Logic could be improved to force regeneration if context changed, for now simple check)
    if (!generatedContent[phase]) {
      setIsGenerating(true);
      let prompt = "";
      
      switch (phase) {
        case CourtPhase.CASE_CHRONOLOGY:
          prompt = "Analyze the provided case context and evidence to create a comprehensive Case Chronology (案件大事记). List all key events strictly in chronological order (Date - Event). Include details about the contract signing, production, shipment, customs seizure, testing reports, and subsequent communications/notices.";
          break;
        case CourtPhase.EVIDENCE_ANALYSIS:
          prompt = "Create two sections: 1) Plaintiff's cross-examination opinion on Defendant's evidence. 2) Defendant's cross-examination opinion on Plaintiff's evidence.";
          break;
        case CourtPhase.COURT_INVESTIGATION:
          prompt = "Simulate the Court Investigation phase. List 3-5 sharp questions from the Judge regarding the facts, defects, and mitigation. Provide answers for both Plaintiff and Defendant.";
          break;
        case CourtPhase.CROSS_EXAMINATION:
          prompt = "Simulate the mutual questioning phase. 1) Plaintiff lawyer asks Defendant questions. 2) Defendant lawyer asks Plaintiff questions.";
          break;
        case CourtPhase.DISPUTE_FOCUS:
          prompt = "Summarize the Controversial Focus (争议焦点) of this case based on the evidence and arguments.";
          break;
        case CourtPhase.DEBATE_PLAINTIFF:
          prompt = "Draft the Plaintiff's debate opinion. Argue for full compensation based on contract breach and damages.";
          break;
        case CourtPhase.DEBATE_DEFENDANT:
          prompt = "Draft the Defendant's debate opinion. Argue for mitigation of damages, minor defects, or lack of proof for losses.";
          break;
        case CourtPhase.CLOSING_PLAINTIFF:
          prompt = "Draft a powerful Closing Statement for the Plaintiff.";
          break;
        case CourtPhase.CLOSING_DEFENDANT:
          prompt = "Draft a Closing Statement for the Defendant.";
          break;
      }

      const content = await generateLegalContent(prompt, caseContext);
      setGeneratedContent(prev => ({ ...prev, [phase]: content }));
      setIsGenerating(false);
    }
  };

  const handleAddEvidence = (newItem: EvidenceItem) => {
    setEvidence(prev => [...prev, newItem]);
    // Update the context string so the AI knows about this new item
    const newContextEntry = `\n\n[NEW EVIDENCE ADDED]\nType: ${newItem.type}\nName: ${newItem.name}\nContent/Summary: ${newItem.summary}`;
    setCaseContext(prev => prev + newContextEntry);
    
    // Clear generated content to force regeneration with new evidence
    setGeneratedContent({}); 
  };

  const startNewCase = () => {
    if (!newCaseText.trim()) return;
    setCaseContext(newCaseText);
    setEvidence([]);
    setGeneratedContent({});
    setShowNewCaseInput(false);
    setActivePhase(CourtPhase.CASE_CHRONOLOGY);
  };

  const resetToDefault = () => {
    setCaseContext(DEFAULT_CASE_CONTEXT);
    setEvidence(DEFAULT_EVIDENCE);
    setGeneratedContent({});
    setShowNewCaseInput(false);
    setActivePhase(CourtPhase.CASE_CHRONOLOGY);
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-gray-100">
      {/* Header */}
      <header className="bg-slate-900 text-white p-4 shadow-lg z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Gavel className="h-6 w-6 text-yellow-500" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">LexSimulator <span className="text-slate-400 font-normal text-sm">Mock Court Tool</span></h1>
              <p className="text-xs text-slate-400">AI-Powered Legal Analysis & Simulation</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={() => setShowNewCaseInput(true)}
              className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded flex items-center transition-colors"
            >
              <PlusCircle className="w-3 h-3 mr-1" /> New Case
            </button>
            <div className="text-xs bg-slate-800 px-3 py-1 rounded border border-slate-700 text-slate-300">
              Powered by Gemini 2.5
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 flex gap-4 overflow-hidden h-[calc(100vh-80px)]">
        
        {/* New Case Modal Overlay */}
        {showNewCaseInput && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Start New Case Simulation</h3>
                <button onClick={() => setShowNewCaseInput(false)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <p className="text-sm text-gray-600 mb-4">
                  Enter the case background, facts, and arguments below. This will serve as the context for the AI judge and assistant.
                </p>
                <textarea 
                  className="w-full h-64 p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="CASE BACKGROUND: ... FACTS: ... ARGUMENTS: ..."
                  value={newCaseText}
                  onChange={(e) => setNewCaseText(e.target.value)}
                />
                <div className="mt-4 flex justify-end gap-2">
                  <button 
                    onClick={resetToDefault}
                    className="text-sm text-gray-600 hover:text-gray-800 px-4 py-2"
                  >
                    Load Demo Case
                  </button>
                  <button 
                    onClick={startNewCase}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium"
                  >
                    Start Simulation
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Left Sidebar - Evidence & Context */}
        <div className="w-1/4 flex flex-col gap-4 min-w-[250px]">
          <div className="flex-1 overflow-hidden flex flex-col">
            <EvidenceList evidence={evidence} onAddEvidence={handleAddEvidence} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-xs text-gray-600 overflow-y-auto max-h-48">
            <div className="font-bold text-gray-800 mb-2 flex items-center"><FolderOpen className="w-3 h-3 mr-1"/> Context Preview</div>
            <div className="opacity-70 line-clamp-6 whitespace-pre-wrap">
              {caseContext}
            </div>
          </div>
        </div>

        {/* Center - Mock Court Process */}
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow overflow-hidden min-w-[400px]">
          <div className="flex overflow-x-auto border-b scrollbar-hide bg-gray-50">
            {phases.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePhaseChange(p.id)}
                className={`flex items-center whitespace-nowrap px-4 py-3 text-sm font-medium transition-all border-b-2 flex-shrink-0 ${
                  activePhase === p.id
                    ? 'border-blue-600 text-blue-700 bg-white'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <p.icon className="w-4 h-4 mr-2" />
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-8 bg-white relative">
            {activePhase === CourtPhase.CHAT ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                <MessageSquare className="w-16 h-16 text-gray-200" />
                <p>Use the AI Assistant panel on the right to discuss the case freely.</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">
                  {phases.find(p => p.id === activePhase)?.label}
                </h2>
                
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-64 space-y-4">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 animate-pulse font-medium">Honorable AI Judge is analyzing the case...</p>
                  </div>
                ) : (
                  <div className="prose prose-slate max-w-none legal-text prose-headings:font-sans prose-h1:text-xl prose-h2:text-lg prose-p:leading-relaxed prose-li:ml-0">
                    {generatedContent[activePhase] ? (
                      <div dangerouslySetInnerHTML={{ 
                        __html: generatedContent[activePhase]!
                          .replace(/\n/g, '<br/>')
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/# (.*)/g, '<h1 class="text-xl font-bold my-4 pb-1 border-b border-gray-200 text-slate-800">$1</h1>')
                          .replace(/## (.*)/g, '<h2 class="text-lg font-bold my-3 text-slate-700">$1</h2>')
                          .replace(/- (.*)/g, '<li class="ml-4 list-disc marker:text-gray-400">$1</li>')
                      }} />
                    ) : (
                      <div className="text-center text-gray-400 mt-20 flex flex-col items-center">
                        <PlayCircle className="w-16 h-16 mb-4 text-gray-200 hover:text-blue-200 transition-colors cursor-pointer" onClick={() => handlePhaseChange(activePhase)} />
                        <p>Click the tab to generate the analysis for this court phase.</p>
                        {activePhase === CourtPhase.EVIDENCE_ANALYSIS && evidence.length === 0 && (
                          <p className="text-xs text-red-400 mt-2">Note: You have no evidence loaded. Please add case materials or load a demo case.</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right Sidebar - Chat */}
        <div className="w-1/4 h-full min-w-[300px]">
          <ChatInterface caseContext={caseContext} />
        </div>

      </main>
    </div>
  );
};

export default App;