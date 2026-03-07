import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const Quests = () => {
  const dailyQuests = [
    { id: 1, title: 'Morning Hydration', description: 'Drink 500ml of water', points: 50, icon: 'water', status: 'completed' },
    { id: 2, title: 'Power Pushups', description: 'Do 20 pushups', points: 100, icon: 'fitness', status: 'active' },
    { id: 3, title: 'Deep Focus', description: '15 mins of meditation', points: 75, icon: 'leaf', status: 'active' },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Daily Quests Section */}
        <View style={[styles.sectionHeader]}>
          <Text style={styles.sectionTitle}>Daily Quests</Text>
        </View>

        {/* Quest Description Section */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>
            Add one or more of these tasks to your routine to earn bonus points while in routine!
          </Text>
        </View>

        {dailyQuests.map((quest) => (
          <View key={quest.id} style={styles.questCard}>
            <View style={[styles.iconBox, quest.status === 'completed' && styles.iconBoxDone]}>
              <Ionicons 
                name={quest.icon as any} 
                size={22} 
                color={quest.status === 'completed' ? '#10b981' : '#1e40af'} 
              />
            </View>
            <View style={styles.questInfo}>
              <Text style={styles.questTitle}>{quest.title}</Text>
              <Text style={styles.questDesc}>{quest.description}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.questAction, quest.status === 'completed' && styles.questActionDone]}
              disabled={quest.status === 'completed'}
            >
              {quest.status === 'completed' ? (
                <Ionicons name="checkmark" size={20} color="white" />
              ) : (
                <Text style={styles.pointsAdd}>+{quest.points}</Text>
              )}
            </TouchableOpacity>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContainer: { padding: 20 },
  sectionHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginBottom: 15 
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1e40af' },

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
  iconBox: { width: 45, height: 45, borderRadius: 12, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center' },
  iconBoxDone: { backgroundColor: '#ecfdf5' },
  questInfo: { flex: 1, marginLeft: 15 },
  questTitle: { fontSize: 15, fontWeight: 'bold', color: '#1e293b' },
  questDesc: { fontSize: 12, color: '#64748b', marginTop: 2 },
  questAction: { 
    width: 50, 
    height: 35, 
    backgroundColor: '#3b82f6', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  questActionDone: { backgroundColor: '#10b981' },
  pointsAdd: { color: 'white', fontWeight: 'bold', fontSize: 12 },
});

export default Quests;