import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../data/parkingData';

export default function ParkingMarker({ spot, isSelected, onPress }) {
  const isAlmostFull = spot.available <= 3;
  const markerColor = isAlmostFull
    ? COLORS.danger
    : isSelected
    ? COLORS.secondary
    : COLORS.primary;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.container, isSelected && styles.selectedContainer]}>
        {/* Rectangular P Marker */}
        <View style={[styles.pBox, { backgroundColor: markerColor }, isSelected && styles.selectedBox]}>
          <Text style={styles.pText}>P</Text>
        </View>
        
        {/* Availability indicator */}
        {isAlmostFull && (
          <View style={styles.urgencyBadge}>
            <Text style={styles.urgencyText}>{spot.available}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 12,
  },
  selectedContainer: {
    transform: [{ scale: 1.25 }],
  },
  pBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  selectedBox: {
    borderWidth: 3,
    borderColor: COLORS.white,
    width: 48,
    height: 48,
  },
  pText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
  },
  urgencyBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.warning,
    borderRadius: 12,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  urgencyText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '900',
  },
});
