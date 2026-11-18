import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Header } from '../components/Header';
import { StatusBadge } from '../components/StatusBadge';
import { LetterOfCreditApi } from '../api/letterOfCredit.api';
import { LetterOfCreditItem, TradeStatus } from '../types/trade.types';
import { Ionicons } from '@expo/vector-icons';

const FILTER_TABS = ['All', 'In-Review', 'Pending', 'Approved', 'Draft'];

export const LetterOfCreditScreen = () => {
  const [lcs, setLcs] = useState<LetterOfCreditItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLC, setSelectedLC] = useState<LetterOfCreditItem | null>(null);

  const fetchRecords = async () => {
    const list = await LetterOfCreditApi.getRecords({
      status: selectedFilter,
      search,
    });
    setLcs(list);
  };

  useEffect(() => {
    fetchRecords();
  }, [selectedFilter, search]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRecords();
    setRefreshing(false);
  };

  const handleAuthorize = async () => {
    if (!selectedLC) return;
    Alert.alert(
      'Authorize Letter of Credit',
      `Confirm authorization for ${selectedLC.lcNumber}? This will trigger SWIFT MT700 transmission and accounting journal entries.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm Authorize',
          onPress: async () => {
            await LetterOfCreditApi.authorizeRecord(selectedLC.id);
            setLcs((prev) =>
              prev.map((item) =>
                item.id === selectedLC.id
                  ? { ...item, status: TradeStatus.APPROVED }
                  : item
              )
            );
            setSelectedLC(null);
            Alert.alert('Success', `${selectedLC.lcNumber} authorized successfully.`);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Letters of Credit"
        subtitle="Manage and Authorize LC Portfolios"
        onRefresh={onRefresh}
      />

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search LC number, applicant, or counterparty..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTER_TABS}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const active = selectedFilter === item;
            return (
              <TouchableOpacity
                onPress={() => setSelectedFilter(item)}
                style={[styles.tabChip, active && styles.tabChipActive]}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* List */}
      <FlatList
        data={lcs}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => setSelectedLC(item)}
          >
            <View style={styles.cardTop}>
              <View>
                <Text style={styles.lcNumber}>{item.lcNumber}</Text>
                <Text style={styles.lcType}>{item.type} LC • {item.tenorDays ?? 90} Days</Text>
              </View>
              <StatusBadge status={item.status} />
            </View>

            <View style={styles.divider} />

            <Text style={styles.label}>Applicant:</Text>
            <Text style={styles.applicantText}>{item.applicantName}</Text>

            <Text style={[styles.label, { marginTop: 6 }]}>Beneficiary:</Text>
            <Text style={styles.beneficiaryText}>{item.beneficiaryName}</Text>

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.label}>Amount</Text>
                <Text style={styles.amount}>
                  {item.currency} {item.amount.toLocaleString()}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.label}>Expiry</Text>
                <Text style={styles.expiry}>{item.expiryDate}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Detail & Action Modal */}
      <Modal visible={!!selectedLC} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{selectedLC?.lcNumber}</Text>
                <Text style={styles.modalSubtitle}>{selectedLC?.type} Letter of Credit</Text>
              </View>
              <TouchableOpacity onPress={() => setSelectedLC(null)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedLC && (
              <View style={styles.modalBody}>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Status:</Text>
                  <StatusBadge status={selectedLC.status} />
                </View>

                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Total Amount:</Text>
                  <Text style={styles.modalValue}>
                    {selectedLC.currency} {selectedLC.amount.toLocaleString()}
                  </Text>
                </View>

                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Applicant:</Text>
                  <Text style={[styles.modalValue, { flex: 1, textAlign: 'right' }]}>
                    {selectedLC.applicantName}
                  </Text>
                </View>

                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Beneficiary:</Text>
                  <Text style={[styles.modalValue, { flex: 1, textAlign: 'right' }]}>
                    {selectedLC.beneficiaryName}
                  </Text>
                </View>

                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Issue Date:</Text>
                  <Text style={styles.modalValue}>{selectedLC.issueDate}</Text>
                </View>

                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Expiry Date:</Text>
                  <Text style={styles.modalValue}>{selectedLC.expiryDate}</Text>
                </View>

                {selectedLC.branchName && (
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Branch:</Text>
                    <Text style={styles.modalValue}>{selectedLC.branchName}</Text>
                  </View>
                )}

                {/* Maker-Checker Approval Actions */}
                {(selectedLC.status === 'In-Review' || selectedLC.status === 'Pending') && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.btn, styles.btnAuthorize]}
                      onPress={handleAuthorize}
                    >
                      <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.btnAuthorizeText}>Authorize</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.btn, styles.btnReject]}
                      onPress={() => {
                        setSelectedLC(null);
                        Alert.alert('Reject Request', 'Enter rejection reason in admin portal.');
                      }}
                    >
                      <Ionicons name="close-circle-outline" size={18} color="#DC2626" style={{ marginRight: 6 }} />
                      <Text style={styles.btnRejectText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  tabsContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lcNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  lcType: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  label: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  applicantText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  beneficiaryText: {
    fontSize: 12,
    color: '#475569',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  amount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2563EB',
    marginTop: 2,
  },
  expiry: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  modalBody: {
    marginTop: 4,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  modalValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAuthorize: {
    backgroundColor: '#16A34A',
  },
  btnAuthorizeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  btnReject: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  btnRejectText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 14,
  },
});
