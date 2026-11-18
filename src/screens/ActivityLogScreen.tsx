import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { Header } from '../components/Header';
import { StatusBadge } from '../components/StatusBadge';
import { ActivityLogApi } from '../api/activityLog.api';
import { ActivityLogItem } from '../types/trade.types';
import { Ionicons } from '@expo/vector-icons';

export const ActivityLogScreen = () => {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLogs = async () => {
    const list = await ActivityLogApi.getLogs();
    setLogs(list);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchLogs();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Audit Logs"
        subtitle="Real-Time Trade Finance Event Stream"
        onRefresh={onRefresh}
      />

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.topRow}>
              <View style={styles.moduleTag}>
                <Ionicons name="shield-checkmark-outline" size={12} color="#2563EB" style={{ marginRight: 4 }} />
                <Text style={styles.moduleText}>{item.module}</Text>
              </View>
              <StatusBadge status={item.status} />
            </View>

            <Text style={styles.actionTitle}>{item.action}</Text>
            <Text style={styles.desc}>{item.description}</Text>

            <View style={styles.footerRow}>
              <Text style={styles.user}>By: {item.performedBy}</Text>
              <Text style={styles.time}>{item.timestamp}</Text>
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moduleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  moduleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563EB',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  desc: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  user: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  time: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
