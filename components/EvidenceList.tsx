import React, { useState } from 'react';
import { EvidenceItem } from '../types';
import { Plus, X, FileText } from 'lucide-react';

interface EvidenceListProps {
  evidence: EvidenceItem[];
  onAddEvidence: (item: EvidenceItem) => void;
}

const EvidenceList: React.FC<EvidenceListProps> = ({ evidence, onAddEvidence }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', type: 'Legal', summary: '' });
  const [errors, setErrors] = useState({ name: false, summary: false });

  const handleSubmit = () => {
    const nameError = !newItem.name.trim();
    const summaryError = !newItem.summary.trim();

    setErrors({ name: nameError, summary: summaryError });

    if (nameError || summaryError) return;
    
    onAddEvidence({
      id: Date.now().toString(),
      name: newItem.name,
      type: newItem.type,
      summary: newItem.summary
    });
    
    setNewItem({ name: '', type: 'Legal', summary: '' });
    setErrors({ name: false, summary: false });
    setIsAdding(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-lg font-bold text-gray-800">Case Evidence</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 border border-blue-200 flex items-center"
        >
          <Plus className="w-3 h-3 mr-1" /> Add
        </button>
      </div>

      {isAdding && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-md animate-fade-in">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-blue-800">New Material</span>
            <button onClick={() => setIsAdding(false)}><X className="w-3 h-3 text-gray-500 hover:text-red-500" /></button>
          </div>
          <input 
            type="text" 
            placeholder={errors.name ? "Name is required!" : "Document Name (e.g. Witness Statement)"}
            className={`w-full mb-2 text-xs p-2 border rounded focus:outline-none focus:border-blue-500 ${
              errors.name ? 'border-red-400 bg-red-50 placeholder-red-400' : 'border-gray-300'
            }`}
            value={newItem.name}
            onChange={(e) => {
              setNewItem({...newItem, name: e.target.value});
              if(errors.name) setErrors({...errors, name: false});
            }}
          />
          <select 
            className="w-full mb-2 text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 bg-white"
            value={newItem.type}
            onChange={(e) => setNewItem({...newItem, type: e.target.value})}
          >
            <option value="Legal">Legal Document</option>
            <option value="Contract">Contract / Agreement</option>
            <option value="Witness Statement">Witness Statement</option>
            <option value="Expert Report">Expert Report</option>
            <option value="Evidence">Physical Evidence</option>
            <option value="Technical">Technical Report</option>
            <option value="Financial">Financial Record</option>
            <option value="Communication">Communication (Email/Chat)</option>
            <option value="Other">Other</option>
          </select>
          <textarea 
            placeholder={errors.summary ? "Summary is required!" : "Summary of content..."}
            className={`w-full mb-2 text-xs p-2 border rounded focus:outline-none focus:border-blue-500 h-20 resize-none ${
              errors.summary ? 'border-red-400 bg-red-50 placeholder-red-400' : 'border-gray-300'
            }`}
            value={newItem.summary}
            onChange={(e) => {
              setNewItem({...newItem, summary: e.target.value});
              if(errors.summary) setErrors({...errors, summary: false});
            }}
          />
          <button 
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white text-xs py-1.5 rounded hover:bg-blue-700 font-medium"
          >
            Confirm Add
          </button>
        </div>
      )}

      <div className="space-y-3 overflow-y-auto flex-1 pr-1">
        {evidence.length === 0 ? (
          <p className="text-sm text-gray-400 text-center italic mt-10">No evidence uploaded yet.</p>
        ) : (
          evidence.map((file) => (
            <div key={file.id} className="p-3 border border-gray-200 rounded hover:bg-gray-50 transition-colors group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center overflow-hidden">
                  <FileText className="w-3 h-3 text-gray-400 mr-2 flex-shrink-0" />
                  <span className="font-semibold text-sm text-blue-700 truncate" title={file.name}>{file.name}</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full flex-shrink-0 border border-gray-200">{file.type}</span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">{file.summary}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EvidenceList;