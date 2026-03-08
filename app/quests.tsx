import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import questsData from '../constants/quests.json';
import { useProfile, Quest } from '../context/ProfileContext';

const Quests = () => {
  const { activeQuest, setActiveQuest, isDarkMode } = useProfile();
  const dailyQuests = questsData as Quest[];

  const handleToggleQuest = (quest: Quest) => {
    if (activeQuest?.id === quest.id) {
      setActiveQuest(null);
    } else {
      setActiveQuest(quest);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.safeAreaDark]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Daily Quests Section */}
        <View style={[styles.sectionHeader]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.sectionTitleDark]}>Daily Quests</Text>
        </View>

        {/* Quest Description Section */}
        <View style={styles.descriptionContainer}>
          <Text style={[styles.descriptionText, isDarkMode && styles.descriptionTextDark]}>
            Add one or more of these tasks to your routine to earn bonus points while in routine!
          </Text>
        </View>

        {dailyQuests.map((quest) => {
          const isActive = activeQuest?.id === quest.id;
          return (
            <TouchableOpacity
              key={quest.id}
              style={[
                styles.questCard,
                isDarkMode && styles.questCardDark,
                isActive && styles.questCardActive
              ]}
              onPress={() => handleToggleQuest(quest)}
              activeOpacity={0.7}
            >
              <View style={[
                styles.iconBox, 
                isDarkMode && styles.iconBoxDark,
                isActive && styles.iconBoxActive
              ]}>
                <Ionicons
                  name={quest.icon as any}
                  size={22}
                  color={isActive ? (isDarkMode ? '#38bdf8' : '#3b82f6') : (isDarkMode ? '#38bdf8' : '#1e40af')}
                />
              </View>
              <View style={styles.questInfo}>
                <Text style={[styles.questTitle, isDarkMode && styles.questTitleDark, isActive && styles.questTitleActive]}>{quest.title}</Text>
                <Text style={[styles.questDesc, isDarkMode && styles.questDescDark]}>{quest.description}</Text>
              </View>
              <View
                style={[styles.questAction, isDarkMode && styles.questActionDark, isActive && styles.questActionActive]}
              >
                {isActive ? (
                  <Text style={styles.activeLabel}>Active</Text>
                ) : (
                  <Text style={styles.pointsAdd}>+{quest.points}</Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  safeAreaDark: { backgroundColor: '#0f172a' },
  scrollContainer: { padding: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e40af' },
  sectionTitleDark: { color: '#38bdf8' },

  // Quest Card Styles
  questCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  questCardDark: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
  },
  questCardActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff', // Light blue background for active
  },
  descriptionContainer: {
    width: '100%',
    paddingHorizontal: 5,
    marginBottom: 20,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#64748b', // Subtle slate gray to match your description style
    fontWeight: '400',
  },
  descriptionTextDark: { color: '#94a3b8' },
  iconBox: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center' },
  iconBoxDark: { backgroundColor: '#0f172a' },
  iconBoxActive: { backgroundColor: 'white' },
  questInfo: { flex: 1, marginLeft: 15 },
  questTitle: { fontSize: 15, fontWeight: 'bold', color: '#1e293b' },
  questTitleDark: { color: '#f8fafc' },
  questTitleActive: { color: '#1e40af' },
  questDesc: { fontSize: 12, color: '#64748b', marginTop: 2 },
  questDescDark: { color: '#94a3b8' },
  questAction: {
    width: 65,
    height: 35,
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  questActionDark: {
    backgroundColor: '#38bdf8',
  },
  questActionActive: {
    backgroundColor: '#1e40af',
  },
  pointsAdd: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  activeLabel: { color: 'white', fontWeight: 'bold', fontSize: 11, textTransform: 'uppercase' },
});

export default Quests;