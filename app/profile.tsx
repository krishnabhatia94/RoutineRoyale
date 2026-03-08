import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useProfile } from '../context/ProfileContext';

const Profile = () => {
  const router = useRouter();
  const { 
    name, 
    username, 
    dob, 
    userId, 
    activeQuest, 
    totalPoints,
    addPoints,
    isDarkMode,
    toggleDarkMode
  } = useProfile();

  const handleResetPoints = () => {
    Alert.alert(
      "Reset Points",
      "Are you sure you want to clear all your progress? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: () => {
             addPoints(-totalPoints); 
        }}
      ]
    );
  };

  const renderInfoRow = (label: string, value: string | number) => (
    <View style={[styles.infoRow, isDarkMode && styles.infoRowDark]}>
      <Text style={[styles.infoLabel, isDarkMode && styles.infoLabelDark]}>{label}</Text>
      <Text style={[styles.infoValue, isDarkMode && styles.infoValueDark]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.safeAreaDark]}>
      {/* Top Left Theme Toggle - Now outside ScrollView for stable layout */}
      <View style={styles.togglePositioner}>
        <TouchableOpacity 
          style={[styles.verticalToggle, isDarkMode && styles.verticalToggleDark]} 
          onPress={toggleDarkMode}
          activeOpacity={0.8}
        >
          <View style={styles.toggleTrack}>
            {/* The Knob */}
            <View style={[styles.toggleKnob, isDarkMode ? styles.knobDown : styles.knobUp, isDarkMode && styles.toggleKnobDark]}>
              <Ionicons 
                name={isDarkMode ? "moon" : "sunny"} 
                size={14} 
                color={isDarkMode ? "#38bdf8" : "#f59e0b"} 
              />
            </View>
            
            {/* Empty track space for icons */}
            <View style={styles.trackIconSpace}>
              <Ionicons name="sunny" size={10} color={isDarkMode ? "#64748b" : "transparent"} />
              <Ionicons name="moon" size={10} color={isDarkMode ? "transparent" : "#64748b"} />
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Avatar Section */}
        <View style={styles.avatarContainer}>
          <View style={[styles.imageWrapper, isDarkMode && styles.imageWrapperDark]}>
            <View style={styles.placeholderImage}>
              <Ionicons name="person" size={60} color={isDarkMode ? "#38bdf8" : "#1e40af"} />
            </View>
            <TouchableOpacity 
              style={[styles.editButton, isDarkMode && styles.editButtonDark]}
              onPress={() => router.push('/edit_avatar')}
            >
              <Ionicons name="pencil" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.userTitle, isDarkMode && styles.userTitleDark]}>{username}</Text>
        </View>

        {/* Account Info Card */}
        <View style={[styles.card, isDarkMode && styles.cardDark]}>
          {renderInfoRow("Name", name)}
          {renderInfoRow("Username", username)}
          {renderInfoRow("Birthday", dob)}
          {renderInfoRow("User ID", userId)}
          {renderInfoRow("Active Quest", activeQuest ? activeQuest.title : "None")}
        </View>

        {/* Divider & Stats Header */}
        <View style={styles.dividerContainer}>
          <View style={[styles.line, isDarkMode && styles.lineDark]} />
          <Text style={[styles.dividerText, isDarkMode && styles.dividerTextDark]}>STATS</Text>
          <View style={[styles.line, isDarkMode && styles.lineDark]} />
        </View>

        {/* Stats Card */}
        <View style={[styles.card, isDarkMode && styles.cardDark]}>
          {/* Now using the live totalPoints from context */}
          {renderInfoRow("Total Points", totalPoints.toLocaleString())}
          {renderInfoRow("Challenges Won", "8")}
          {renderInfoRow("Global Rank", "#42")}
        </View>

        {/* --- RESET POINTS BUTTON --- */}
        <TouchableOpacity style={styles.resetBtn} onPress={handleResetPoints}>
          <Text style={styles.resetBtnText}>Reset Points</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  safeAreaDark: { backgroundColor: '#0f172a' },
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
  imageWrapperDark: { 
    backgroundColor: '#1e293b',
    borderColor: '#334155',
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
  editButtonDark: { borderColor: '#1e293b' },
  userTitle: { marginTop: 15, fontSize: 16, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 },
  userTitleDark: { color: '#94a3b8' },

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
  cardDark: { backgroundColor: '#1e293b' },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoRowDark: { borderBottomColor: '#334155' },
  infoLabel: { color: '#64748b', fontWeight: '600', fontSize: 15 },
  infoLabelDark: { color: '#94a3b8' },
  infoValue: { color: '#1e40af', fontWeight: 'bold', fontSize: 15 },
  infoValueDark: { color: '#38bdf8' },

  // Divider Styles
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 15,
  },
  line: { flex: 1, height: 1, backgroundColor: '#e2e8f0' },
  lineDark: { backgroundColor: '#334155' },
  dividerText: { marginHorizontal: 15, color: '#94a3b8', fontWeight: 'bold', letterSpacing: 2, fontSize: 12 },
  dividerTextDark: { color: '#64748b' },

  // Reset Button (Red box, white text)
  resetBtn: {
    backgroundColor: '#ef4444',
    padding: 16,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  resetBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  // Logout Button
  logoutBtn: {
    marginTop: 10,
    padding: 15,
    width: '100%',
    alignItems: 'center',
  },
  logoutBtnText: { color: '#ef4444', fontWeight: 'bold', fontSize: 16 },

  // Theme Toggle Styles
  togglePositioner: {
    position: 'absolute',
    top: 50, // Moved down slightly to avoid notch/header
    left: 20,
    zIndex: 9991, 
  },
  verticalToggle: {
    width: 36,
    height: 64,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    padding: 2,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  verticalToggleDark: { backgroundColor: '#334155' },
  toggleTrack: {
    flex: 1,
    width: '100%',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  toggleKnob: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  toggleKnobDark: { backgroundColor: '#1e293b' },
  knobUp: { top: 2 },
  knobDown: { bottom: 2 },
  trackIconSpace: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default Profile;