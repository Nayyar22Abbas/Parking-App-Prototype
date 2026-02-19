import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLORS } from '../data/parkingData';

// Star Rating component
function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <Text key={i} style={[styles.star, i <= Math.round(rating) && styles.starFilled]}>
        ★
      </Text>
    );
  }
  return <View style={styles.starsRow}>{stars}</View>;
}

// Availability bar
function AvailabilityBar({ available, total }) {
  const pct = (available / total) * 100;
  const barColor = available <= 3 ? COLORS.danger : available <= 8 ? COLORS.warning : COLORS.secondary;
  return (
    <View style={styles.availContainer}>
      <View style={styles.availBar}>
        <View style={[styles.availFill, { width: `${pct}%`, backgroundColor: barColor }]} />
      </View>
      <Text style={[styles.availText, { color: barColor }]}>
        {available} left
      </Text>
    </View>
  );
}

export default function SpotCard({ spot, onBook }) {
  if (!spot) return null;
  const isAlmostFull = spot.available <= 3;

  return (
    <View style={styles.card}>
      {/* Handle */}
      <View style={styles.handle} />

      <View style={styles.cardContent}>
        {/* Left: Parking visual */}
        <View style={styles.imageContainer}>
          <View style={styles.parkingIllustration}>
            <Text style={styles.parkingIcon}>🅿</Text>
            <Text style={styles.slotLabel}>{spot.slotNumber}</Text>
          </View>
          {isAlmostFull && (
            <View style={styles.urgentBadge}>
              <Text style={styles.urgentText}>Almost Full</Text>
            </View>
          )}
        </View>

        {/* Right: Info */}
        <View style={styles.infoContainer}>
          <View style={styles.topRow}>
            <View style={styles.nameBlock}>
              <Text style={styles.spotName} numberOfLines={1}>{spot.name}</Text>
              <Text style={styles.spotSubtitle} numberOfLines={1}>{spot.subtitle}</Text>
            </View>
            <View style={styles.priceBlock}>
              <Text style={styles.priceValue}>{spot.price}</Text>
              <Text style={styles.priceLabel}>PKR/hr</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>📍</Text>
              <Text style={styles.metaText}>{spot.distance}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <StarRating rating={spot.rating} />
              <Text style={styles.ratingText}>{spot.rating}</Text>
            </View>
          </View>

          <AvailabilityBar available={spot.available} total={spot.total} />
        </View>
      </View>

      {/* Features */}
      <View style={styles.featuresRow}>
        {spot.features.slice(0, 3).map((f, i) => (
          <View key={i} style={styles.featureChip}>
            <Text style={styles.featureText}>{f}</Text>
          </View>
        ))}
      </View>

      {/* Book Button */}
      <TouchableOpacity
        style={styles.bookBtn}
        onPress={onBook}
        activeOpacity={0.88}
      >
        <Text style={styles.bookBtnText}>Book Now  →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.grayMid,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  cardContent: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },
  imageContainer: {
    width: 90,
    position: 'relative',
  },
  parkingIllustration: {
    width: 90,
    height: 80,
    backgroundColor: COLORS.grayLight,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary + '30',
  },
  parkingIcon: {
    fontSize: 28,
  },
  slotLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  urgentBadge: {
    position: 'absolute',
    bottom: -6,
    left: 0,
    right: 0,
    backgroundColor: COLORS.danger,
    borderRadius: 8,
    paddingVertical: 2,
    alignItems: 'center',
  },
  urgentText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  infoContainer: {
    flex: 1,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameBlock: {
    flex: 1,
    marginRight: 8,
  },
  spotName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.2,
  },
  spotSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  priceBlock: {
    alignItems: 'flex-end',
    backgroundColor: COLORS.primary + '12',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.primary + '25',
  },
  priceValue: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },
  priceLabel: {
    fontSize: 8,
    color: COLORS.primary + 'CC',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaIcon: {
    fontSize: 11,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  metaDivider: {
    width: 1,
    height: 12,
    backgroundColor: COLORS.grayMid,
  },
  starsRow: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 11,
    color: COLORS.grayMid,
  },
  starFilled: {
    color: COLORS.warning,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginLeft: 2,
  },
  availContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  availBar: {
    flex: 1,
    height: 5,
    backgroundColor: COLORS.grayLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  availFill: {
    height: '100%',
    borderRadius: 3,
  },
  availText: {
    fontSize: 10,
    fontWeight: '800',
    minWidth: 36,
    textAlign: 'right',
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  featureChip: {
    backgroundColor: COLORS.primary + '10',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.primary + '20',
  },
  featureText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '700',
  },
  bookBtn: {
    backgroundColor: COLORS.secondary,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  bookBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
