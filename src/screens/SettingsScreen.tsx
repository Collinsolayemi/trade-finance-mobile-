import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Header } from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { apiConfig, setApiBaseUrl } from '../api/config';
import { Ionicons } from '@expo/vector-icons';

export const SettingsScreen = () => {
  const { user, isDemoMode, setDemoMode, logout } = useAuth();
  const [endpoint, setEndpoint] = useState(apiConfig.baseUrl);

  const handleSaveEndpoint = () => {
    setApiBaseUrl(endpoint);
    Alert.alert('Configuration Saved', `Active API Endpoint set to:\n${endpoint}`);
  };

  return (
    <View style={styles.container}>
      <Header title="Settings" subtitle="Backend Endpoint & User Profile" />
      <ScrollView style={styles.content}>
        {/* User Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>User Profile</Text>
          <View style={styles.userInfoRow}>
            <View style={styles.bigAvatar}>
              <Text style={styles.bigAvatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userRole}>{user?.role}</Text>
              <Text style={styles.userBranch}>{user?.branch}</Text>
            </View>
          </View>
        </View>

        {/* Demo Mode Toggle */}
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Offline Demo Mode</Text>
              <Text style={styles.switchSubtitle}>
                Uses built-in trade fixtures when offline or backend is unreachable.
              </Text>
            </View>
            <Switch
              value={isDemoMode}
              onValueChange={setDemoMode}
              trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
              thumbColor={isDemoMode ? '#2563EB' : '#F1F5F9'}
            />
          </View>
        </View>

        {/* API Endpoint Configuration */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Backend API Endpoint</Text>
          <Text style={styles.desc}>
            Configure the host URL for the NestJS `trade-api` backend.
          </Text>

          <TextInput
            value={endpoint}
            onChangeText={setEndpoint}
            style={styles.input}
            placeholder="e.g. http://192.168.1.100:3000/v1"
            placeholderTextColor="#94A3B8"
            autoCapitalize="none"
          />

          <View style={styles.quickEndpointRow}>
            <TouchableOpacity
              style={styles.quickChip}
              onPress={() => setEndpoint('http://localhost:3000/v1')}
            >
              <Text style={styles.quickChipText}>iOS Sim (localhost)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickChip}
              onPress={() => setEndpoint('http://10.0.2.2:3000/v1')}
            >
              <Text style={styles.quickChipText}>Android (10.0.2.2)</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEndpoint}>
            <Ionicons name="checkmark-sharp" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.saveBtnText}>Update API Endpoint</Text>
          </TouchableOpacity>
        </View>

        {/* User Permissions List */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Active Permissions</Text>
          {user?.permissions.map((p, idx) => (
            <View key={idx} style={styles.permRow}>
              <Ionicons name="shield-checkmark" size={16} color="#16A34A" style={{ marginRight: 8 }} />
              <Text style={styles.permText}>{p}</Text>
            </View>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={18} color="#DC2626" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>

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
  content: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bigAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigAvatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  userRole: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
    marginTop: 2,
  },
  userBranch: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  switchSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  desc: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
    marginBottom: 10,
  },
  quickEndpointRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  quickChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
  },
  quickChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  saveBtn: {
    height: 42,
    backgroundColor: '#2563EB',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  permRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  permText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  logoutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: 8,
  },
  logoutText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 14,
  },
});
