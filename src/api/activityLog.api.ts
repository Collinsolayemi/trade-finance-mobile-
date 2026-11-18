import { apiClient } from './client';
import { ActivityLogItem } from '../types/trade.types';

export const mockActivityLogs: ActivityLogItem[] = [
  {
    id: 'act-1',
    action: 'Authorization Approved',
    description: 'Letter of Credit LC/2026/08912 authorized by Head of Trade Services',
    performedBy: 'collins.olayemi@bank.com',
    timestamp: '2026-11-18 10:45 AM',
    module: 'Letter of Credit',
    status: 'SUCCESS',
  },
  {
    id: 'act-2',
    action: 'Form M Submission',
    description: 'Form M MF20260081290 validated against TradeGov Single Window',
    performedBy: 'system_user',
    timestamp: '2026-11-18 09:15 AM',
    module: 'Regulatory Form',
    status: 'SUCCESS',
  },
  {
    id: 'act-3',
    action: 'SWIFT MT700 Transmitted',
    description: 'Outward SWIFT MT700 message sent via SFTP to correspondent bank',
    performedBy: 'swift_processor_queue',
    timestamp: '2026-11-17 04:30 PM',
    module: 'Letter of Credit',
    status: 'SUCCESS',
  },
  {
    id: 'act-4',
    action: 'Journal Posting',
    description: 'Debit commission charge for LC issuance request posted to central ledger',
    performedBy: 'trade_journal_service',
    timestamp: '2026-11-17 03:12 PM',
    module: 'Letter of Credit',
    status: 'SUCCESS',
  },
];

export const ActivityLogApi = {
  async getLogs(): Promise<ActivityLogItem[]> {
    const res = await apiClient.get<ActivityLogItem[]>('/activity-logs');
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
    return mockActivityLogs;
  },
};
