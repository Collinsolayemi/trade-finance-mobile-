import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Header } from '../components/Header';
import { StatusBadge } from '../components/StatusBadge';
import { RegulatoryFormApi } from '../api/regulatoryForm.api';
import { RegulatoryFormItem } from '../types/trade.types';

const FORM_TYPES = ['All', 'Form M', 'Form NXP', 'Form A'];

export const RegulatoryFormsScreen = () => {
  const [forms, setForms] = useState<RegulatoryFormItem[]>([]);
  const [selectedType, setSelectedType] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const fetchForms = async () => {
    const data = await RegulatoryFormApi.getRecords({ formType: selectedType });
    setForms(data);
  };

  useEffect(() => {
    fetchForms();
  }, [selectedType]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchForms();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Regulatory Forms"
        subtitle="TradeGov & TRMS Regulatory Submissions"
        onRefresh={onRefresh}
      />

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FORM_TYPES}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const active = selectedType === item;
            return (
              <TouchableOpacity
                onPress={() => setSelectedType(item)}
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

      <FlatList
        data={forms}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.pill}>
                <Text style={styles.pillText}>{item.formType}</Text>
              </View>
              <StatusBadge status={item.status} />
            </View>

            <Text style={styles.formNumber}>{item.formNumber}</Text>
            <Text style={styles.applicantName}>{item.applicantName}</Text>

            {item.purpose ? (
              <Text style={styles.purposeText} numberOfLines={2}>
                {item.purpose}
              </Text>
            ) : null}

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.label}>Amount</Text>
                <Text style={styles.amount}>
                  {item.currency} {item.amount.toLocaleString()}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.label}>Date Submitted</Text>
                <Text style={styles.date}>{item.submittedDate}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  tabsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  tabChipActive: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  pillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  formNumber: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  applicantName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginTop: 2,
  },
  purposeText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 6,
    fontStyle: 'italic',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  label: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  amount: {
    fontSize: 15,
    fontWeight: '800',
    color: '#16A34A',
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
});

