import { useProfile } from '@/context/ProfileContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar';

const categories = ["Skin Tone", "Hats", "Shirts"];

const SKIN_TONES = [
  { name: "Blue", color: "#3b82f6", price: 0 },
  { name: "Fair", color: "#FFDBAC", price: 0 },
  { name: "Deep", color: "#8D5524", price: 0 },
  { name: "Tan", color: "#F1C27D", price: 0 },
  { name: "Rich", color: "#C68642", price: 0 },
  { name: "White", color: "#FFFFFF", price: 20 },
  { name: "Black", color: "#000000", price: 20 },
  { name: "Red", color: "#ef4444", price: 20 },
  { name: "Green", color: "#10b981", price: 20 },
  { name: "Pink", color: "#ec4899", price: 20 },
];

const HATS = [
  { name: "None", id: "none", icon: "ban", price: 0 },
  { name: "Briefcase", id: "briefcase", icon: "briefcase", price: 0 },
  { name: "Glasses", id: "glasses", icon: "glasses", price: 20 },
  { name: "School", id: "school", icon: "school", price: 20 },
  { name: "Medal", id: "medal", icon: "medal", price: 20 },
  { name: "Musical", id: "musical-notes", icon: "musical-notes", price: 20 },
];

const SHIRTS = [
  { name: "None", id: "none", icon: "ban", price: 0 },
  { name: "Fitness", id: "fitness", icon: "fitness", price: 0 },
  { name: "Water", id: "water", icon: "water", price: 20 },
  { name: "Book", id: "book", icon: "book", price: 20 },
  { name: "Flame", id: "flame", icon: "flame", price: 20 },
  { name: "Leaf", id: "leaf", icon: "leaf", price: 20 },
];

