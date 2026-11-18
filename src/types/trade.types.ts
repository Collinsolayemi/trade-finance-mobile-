export enum TradeStatus {
  APPROVED = 'Approved',
  IN_ISSUE = 'In-Issue',
  IN_REVIEW = 'In-Review',
  PENDING = 'Pending',
  DRAFT = 'Draft',
  REJECTED = 'Rejected',
  EXPIRED = 'Expired',
  CANCELLED = 'Cancelled',
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'NGN' | 'CNY';

export interface LetterOfCreditItem {
  id: string;
  lcNumber: string;
  applicantName: string;
  beneficiaryName: string;
  amount: number;
  currency: CurrencyCode;
  issueDate: string;
  expiryDate: string;
  status: TradeStatus;
  type: 'Sight' | 'Usance' | 'Deferred' | 'Transferable';
  tenorDays?: number;
  branchName?: string;
}

export interface RegulatoryFormItem {
  id: string;
  formNumber: string;
  formType: 'Form M' | 'Form NXP' | 'Form NCX' | 'Form A';
  applicantName: string;
  amount: number;
  currency: CurrencyCode;
  submittedDate: string;
  status: TradeStatus;
  purpose?: string;
  shipmentMode?: 'Air' | 'Sea' | 'Road';
}

export interface ActivityLogItem {
  id: string;
  action: string;
  description: string;
  performedBy: string;
  timestamp: string;
  module: 'Letter of Credit' | 'Regulatory Form' | 'Guarantees' | 'Bills for Collection' | 'System';
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  branch: string;
  permissions: string[];
}

