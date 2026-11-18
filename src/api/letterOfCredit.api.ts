import { apiClient } from './client';
import { LetterOfCreditItem, TradeStatus } from '../types/trade.types';

export const mockLettersOfCredit: LetterOfCreditItem[] = [
  {
    id: 'lc-001',
    lcNumber: 'LC/2026/08912',
    applicantName: 'Dangote Agro Industrial Ltd',
    beneficiaryName: 'Buhler Group Switzerland AG',
    amount: 1450000,
    currency: 'USD',
    issueDate: '2026-10-15',
    expiryDate: '2026-12-30',
    status: TradeStatus.APPROVED,
    type: 'Sight',
    tenorDays: 90,
    branchName: 'Victoria Island Corporate Branch',
  },
  {
    id: 'lc-002',
    lcNumber: 'LC/2026/08945',
    applicantName: 'Flour Mills of Nigeria PLC',
    beneficiaryName: 'Cargill International Geneva',
    amount: 2850000,
    currency: 'USD',
    issueDate: '2026-11-02',
    expiryDate: '2027-02-15',
    status: TradeStatus.IN_REVIEW,
    type: 'Usance',
    tenorDays: 180,
    branchName: 'Apapa Marine Branch',
  },
  {
    id: 'lc-003',
    lcNumber: 'LC/2026/08988',
    applicantName: 'Bua Foods PLC',
    beneficiaryName: 'Wilmar Sugar Singapore',
    amount: 980000,
    currency: 'EUR',
    issueDate: '2026-11-12',
    expiryDate: '2027-01-20',
    status: TradeStatus.PENDING,
    type: 'Sight',
    tenorDays: 60,
    branchName: 'Marina Central Branch',
  },
  {
    id: 'lc-004',
    lcNumber: 'LC/2026/09014',
    applicantName: 'Nigerian Breweries PLC',
    beneficiaryName: 'Krones AG Germany',
    amount: 540000,
    currency: 'EUR',
    issueDate: '2026-11-16',
    expiryDate: '2027-03-31',
    status: TradeStatus.DRAFT,
    type: 'Deferred',
    tenorDays: 120,
    branchName: 'Ikeja Industrial Branch',
  },
];

export const LetterOfCreditApi = {
  async getRecords(params?: { status?: string; search?: string }): Promise<LetterOfCreditItem[]> {
    const res = await apiClient.get<LetterOfCreditItem[]>('/letter-of-credit');
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
    // Fallback to initial mock data if backend has no records yet or is in offline mode
    let list = [...mockLettersOfCredit];
    if (params?.status && params.status !== 'All') {
      list = list.filter((item) => item.status === params.status);
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (i) =>
          i.lcNumber.toLowerCase().includes(q) ||
          i.applicantName.toLowerCase().includes(q) ||
          i.beneficiaryName.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async authorizeRecord(id: string, comment?: string) {
    return apiClient.post(`/letter-of-credit/${id}/authorize`, { comment, isAuthorized: true });
  },

  async rejectRecord(id: string, reason: string) {
    return apiClient.post(`/letter-of-credit/${id}/reject`, { reason });
  },
};
