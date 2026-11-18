import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { LetterOfCreditScreen } from './src/screens/LetterOfCreditScreen';
import { RegulatoryFormsScreen } from './src/screens/RegulatoryFormsScreen';
import { ActivityLogScreen } from './src/screens/ActivityLogScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';

type TabKey = 'dashboard' | 'lcs' | 'forms' | 'activity' | 'settings';

function MainApp() {
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');

  const renderScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardScreen
            onNavigateToLCs={() => setActiveTab('lcs')}
            onNavigateToForms={() => setActiveTab('forms')}
            onNavigateToActivity={() => setActiveTab('activity')}
          />
        );
      case 'lcs':
        return <LetterOfCreditScreen />;
      case 'forms':
        return <RegulatoryFormsScreen />;
      case 'activity':
        return <ActivityLogScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return (
          <DashboardScreen
            onNavigateToLCs={() => setActiveTab('lcs')}
            onNavigateToForms={() => setActiveTab('forms')}
            onNavigateToActivity={() => setActiveTab('activity')}
          />
        );
    }
  };

  const navItems: {
    key: TabKey;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    activeIcon: keyof typeof Ionicons.glyphMap;
  }[] = [
    {
      key: 'dashboard',
      label: 'Home',
      icon: 'speedometer-outline',
      activeIcon: 'speedometer',
    },
    {
      key: 'lcs',
      label: 'LCs',
      icon: 'card-outline',
      activeIcon: 'card',
    },
    {
      key: 'forms',
      label: 'Forms',
      icon: 'newspaper-outline',
      activeIcon: 'newspaper',
    },
    {
      key: 'activity',
      label: 'Audit',
      icon: 'shield-checkmark-outline',
      activeIcon: 'shield-checkmark',
    },
    {
      key: 'settings',
      label: 'Settings',
      icon: 'settings-outline',
      activeIcon: 'settings',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.screenWrapper}>{renderScreen()}</View>

      {/* Bottom Navigation Bar */}
      <View style={styles.tabBar}>
        {navItems.map((item) => {
          const isSelected = activeTab === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={styles.tabItem}
              onPress={() => setActiveTab(item.key)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isSelected ? item.activeIcon : item.icon}
                size={22}
                color={isSelected ? '#2563EB' : '#94A3B8'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isSelected ? '#2563EB' : '#94A3B8' },
                  isSelected && { fontWeight: '700' },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight || 0 : 0,
  },
  screenWrapper: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 4 : 0,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
});
