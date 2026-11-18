import { apiClient } from './client';
import { RegulatoryFormItem, TradeStatus } from '../types/trade.types';

export const mockRegulatoryForms: RegulatoryFormItem[] = [
  {
    id: 'rf-001',
    formNumber: 'MF20260081290',
    formType: 'Form M',
    applicantName: 'Dangote Agro Industrial Ltd',
    amount: 1450000,
    currency: 'USD',
    submittedDate: '2026-10-10',
    status: TradeStatus.APPROVED,
    purpose: 'Importation of grain processing equipment',
    shipmentMode: 'Sea',
  },
  {
    id: 'rf-002',
    formNumber: 'NXP2026003290',
    formType: 'Form NXP',
    applicantName: 'Olam Agri Nigeria Ltd',
    amount: 850000,
    currency: 'USD',
    submittedDate: '2026-11-04',
    status: TradeStatus.IN_REVIEW,
    purpose: 'Commercial export of sesame seed consignment',
    shipmentMode: 'Sea',
  },
  {
    id: 'rf-003',
    formNumber: 'FA20260012450',
    formType: 'Form A',
    applicantName: 'Interswitch Group Limited',
    amount: 125000,
    currency: 'GBP',
    submittedDate: '2026-11-14',
    status: TradeStatus.PENDING,
    purpose: 'Software license & maintenance subscription',
    shipmentMode: 'Air',
  },
];

export const RegulatoryFormApi = {
  async getRecords(params?: { formType?: string }): Promise<RegulatoryFormItem[]> {
    const res = await apiClient.get<RegulatoryFormItem[]>('/regulatory-form');
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
    let list = [...mockRegulatoryForms];
    if (params?.formType && params.formType !== 'All') {
      list = list.filter((item) => item.formType === params.formType);
    }
    return list;
  },
};
