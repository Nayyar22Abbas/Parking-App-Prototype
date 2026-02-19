import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Animated,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import ParkingMarker from '../components/ParkingMarker';
import SpotCard from '../components/SpotCard';
import SlotsModal from '../components/SlotsModal';
import BookingConfirmation from '../components/BookingConfirmation';
import { PARKING_SPOTS, INITIAL_REGION, COLORS } from '../data/parkingData';

// Filter chip options
const FILTER_OPTIONS = ['All', 'Covered', 'Open', 'EV Charging', 'Cheap'];

export default function HomeScreen() {
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [slotsVisible, setSlotsVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [booking, setBooking] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [mapType, setMapType] = useState('standard');

  const mapRef = useRef(null);
  const cardAnim = useRef(new Animated.Value(0)).current;

  // Show card with animation
  const showCard = useCallback((spot) => {
    setSelectedSpot(spot);
    Animated.spring(cardAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 70,
      friction: 8,
    }).start();

    // Animate map to spot
    mapRef.current?.animateToRegion(
      {
        latitude: spot.coordinate.latitude - 0.003,
        longitude: spot.coordinate.longitude,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      },
      600
    );
  }, [cardAnim]);

  // Hide card
  const hideCard = useCallback(() => {
    Animated.timing(cardAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSelectedSpot(null));
  }, [cardAnim]);

  const handleMarkerPress = useCallback((spot) => {
    if (selectedSpot?.id === spot.id) {
      hideCard();
    } else {
      showCard(spot);
    }
  }, [selectedSpot, showCard, hideCard]);

  const handleMapPress = useCallback(() => {
    if (selectedSpot) hideCard();
    if (searchFocused) setSearchFocused(false);
  }, [selectedSpot, searchFocused, hideCard]);

  const handleBookPress = useCallback(() => {
    if (!selectedSpot) return;
    setSlotsVisible(true);
  }, [selectedSpot]);

  const handleSlotsConfirm = useCallback((bookingData) => {
    setBooking(bookingData);
    setSlotsVisible(false);
    setConfirmVisible(true);
  }, []);

  const handleConfirmClose = useCallback(() => {
    setConfirmVisible(false);
    setBooking(null);
    hideCard();
  }, [hideCard]);

  const handleRecenter = useCallback(() => {
    mapRef.current?.animateToRegion(INITIAL_REGION, 600);
  }, []);

  // Filtered spots
  const filteredSpots = PARKING_SPOTS.filter(spot => {
    if (activeFilter === 'Covered') return spot.type === 'covered';
    if (activeFilter === 'Open') return spot.type === 'open';
    if (activeFilter === 'EV Charging') return spot.features.includes('EV Charging');
    if (activeFilter === 'Cheap') return spot.price <= 80;
    return true;
  });

  // Card transform
  const cardTranslateY = cardAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* MAP */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        mapType={mapType}
        showsUserLocation
        showsMyLocationButton={false}
        onPress={handleMapPress}
      >
        {filteredSpots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={spot.coordinate}
            onPress={() => handleMarkerPress(spot)}
            tracksViewChanges={true}
            anchor={{ x: 0.5, y: 1 }}
          >
            <ParkingMarker
              spot={spot}
              isSelected={selectedSpot?.id === spot.id}
              onPress={() => handleMarkerPress(spot)}
            />
          </Marker>
        ))}
      </MapView>

      {/* TOP HEADER */}
      <SafeAreaView style={styles.headerSafe} pointerEvents="box-none">
        <View style={styles.header}>
          {/* Logo row */}
          <View style={styles.logoRow}>
            <View style={styles.logoIcon}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoP}>P</Text>
              </View>
              <View style={styles.logoPin}>
                <View style={styles.logoPinInner} />
              </View>
            </View>
            <View>
              <Text style={styles.logoText}>
                <Text style={styles.logoTextPark}>Park</Text>
                <Text style={styles.logoTextWise}>Wise</Text>
              </Text>
              <Text style={styles.logoTagline}>Smart Parking, Anywhere</Text>
            </View>
            {/* Notif bell */}
            <TouchableOpacity style={styles.notifBtn} activeOpacity={0.8}>
              <Text style={styles.notifIcon}>🔔</Text>
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          {/* Search bar */}
          <View style={[styles.searchBar, searchFocused && styles.searchBarFocused]}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search parking, area, or landmark..."
              placeholderTextColor={COLORS.grayMid}
              value={searchText}
              onChangeText={setSearchText}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Filter chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {FILTER_OPTIONS.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  activeFilter === filter && styles.filterChipActive,
                ]}
                onPress={() => setActiveFilter(filter)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    activeFilter === filter && styles.filterChipTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* MAP CONTROLS (right side) */}
      <View style={styles.mapControls} pointerEvents="box-none">
        {/* Spots counter */}
        <View style={styles.spotsCounter}>
          <Text style={styles.spotsCountNum}>{filteredSpots.length}</Text>
          <Text style={styles.spotsCountLabel}>spots</Text>
        </View>

        {/* Zoom / recenter */}
        <TouchableOpacity style={styles.mapBtn} onPress={handleRecenter} activeOpacity={0.8}>
          <Text style={styles.mapBtnIcon}>◎</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mapBtn}
          onPress={() => setMapType(t => t === 'standard' ? 'satellite' : 'standard')}
          activeOpacity={0.8}
        >
          <Text style={styles.mapBtnIcon}>{mapType === 'standard' ? '🛰' : '🗺'}</Text>
        </TouchableOpacity>
      </View>

      {/* BOTTOM - SpotCard or BookMe button */}
      {selectedSpot ? (
        <Animated.View
          style={[
            styles.cardWrapper,
            { transform: [{ translateY: cardTranslateY }] },
          ]}
          pointerEvents="box-none"
        >
          {/* Close card button */}
          <TouchableOpacity style={styles.cardCloseBtn} onPress={hideCard}>
            <Text style={styles.cardCloseBtnText}>✕</Text>
          </TouchableOpacity>
          <SpotCard spot={selectedSpot} onBook={handleBookPress} />
        </Animated.View>
      ) : (
        <SafeAreaView style={styles.bottomSafe} pointerEvents="box-none">
          <View style={styles.bottomBar}>
            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNum}>
                  {PARKING_SPOTS.reduce((s, p) => s + p.available, 0)}
                </Text>
                <Text style={styles.statLabel}>Available</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNum}>{PARKING_SPOTS.length}</Text>
                <Text style={styles.statLabel}>Locations</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNum}>50 PKR</Text>
                <Text style={styles.statLabel}>From</Text>
              </View>
            </View>
            {/* Book Me CTA */}
            <TouchableOpacity
              style={styles.bookMeBtn}
              activeOpacity={0.88}
              onPress={() => {
                // Show nearest spot
                if (filteredSpots.length > 0) {
                  showCard(filteredSpots[0]);
                } else {
                  Alert.alert('No Spots', 'No parking spots match your current filter.');
                }
              }}
            >
              <Text style={styles.bookMeBtnIcon}>🅿</Text>
              <Text style={styles.bookMeBtnText}>Book Me</Text>
              <View style={styles.bookMeBtnBadge}>
                <Text style={styles.bookMeBtnBadgeText}>{filteredSpots.length}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}

      {/* SLOTS MODAL */}
      <SlotsModal
        visible={slotsVisible}
        spot={selectedSpot}
        onClose={() => setSlotsVisible(false)}
        onConfirm={handleSlotsConfirm}
      />

      {/* BOOKING CONFIRMATION */}
      <BookingConfirmation
        visible={confirmVisible}
        booking={booking}
        spot={selectedSpot}
        onClose={handleConfirmClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  // Header
  headerSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    margin: 12,
    marginTop: Platform.OS === 'android' ? 36 : 12,
    gap: 10,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
    gap: 10,
  },
  logoIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  logoCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.secondary,
  },
  logoP: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
  },
  logoPin: {
    position: 'absolute',
    bottom: -4,
    width: 10,
    height: 10,
    backgroundColor: COLORS.secondary,
    transform: [{ rotate: '45deg' }],
    borderBottomRightRadius: 2,
  },
  logoPinInner: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 6,
    height: 6,
    backgroundColor: COLORS.white,
    borderRadius: 3,
  },
  logoText: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  logoTextPark: {
    color: COLORS.primary,
  },
  logoTextWise: {
    color: COLORS.secondary,
  },
  logoTagline: {
    fontSize: 9,
    color: COLORS.gray,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginTop: -1,
  },
  notifBtn: {
    marginLeft: 'auto',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.grayLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifIcon: {
    fontSize: 16,
  },
  notifDot: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.danger,
    borderWidth: 1.5,
    borderColor: COLORS.white,
  },

  // Search
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 10,
  },
  searchBarFocused: {
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOpacity: 0.2,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: '500',
    padding: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnText: {
    fontSize: 12,
    color: COLORS.gray,
    fontWeight: '700',
  },

  // Filter chips
  filterRow: {
    gap: 8,
    paddingVertical: 2,
  },
  filterChip: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  filterChipTextActive: {
    color: COLORS.white,
  },

  // Map controls
  mapControls: {
    position: 'absolute',
    right: 14,
    top: '45%',
    gap: 10,
    alignItems: 'center',
    zIndex: 5,
  },
  spotsCounter: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
    minWidth: 44,
  },
  spotsCountNum: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '900',
  },
  spotsCountLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  mapBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  mapBtnIcon: {
    fontSize: 18,
  },

  // Bottom bar (Book Me)
  bottomSafe: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  bottomBar: {
    margin: 12,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 14,
    gap: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNum: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.grayLight,
  },
  bookMeBtn: {
    backgroundColor: COLORS.secondary,
    borderRadius: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 10,
  },
  bookMeBtnIcon: {
    fontSize: 20,
  },
  bookMeBtnText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  bookMeBtnBadge: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    minWidth: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  bookMeBtnBadgeText: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '900',
  },

  // Spot card
  cardWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  cardCloseBtn: {
    position: 'absolute',
    top: -16,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 25,
  },
  cardCloseBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.textSecondary,
  },
});
