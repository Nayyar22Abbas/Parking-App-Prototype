import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { COLORS } from '../data/parkingData';

function SlotCell({ slot, isSelected, onSelect }) {
  if (slot.type === 'disabled') {
    return <View style={[styles.slotCell, styles.slotDisabled]} />;
  }
  if (slot.type === 'occupied') {
    return (
      <View style={[styles.slotCell, styles.slotOccupied]}>
        <Text style={styles.slotIcon}>🚗</Text>
        <Text style={styles.slotNumOccupied}>{slot.id}</Text>
      </View>
    );
  }
  return (
    <TouchableOpacity
      style={[
        styles.slotCell,
        styles.slotAvailable,
        isSelected && styles.slotSelected,
      ]}
      onPress={() => onSelect(slot)}
      activeOpacity={0.75}
    >
      <Text style={styles.slotNum}>{slot.id}</Text>
      {isSelected && <Text style={styles.checkmark}>✓</Text>}
    </TouchableOpacity>
  );
}

function generateSlots(spot) {
  const rows = 4;
  const cols = 5;
  const slots = [];

  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const id = r * cols + c + 1;
      if (id > spot.total) {
        row.push({ id, type: 'disabled' });
      } else {
        row.push({ id: `${id}`.padStart(2, '0'), type: 'available' });
      }
    }
    slots.push(row);
  }
  return slots;
}

export default function SlotsModal({ visible, spot, onClose, onConfirm }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [duration, setDuration] = useState(1);

  if (!spot) return null;

  const slots = generateSlots(spot);
  const totalCost = spot.price * duration;

  const handleConfirm = () => {
    if (!selectedSlot) {
      Alert.alert('Select a Slot', 'Please select an available parking slot to continue.');
      return;
    }
    onConfirm({ slot: selectedSlot, duration, totalCost });
    setSelectedSlot(null);
    setDuration(1);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{spot.name}</Text>
            <Text style={styles.headerSubtitle}>Choose your slot</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerPrice}>{spot.price} PKR</Text>
            <Text style={styles.headerPriceLabel}>per hour</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.secondary }]} />
              <Text style={styles.legendLabel}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.legendLabel}>Selected</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: COLORS.grayMid }]} />
              <Text style={styles.legendLabel}>Occupied</Text>
            </View>
          </View>

          {/* Entrance indicator */}
          <View style={styles.entranceRow}>
            <View style={styles.entranceLine} />
            <View style={styles.entranceBadge}>
              <Text style={styles.entranceText}>ENTRANCE</Text>
            </View>
            <View style={styles.entranceLine} />
          </View>

          {/* Slot Grid */}
          <View style={styles.slotGrid}>
            {slots.map((row, rowIdx) => (
              <View key={rowIdx} style={styles.slotRow}>
                {row.map((slot, colIdx) => (
                  <React.Fragment key={colIdx}>
                    {colIdx === 2 && <View style={styles.driveway} />}
                    <SlotCell
                      slot={slot}
                      isSelected={selectedSlot?.id === slot.id}
                      onSelect={setSelectedSlot}
                    />
                  </React.Fragment>
                ))}
              </View>
            ))}
          </View>

          {/* Row labels */}
          <View style={styles.rowLabels}>
            {['A', 'B', 'C', 'D'].map(l => (
              <Text key={l} style={styles.rowLabel}>{l}</Text>
            ))}
          </View>

          {/* Selected slot info */}
          {selectedSlot && (
            <View style={styles.selectedInfo}>
              <Text style={styles.selectedInfoTitle}>Slot {selectedSlot.id} selected</Text>
              <Text style={styles.selectedInfoSub}>Ground floor · Covered</Text>
            </View>
          )}

          {/* Duration picker */}
          <View style={styles.durationSection}>
            <Text style={styles.sectionLabel}>Parking Duration</Text>
            <View style={styles.durationPicker}>
              <TouchableOpacity
                style={styles.durationBtn}
                onPress={() => setDuration(Math.max(1, duration - 1))}
              >
                <Text style={styles.durationBtnText}>−</Text>
              </TouchableOpacity>
              <View style={styles.durationDisplay}>
                <Text style={styles.durationValue}>{duration}</Text>
                <Text style={styles.durationUnit}>hour{duration > 1 ? 's' : ''}</Text>
              </View>
              <TouchableOpacity
                style={styles.durationBtn}
                onPress={() => setDuration(Math.min(12, duration + 1))}
              >
                <Text style={styles.durationBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Cost summary */}
          <View style={styles.costSummary}>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Parking fee</Text>
              <Text style={styles.costValue}>{spot.price} PKR × {duration}h</Text>
            </View>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Service fee</Text>
              <Text style={styles.costValue}>20 PKR</Text>
            </View>
            <View style={styles.costDivider} />
            <View style={styles.costRow}>
              <Text style={styles.costLabelBold}>Total</Text>
              <Text style={styles.costTotal}>{totalCost + 20} PKR</Text>
            </View>
          </View>
        </ScrollView>

        {/* Confirm button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.confirmBtn, !selectedSlot && styles.confirmBtnDisabled]}
            onPress={handleConfirm}
            activeOpacity={0.88}
          >
            <Text style={styles.confirmBtnText}>
              {selectedSlot ? `Confirm Slot ${selectedSlot.id}  →` : 'Select a Slot to Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 24,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  headerPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primary,
  },
  headerPriceLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  entranceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  entranceLine: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.grayMid,
    borderStyle: 'dashed',
  },
  entranceBadge: {
    backgroundColor: COLORS.primary + '15',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderWidth: 1.5,
    borderColor: COLORS.primary + '30',
  },
  entranceText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  slotGrid: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  slotRow: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  driveway: {
    width: 24,
  },
  slotCell: {
    width: 50,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotAvailable: {
    backgroundColor: COLORS.secondary + '20',
    borderWidth: 2,
    borderColor: COLORS.secondary,
    borderStyle: 'dashed',
  },
  slotOccupied: {
    backgroundColor: COLORS.grayLight,
    borderWidth: 1.5,
    borderColor: COLORS.grayMid,
  },
  slotDisabled: {
    backgroundColor: 'transparent',
  },
  slotSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    borderStyle: 'solid',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  slotNum: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  slotNumOccupied: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.gray,
    marginTop: 1,
  },
  slotIcon: {
    fontSize: 16,
  },
  checkmark: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '900',
  },
  rowLabels: {
    flexDirection: 'column',
    position: 'absolute',
    right: 4,
    top: 130,
    gap: 18,
  },
  rowLabel: {
    fontSize: 10,
    color: COLORS.gray,
    fontWeight: '700',
  },
  selectedInfo: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  selectedInfoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.white,
  },
  selectedInfoSub: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  durationSection: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  durationPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderRadius: 14,
    padding: 4,
  },
  durationBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  durationBtnText: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
  },
  durationDisplay: {
    alignItems: 'center',
    flex: 1,
  },
  durationValue: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textPrimary,
    lineHeight: 36,
  },
  durationUnit: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  costSummary: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  costLabelBold: {
    fontSize: 15,
    color: COLORS.textPrimary,
    fontWeight: '800',
  },
  costValue: {
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  costTotal: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  costDivider: {
    height: 1,
    backgroundColor: COLORS.grayLight,
  },
  footer: {
    padding: 20,
    paddingBottom: 36,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.grayLight,
  },
  confirmBtn: {
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  confirmBtnDisabled: {
    backgroundColor: COLORS.grayMid,
    shadowOpacity: 0,
    elevation: 0,
  },
  confirmBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
