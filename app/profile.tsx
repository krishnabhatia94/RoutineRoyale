import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Profile = () => {
  const router = useRouter();

  const renderInfoRow = (label: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, value: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <View style={styles.imageWrapper}>
            <View style={styles.placeholderImage}>
              <Ionicons name="person" size={60} color="#1e40af" />
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => router.push('/edit_avatar')}
            >
              <Ionicons name="pencil" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userTitle}>Elite Competitor</Text>
        </View>

        {/* Account Info Card */}
        <View style={styles.card}>
          {renderInfoRow("Name", "Krishna Bhatia")}
          {renderInfoRow("Birthday", "January 15, 2002")}
        </View>

        {/* Divider & Stats Header */}
        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>STATS</Text>
          <View style={styles.line} />
        </View>

        {/* Stats Card */}
        <View style={styles.card}>
          {renderInfoRow("Total Points", "12,450")}
          {renderInfoRow("Current Streak", "12 Days")}
          {renderInfoRow("Challenges Won", "8")}
          {renderInfoRow("Global Rank", "#42")}
        </View>

        {/* Logout / Settings Button */}
        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContainer: { padding: 20, alignItems: 'center' },
  
  // Avatar Styles
  avatarContainer: { alignItems: 'center', marginBottom: 30 },
  imageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 4,
    borderColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  placeholderImage: { width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  editButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#3b82f6',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  userTitle: { marginTop: 15, fontSize: 16, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 },

  // Card Styles
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    padding: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: { color: '#64748b', fontWeight: '600', fontSize: 15 },
  infoValue: { color: '#1e40af', fontWeight: 'bold', fontSize: 15 },

  // Divider Styles
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 15,
  },
  line: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  dividerText: { marginHorizontal: 15, color: '#94a3b8', fontWeight: 'bold', letterSpacing: 2, fontSize: 12 },

  // Logout Button
  logoutBtn: {
    marginTop: 10,
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  logoutBtnText: { color: '#ef4444', fontWeight: 'bold', fontSize: 16 },
});

export default Profile;