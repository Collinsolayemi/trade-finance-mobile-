import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Header } from '../components/Header';
import { MetricCard } from '../components/MetricCard';
import { StatusBadge } from '../components/StatusBadge';
import { LetterOfCreditApi } from '../api/letterOfCredit.api';
import { RegulatoryFormApi } from '../api/regulatoryForm.api';
import { LetterOfCreditItem, RegulatoryFormItem } from '../types/trade.types';
import { Ionicons } from '@expo/vector-icons';

interface DashboardScreenProps {
  onNavigateToLCs: () => void;
  onNavigateToForms: () => void;
  onNavigateToActivity: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  onNavigateToLCs,
  onNavigateToForms,
  onNavigateToActivity,
}) => {
  const [lcs, setLcs] = useState<LetterOfCreditItem[]>([]);
  const [forms, setForms] = useState<RegulatoryFormItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const [lcList, formList] = await Promise.all([
      LetterOfCreditApi.getRecords(),
      RegulatoryFormApi.getRecords(),
    ]);
    setLcs(lcList);
    setForms(formList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const totalLcVolume = lcs.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const pendingApprovalsCount = lcs.filter(
    (l) => l.status === 'In-Review' || l.status === 'Pending'
  ).length;

  return (
    <View style={styles.container}>
      <Header
        title="Trade Dashboard"
        subtitle="Trade Finance & Regulatory Monitoring"
        onRefresh={handleRefresh}
      />
      <ScrollView
        style={styles.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Top Key Metrics */}
        <View style={styles.metricsRow}>
          <MetricCard
            title="Active LCs"
            value={`$${(totalLcVolume / 1_000_000).toFixed(2)}M`}
            subtitle={`${lcs.length} total portfolios`}
            icon="document-text"
            color="#2563EB"
            accentBg="#DBEAFE"
          />
          <MetricCard
            title="Needs Approval"
            value={pendingApprovalsCount.toString()}
            subtitle="Requires authorization"
            icon="alert-circle"
            color="#EA580C"
            accentBg="#FFEDD5"
          />
        </View>

        {/* Quick Action Navigation */}
        <Text style={styles.sectionHeader}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onNavigateToLCs}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="card-outline" size={22} color="#2563EB" />
            </View>
            <Text style={styles.actionTitle}>Letters of Credit</Text>
            <Text style={styles.actionDesc}>Review issuance & adjustments</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onNavigateToForms}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="newspaper-outline" size={22} color="#16A34A" />
            </View>
            <Text style={styles.actionTitle}>Regulatory Forms</Text>
            <Text style={styles.actionDesc}>Form M, NXP, NCX, Form A</Text>
          </TouchableOpacity>
        </View>

        {/* Priority Letters of Credit */}
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionHeader}>Recent Letters of Credit</Text>
          <TouchableOpacity onPress={onNavigateToLCs}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {lcs.slice(0, 3).map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.itemCard}
            onPress={onNavigateToLCs}
          >
            <View style={styles.cardTop}>
              <Text style={styles.itemNumber}>{item.lcNumber}</Text>
              <StatusBadge status={item.status} />
            </View>
            <Text style={styles.itemApplicant} numberOfLines={1}>
              {item.applicantName}
            </Text>
            <Text style={styles.itemBeneficiary} numberOfLines={1}>
              Beneficiary: {item.beneficiaryName}
            </Text>
            <View style={styles.cardBottom}>
              <Text style={styles.itemAmount}>
                {item.currency} {item.amount.toLocaleString()}
              </Text>
              <Text style={styles.itemExpiry}>Exp: {item.expiryDate}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Regulatory Forms Overview */}
        <View style={[styles.sectionTitleRow, { marginTop: 20 }]}>
          <Text style={styles.sectionHeader}>Regulatory Submissions</Text>
          <TouchableOpacity onPress={onNavigateToForms}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {forms.slice(0, 2).map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.cardTop}>
              <View style={styles.formTypePill}>
                <Text style={styles.formTypePillText}>{item.formType}</Text>
              </View>
              <StatusBadge status={item.status} />
            </View>
            <Text style={styles.itemNumber}>{item.formNumber}</Text>
            <Text style={styles.itemApplicant}>{item.applicantName}</Text>
            <View style={styles.cardBottom}>
              <Text style={styles.itemAmount}>
                {item.currency} {item.amount.toLocaleString()}
              </Text>
              <Text style={styles.itemExpiry}>Submitted: {item.submittedDate}</Text>
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  seeAll: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '700',
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  actionDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  itemApplicant: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  itemBeneficiary: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  itemExpiry: {
    fontSize: 11,
    color: '#64748B',
  },
  formTypePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  formTypePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
});