const Edit_Avatar = () => {
  const router = useRouter();
  const {
    isDarkMode,
    customAvatar,
    updateCustomAvatar,
    unlockedItems,
    unlockItem,
    totalPoints
  } = useProfile();
  const [activeCategory, setActiveCategory] = useState("Skin Tone");

  const handleItemPress = (item: any, type: 'skinColor' | 'hat' | 'shirt') => {
    const itemId = type === 'skinColor' ? item.color : item.id;
    const isUnlocked = unlockedItems.includes(itemId) || (item.price === 0);

    if (isUnlocked) {
      if (itemId === 'none') {
        updateCustomAvatar({ [type]: undefined });
      } else {
        updateCustomAvatar({ [type]: itemId });
      }
    } else {
      Alert.alert(
        "Unlock Item",
        `Would you like to unlock ${item.name} for ${item.price} points?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Unlock",
            onPress: () => {
              const success = unlockItem(itemId, item.price);
              if (success) {
                updateCustomAvatar({ [type]: itemId });
              } else {
                Alert.alert("Insufficient Points", `You need ${item.price} points. You have ${totalPoints}.`);
              }
            }
          }
        ]
      );
    }
  };
  const insets = useSafeAreaInsets();

  const renderOptionGrid = () => {
    let items: any[] = [];
    let type: 'skinColor' | 'hat' | 'shirt' = 'skinColor';

    if (activeCategory === "Skin Tone") {
      items = SKIN_TONES;
      type = 'skinColor';
    } else if (activeCategory === "Hats") {
      items = HATS;
      type = 'hat';
    } else if (activeCategory === "Shirts") {
      items = SHIRTS;
      type = 'shirt';
    }

    return items.map((item) => {
      const itemId = type === 'skinColor' ? item.color : item.id;
      const isLocked = !unlockedItems.includes(itemId) && item.price > 0;
      const currentSelected = type === 'skinColor' ? customAvatar.skinColor : customAvatar[type];
      const isSelected = currentSelected === itemId || (itemId === 'none' && !currentSelected);

      return (
        <TouchableOpacity
          key={item.name}
          style={[
            styles.optionItem,
            isDarkMode && styles.optionItemDark,
            isSelected && styles.selectedOption,
            isSelected && isDarkMode && styles.selectedOptionDark,
            isLocked && styles.lockedOptionItem
          ]}
          activeOpacity={0.7}
          onPress={() => handleItemPress(item, type)}
        >
          {isLocked ? (
            <View style={styles.lockOverlay}>
              <Ionicons name="lock-closed" size={14} color="white" />
              <Text style={styles.priceTag}>{item.price}</Text>
            </View>
          ) : (
            type === 'skinColor' ? (
              <View style={[styles.colorSquare, { backgroundColor: item.color }]} />
            ) : (
              <Ionicons name={item.icon} size={32} color={isDarkMode ? "#38bdf8" : "#1e40af"} />
            )
          )}
          <Text style={[styles.optionLabel, isDarkMode && styles.optionLabelDark]}>{item.name}</Text>
        </TouchableOpacity>
      );
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDarkMode && styles.safeAreaDark]}>

      {/* 1. Avatar Preview Area (Top) */}
      <View style={[styles.previewContainer, isDarkMode && styles.previewContainerDark]}>
        <View style={styles.previewPlaceholder}>
          <Avatar
            customAvatar={customAvatar}
            size={120}
            isDarkMode={isDarkMode}
            // Adjust these offsets to fine-tune accessory positioning
            hatTopOffset={-30}
            hatLeftOffset={0}
            shirtBottomOffset={-15}
            shirtLeftOffset={0}
          />
          <Text style={[styles.previewText, isDarkMode && styles.previewTextDark]}>Avatar Preview</Text>
        </View>
      </View>

      {/* 2. Category Navigation (Center) */}
      <View style={[styles.categoryWrapper, isDarkMode && styles.categoryWrapperDark]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.categoryButton,
                isDarkMode && styles.categoryButtonDark,
                activeCategory === cat && styles.categoryButtonActive,
                activeCategory === cat && isDarkMode && styles.categoryButtonActiveDark
              ]}
              onPress={() => setActiveCategory(cat)}
            >
              <Text style={[
                styles.categoryButtonText,
                isDarkMode && styles.categoryButtonTextDark,
                activeCategory === cat && styles.categoryButtonTextActive
              ]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 3. Selection Menu (Bottom) */}
      <View style={[styles.menuContainer, isDarkMode && styles.menuContainerDark]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={[styles.menuTitle, isDarkMode && styles.menuTitleDark]}>Select {activeCategory}</Text>

          <View style={styles.optionsGrid}>
            {renderOptionGrid()}
          </View>
        </ScrollView>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[
          styles.saveBtn,
          isDarkMode && styles.saveBtnDark,
          { marginBottom: Math.max(insets.bottom, 20) }
        ]}
        onPress={() => router.push('/profile')}
      >
        <Text style={styles.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  safeAreaDark: { backgroundColor: '#0f172a' },

  // Preview Section
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  previewContainerDark: { backgroundColor: '#0f172a' },
  previewPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBase: {
    position: 'relative',
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hatOverlay: {
    position: 'absolute',
    top: 5,
    right: 25,
    zIndex: 1,
  },
  shirtOverlay: {
    position: 'absolute',
    bottom: 25,
    zIndex: 1,
  },
  previewText: {
    marginTop: 10,
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  previewTextDark: { color: '#64748b' },

  // Category Bar
  categoryWrapper: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryWrapperDark: { backgroundColor: '#1e293b', borderColor: '#334155' },
  categoryScroll: {
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f1f5f9',
  },
  categoryButtonDark: { backgroundColor: '#0f172a' },
  categoryButtonActive: {
    backgroundColor: '#3b82f6',
  },
  categoryButtonActiveDark: { backgroundColor: '#38bdf8' },
  categoryButtonText: {
    color: '#64748b',
    fontWeight: 'bold',
  },
  categoryButtonTextDark: { color: '#94a3b8' },
  categoryButtonTextActive: {
    color: 'white',
  },

  // Menu Selection
  menuContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  menuContainerDark: { backgroundColor: '#0f172a' },
  menuTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748b',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  menuTitleDark: { color: '#475569' },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  optionItem: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionItemDark: { backgroundColor: '#1e293b' },
  selectedOption: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  selectedOptionDark: { borderColor: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)' },
  lockedOption: {
    backgroundColor: '#f1f5f9',
    elevation: 0,
    shadowOpacity: 0,
  },
  lockedOptionDark: { backgroundColor: '#0f172a' },
  optionLabel: {
    fontSize: 10,
    color: '#1e40af',
    fontWeight: 'bold',
    marginTop: 4,
  },
  optionLabelDark: { color: '#38bdf8' },
  colorSquare: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginBottom: 5,
  },
  lockedOptionItem: {
    opacity: 0.8,
  },
  lockOverlay: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  priceTag: {
    color: 'white',
    fontSize: 9,
    fontWeight: '900',
  },

  // Save Button
  saveBtn: {
    backgroundColor: '#1e40af',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
  },
  saveBtnDark: { backgroundColor: '#38bdf8' },
  saveBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default Edit_Avatar;