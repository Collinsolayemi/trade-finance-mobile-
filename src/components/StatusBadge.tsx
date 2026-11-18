import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TradeStatus } from '../types/trade.types';

interface StatusBadgeProps {
  status: TradeStatus | string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeColors = () => {
    switch (status) {
      case TradeStatus.APPROVED:
      case 'SUCCESS':
        return { bg: '#E6F4EA', text: '#137333', border: '#CEEAD6' };
      case TradeStatus.IN_REVIEW:
      case TradeStatus.IN_ISSUE:
        return { bg: '#E8F0FE', text: '#1A73E8', border: '#D2E3FC' };
      case TradeStatus.PENDING:
        return { bg: '#FEF7E0', text: '#B06000', border: '#FEEFC3' };
      case TradeStatus.DRAFT:
        return { bg: '#F1F3F4', text: '#5F6368', border: '#E8EAED' };
      case TradeStatus.REJECTED:
      case TradeStatus.CANCELLED:
      case TradeStatus.EXPIRED:
      case 'FAILED':
        return { bg: '#FCE8E6', text: '#C5221F', border: '#FAD2CF' };
      default:
        return { bg: '#F1F3F4', text: '#3C4043', border: '#DADCE0' };
    }
  };

  const colors = getBadgeColors();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <Text style={[styles.text, { color: colors.text }]}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
