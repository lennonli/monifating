export enum UserRole {
  JUDGE = 'Judge',
  PLAINTIFF = 'Plaintiff (Tilswall)',
  DEFENDANT = 'Defendant (Ruijiang)',
  AI_ASSISTANT = 'Legal Assistant'
}

export interface Message {
  id: string;
  role: UserRole | string;
  content: string;
  timestamp: Date;
  isSystem?: boolean;
}

export enum CourtPhase {
  CASE_CHRONOLOGY = 'case_chronology', // 案件大事记
  EVIDENCE_ANALYSIS = 'evidence_analysis', // 质证
  COURT_INVESTIGATION = 'court_investigation', // 法庭调查
  CROSS_EXAMINATION = 'cross_examination', // 发问阶段
  DISPUTE_FOCUS = 'dispute_focus', // 争议焦点
  DEBATE_PLAINTIFF = 'debate_plaintiff', // 原告辩论
  DEBATE_DEFENDANT = 'debate_defendant', // 被告辩论
  CLOSING_PLAINTIFF = 'closing_plaintiff', // 原告总结
  CLOSING_DEFENDANT = 'closing_defendant', // 被告总结
  CHAT = 'chat' // 自由对话
}

export interface EvidenceItem {
  id: string;
  name: string;
  type: string;
  summary: string;
}

export interface AnalysisResult {
  [key: string]: string | null;
}