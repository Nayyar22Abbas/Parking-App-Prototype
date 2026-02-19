import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import { COLORS } from '../data/parkingData';

export default function BookingConfirmation({ visible, booking, spot, onClose }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const checkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 80,
          friction: 7,
        }),
        Animated.timing(checkAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      checkAnim.setValue(0);
    }
  }, [visible]);

  if (!booking || !spot) return null;

  // Generate booking reference
  const bookingRef = `PW-${Math.random().toString(36).toUpperCase().slice(2, 8)}`;
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
          {/* Success Icon */}
          <View style={styles.successCircle}>
            <Animated.Text style={[styles.checkmark, { opacity: checkAnim }]}>✓</Animated.Text>
          </View>

          <Text style={styles.title}>Booking Confirmed!</Text>
          <Text style={styles.subtitle}>Your parking slot is reserved</Text>

          {/* Booking ref */}
          <View style={styles.refBadge}>
            <Text style={styles.refLabel}>Booking Reference</Text>
            <Text style={styles.refValue}>{bookingRef}</Text>
          </View>

          {/* Details */}
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>🅿</Text>
              <Text style={styles.detailLabel}>Slot</Text>
              <Text style={styles.detailValue}>{booking.slot?.id || spot.slotNumber}</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>⏱</Text>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>{booking.duration}h</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailItem}>
              <Text style={styles.detailIcon}>💰</Text>
              <Text style={styles.detailLabel}>Total</Text>
              <Text style={styles.detailValue}>{booking.totalCost} PKR</Text>
            </View>
          </View>

          {/* Info rows */}
          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📍 Location</Text>
              <Text style={styles.infoValue} numberOfLines={1}>{spot.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>📅 Date</Text>
              <Text style={styles.infoValue}>{dateStr}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🕐 Start time</Text>
              <Text style={styles.infoValue}>{timeStr}</Text>
            </View>
          </View>

          {/* QR placeholder */}
          <View style={styles.qrBox}>
            <View style={styles.qrInner}>
              <View style={styles.qrGrid}>
                {Array.from({ length: 25 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.qrCell,
                      Math.random() > 0.4 && styles.qrCellFilled,
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.qrLabel}>Show at entrance</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.88}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(26,29,46,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
  },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  checkmark: {
    fontSize: 36,
    color: COLORS.white,
    fontWeight: '900',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  refBadge: {
    backgroundColor: COLORS.primary + '12',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary + '25',
    marginBottom: 20,
    width: '100%',
  },
  refLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  refValue: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 2,
    marginTop: 2,
  },
  detailsGrid: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 14,
    width: '100%',
    marginBottom: 16,
    alignItems: 'center',
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  detailDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.grayMid,
  },
  detailIcon: {
    fontSize: 18,
  },
  detailLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  infoList: {
    width: '100%',
    gap: 8,
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 12,
    color: COLORS.textPrimary,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },
  qrBox: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  qrInner: {
    alignItems: 'center',
    gap: 8,
  },
  qrGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 80,
    gap: 3,
  },
  qrCell: {
    width: 12,
    height: 12,
    borderRadius: 1,
    backgroundColor: COLORS.grayLight,
  },
  qrCellFilled: {
    backgroundColor: COLORS.textPrimary,
  },
  qrLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  doneBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  doneBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
