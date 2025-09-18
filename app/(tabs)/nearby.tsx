import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { MapPin, Hotel, ShoppingBag, Calendar, Navigation, Star, Clock, Phone } from 'lucide-react-native';

export default function NearbyScreen() {
  const [selectedCategory, setSelectedCategory] = useState('hotels');
  const [userLocation, setUserLocation] = useState(null);
  const [data, setData] = useState(getInitialData());
  const mapRef = useRef<MapView>(null);

  // Get live location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required for nearby recommendations.');
        return;
      }

      // Watch user location continuously
      Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10 },
        (loc) => {
          const coords = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };
          setUserLocation(coords);
          setData((prev) => recalcDistances(prev, coords));

          // Center map on user
          if (mapRef.current) {
            mapRef.current.animateCamera({ center: coords, zoom: 14 }, { duration: 500 });
          }
        }
      );
    })();
  }, []);

  const categories = [
    { id: 'hotels', title: 'Hotels', icon: Hotel },
    { id: 'markets', title: 'Markets', icon: ShoppingBag },
    { id: 'events', title: 'Events', icon: Calendar },
  ];

  const handleGetDirections = (placeName) => {
    Alert.alert('Directions', `Navigate to ${placeName} from your location.`);
  };

  const handleCall = (phone) => {
    Alert.alert('Call', `Calling ${phone}...`);
  };

  const currentList = data[selectedCategory] || [];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Services</Text>
        <Text style={styles.subtitle}>
          {userLocation ? `Live results near you` : `Waiting for location...`}
        </Text>
      </View>

      {/* Mini Map */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: userLocation?.latitude || 28.61,
            longitude: userLocation?.longitude || 77.23,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {userLocation && (
            <Marker
              coordinate={userLocation}
              title="You"
              pinColor="blue"
            />
          )}

          {currentList.map((item) => (
            <Marker
              key={item.id}
              coordinate={{ latitude: item.lat, longitude: item.lon }}
              title={item.name}
              description={`${item.distance} km away`}
              pinColor="#008080"
              onPress={() => {
                Alert.alert(item.name, `You tapped on ${item.name}`);
              }}
            />
          ))}
        </MapView>
      </View>

      {/* Category Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.activeCategoryButton,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <category.icon
              size={20}
              color={selectedCategory === category.id ? 'white' : '#008080'}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.activeCategoryText,
              ]}
            >
              {category.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* List of Recommendations */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedCategory === 'hotels' &&
          data.hotels.map((h) => (
            <HotelCard key={h.id} hotel={h} onNav={handleGetDirections} onCall={handleCall} />
          ))}
        {selectedCategory === 'markets' &&
          data.markets.map((m) => (
            <MarketCard key={m.id} market={m} onNav={handleGetDirections} />
          ))}
        {selectedCategory === 'events' &&
          data.events.map((e) => (
            <EventCard key={e.id} event={e} onNav={handleGetDirections} />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Utility: Haversine distance ---
function recalcDistances(prevData, userLoc) {
  const haversine = (lat1, lon1, lat2, lon2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return parseFloat((R * c).toFixed(2));
  };
  const c = (a) => 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const update = (items) =>
    items
      .map((item) => ({
        ...item,
        distance: haversine(userLoc.latitude, userLoc.longitude, item.lat, item.lon),
      }))
      .sort((a, b) => a.distance - b.distance);

  return {
    hotels: update(prevData.hotels),
    markets: update(prevData.markets),
    events: update(prevData.events),
  };
}

// --- Data ---
function getInitialData() {
  return {
    hotels: [
      { id: 1, name: 'Grand Heritage Hotel', lat: 28.656, lon: 77.241, rating: 4.5, price: '₹3,500/night', address: 'Near Red Fort, Old Delhi', phone: '+91 11 1234 5678' },
      { id: 2, name: 'Budget Stay Inn', lat: 28.655, lon: 77.229, rating: 3.8, price: '₹1,200/night', address: 'Chandni Chowk, Delhi', phone: '+91 11 2345 6789' },
      { id: 3, name: 'Royal Palace Hotel', lat: 28.632, lon: 77.219, rating: 4.8, price: '₹8,500/night', address: 'Connaught Place, Delhi', phone: '+91 11 3456 7890' },
    ],
    markets: [
      { id: 1, name: 'Chandni Chowk Market', lat: 28.6562, lon: 77.2305, rating: 4.2, specialty: 'Traditional Items & Food', hours: '10 AM - 9 PM', address: 'Chandni Chowk, Old Delhi' },
      { id: 2, name: 'Khan Market', lat: 28.600, lon: 77.227, rating: 4.6, specialty: 'Books, Clothes, Cafes', hours: '10 AM - 8 PM', address: 'Khan Market, New Delhi' },
      { id: 3, name: 'Karol Bagh Market', lat: 28.653, lon: 77.190, rating: 4.0, specialty: 'Electronics & Textiles', hours: '10 AM - 9 PM', address: 'Karol Bagh, Delhi' },
    ],
    events: [
      { id: 1, name: 'Delhi Heritage Walk', lat: 28.656, lon: 77.241, date: 'Today, 6 PM', price: 'Free', description: 'Guided tour of historical monuments', organizer: 'Delhi Tourism' },
      { id: 2, name: 'Cultural Festival', lat: 28.620, lon: 77.210, date: 'Tomorrow, 7 PM', price: '₹200', description: 'Traditional music and dance performances', organizer: 'India Habitat Centre' },
      { id: 3, name: 'Food Festival', lat: 28.640, lon: 77.230, date: 'This Weekend', price: '₹500', description: 'Street food and local delicacies', organizer: 'Food Lovers Club' },
    ],
  };
}

// --- Card Components (same as before) ---
const HotelCard = ({ hotel, onNav, onCall }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.cardTitleRow}>
        <Text style={styles.cardTitle}>{hotel.name}</Text>
        <View style={styles.ratingContainer}>
          <Star size={14} color="#FFD700" />
          <Text style={styles.rating}>{hotel.rating}</Text>
        </View>
      </View>
      <Text style={styles.price}>{hotel.price}</Text>
    </View>
    <View style={styles.cardInfo}>
      <View style={styles.infoRow}>
        <MapPin size={14} color="#666" />
        <Text style={styles.infoText}>{hotel.address}</Text>
      </View>
      <Text style={styles.distance}>{hotel.distance} km away</Text>
    </View>
    <View style={styles.cardActions}>
      <TouchableOpacity style={styles.actionButton} onPress={() => onNav(hotel.name)}>
        <Navigation size={16} color="#008080" />
        <Text style={styles.actionText}>Directions</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={() => onCall(hotel.phone)}>
        <Phone size={16} color="#008080" />
        <Text style={styles.actionText}>Call</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const MarketCard = ({ market, onNav }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.cardTitleRow}>
        <Text style={styles.cardTitle}>{market.name}</Text>
        <View style={styles.ratingContainer}>
          <Star size={14} color="#FFD700" />
          <Text style={styles.rating}>{market.rating}</Text>
        </View>
      </View>
      <Text style={styles.specialty}>{market.specialty}</Text>
    </View>
    <View style={styles.cardInfo}>
      <View style={styles.infoRow}>
        <MapPin size={14} color="#666" />
        <Text style={styles.infoText}>{market.address}</Text>
      </View>
      <View style={styles.infoRow}>
        <Clock size={14} color="#666" />
        <Text style={styles.infoText}>{market.hours}</Text>
      </View>
      <Text style={styles.distance}>{market.distance} km away</Text>
    </View>
    <View style={styles.cardActions}>
      <TouchableOpacity style={[styles.actionButton, styles.fullWidthButton]} onPress={() => onNav(market.name)}>
        <Navigation size={16} color="#008080" />
        <Text style={styles.actionText}>Get Directions</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const EventCard = ({ event, onNav }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{event.name}</Text>
      <Text style={styles.price}>{event.price}</Text>
    </View>
    <Text style={styles.eventDescription}>{event.description}</Text>
    <View style={styles.cardInfo}>
      <View style={styles.infoRow}>
        <Calendar size={14} color="#666" />
        <Text style={styles.infoText}>{event.date}</Text>
      </View>
      <View style={styles.infoRow}>
        <MapPin size={14} color="#666" />
        <Text style={styles.infoText}>{event.organizer}</Text>
      </View>
      <Text style={styles.distance}>{event.distance} km away</Text>
    </View>
    <View style={styles.cardActions}>
      <TouchableOpacity style={[styles.actionButton, styles.fullWidthButton]} onPress={() => onNav(event.name)}>
        <Navigation size={16} color="#008080" />
        <Text style={styles.actionText}>Get Directions</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#CBEAF6' },
  header: { paddingHorizontal: 16, paddingVertical: 20, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#008080', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#666' },
  mapContainer: { height: 180, marginHorizontal: 16, borderRadius: 12, overflow: 'hidden', marginBottom: 12 },
  map: { flex: 1 },
  categoriesContainer: { marginBottom: 16 },
  categoriesContent: { paddingHorizontal: 16 },
  categoryButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginRight: 12, borderWidth: 2, borderColor: '#008080' },
  activeCategoryButton: { backgroundColor: '#008080' },
  categoryText: { fontSize: 14, fontWeight: '500', color: '#008080', marginLeft: 6 },
  activeCategoryText: { color: 'white' },
  content: { flex: 1, paddingHorizontal: 16 },
  card: { backgroundColor: 'white', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardHeader: { marginBottom: 12 },
  cardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#333', flex: 1, marginRight: 12 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  rating: { fontSize: 14, fontWeight: '500', color: '#333', marginLeft: 4 },
  price: { fontSize: 16, fontWeight: '600', color: '#008080' },
  specialty: { fontSize: 14, color: '#666', fontStyle: 'italic' },
  eventDescription: { fontSize: 14, color: '#666', marginBottom: 12, lineHeight: 20 },
  cardInfo: { marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  infoText: { fontSize: 14, color: '#666', marginLeft: 8, flex: 1 },
  distance: { fontSize: 12, color: '#008080', fontWeight: '500', marginTop: 4 },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between' },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F8FF', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, flex: 0.48, justifyContent: 'center' },
  fullWidthButton: { flex: 1 },
  actionText: { fontSize: 14, fontWeight: '500', color: '#008080', marginLeft: 6 },
});
