import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomAvatar } from '../context/ProfileContext';

interface AvatarProps {
  customAvatar: CustomAvatar;
  size?: number;
  isDarkMode?: boolean;
  hatTopOffset?: number;
  hatLeftOffset?: number;
  shirtBottomOffset?: number;
  shirtLeftOffset?: number;
}

const Avatar: React.FC<AvatarProps> = ({ 
  customAvatar, 
  size = 120, 
  isDarkMode = false,
  hatTopOffset = 0,
  hatLeftOffset = 0,
  shirtBottomOffset = 0,
  shirtLeftOffset = 0
}) => {
  const iconSize = size;
  const hatSize = size * 0.33;
  const shirtSize = size * 0.33;

  return (
    <View style={[styles.avatarBase, { width: size, height: size }]}>
      <Ionicons name="person" size={iconSize} color={customAvatar.skinColor} />
      {customAvatar.hat && (
        <View style={[
          styles.hatOverlay, 
          { 
            top: (size * 0.1) + hatTopOffset,
            transform: [{ translateX: hatLeftOffset }]
          }
        ]}>
          <Ionicons name={customAvatar.hat as any} size={hatSize} color={isDarkMode ? "white" : "#455a64"} />
        </View>
      )}
      {customAvatar.shirt && (
        <View style={[
          styles.shirtOverlay, 
          { 
            bottom: (size * 0.15) + shirtBottomOffset,
            transform: [{ translateX: shirtLeftOffset }]
          }
        ]}>
          <Ionicons name={customAvatar.shirt as any} size={shirtSize} color={isDarkMode ? "white" : "#455a64"} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  avatarBase: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hatOverlay: {
    position: 'absolute',
    zIndex: 1,
  },
  shirtOverlay: {
    position: 'absolute',
    zIndex: 1,
  },
});

export default Avatar;
