import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
  FlatList,
  Image,
  Alert,
} from "react-native";
import MapView, { Marker, Polyline, AnimatedRegion } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { ChevronRight, Plus, X, MapPin } from "lucide-react-native";

const { height } = Dimensions.get("window");

export default function DirectionsScreen() {
  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [animatedRegion] = useState(
    new AnimatedRegion({ latitude: 0, longitude: 0, latitudeDelta: 0.01, longitudeDelta: 0.01 })
  );
  const [heading, setHeading] = useState(0);
  const [destinations, setDestinations] = useState<string[]>([""]);
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number }[]>([]);
  const [routeCoords, setRouteCoords] = useState<any[]>([]);
  const [eta, setEta] = useState<number | null>(null);
  const [instructions, setInstructions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);

  const animatedHeight = useRef(new Animated.Value(60)).current;

  // --- Watch User Location ---
  useEffect(() => {
    let subscriber: Location.LocationSubscription;
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "Location permission is needed for navigation.");
        return;
      }
      subscriber = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 2000, distanceInterval: 2 },
        (loc) => {
          const { latitude, longitude, heading } = loc.coords;
          setUserLocation({ latitude, longitude });
          setHeading(heading || 0);
        }
      );
    })();
    return () => subscriber && subscriber.remove();
  }, []);

  useEffect(() => {
    if (userLocation) {
      animatedRegion.timing({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        duration: 500,
        useNativeDriver: false,
      }).start();
      mapRef.current?.animateCamera({ center: userLocation, zoom: 15 }, { duration: 500 });
    }
  }, [userLocation]);

  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: isSearchExpanded ? 300 : 60,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isSearchExpanded]);

  // --- Fetch Nominatim Suggestions ---
  const fetchAutocompleteSuggestions = async (query: string, index: number) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    setActiveInputIndex(index);
    try {
      const res = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: { q: query, format: "json", addressdetails: 1, limit: 5 },
        headers: { "User-Agent": "Yatraksha-App/1.0 (meshram12@gmail.com)" },
      });
      setSuggestions(res.data || []);
    } catch (err) {
      console.error("Nominatim failed:", err.message);
      setSuggestions([]);
    }
  };

  const handleSuggestionPress = (item: any) => {
    if (activeInputIndex !== null) {
      const newDests = [...destinations];
      newDests[activeInputIndex] = item.display_name;
      setDestinations(newDests);

      const newCoords = [...coordinates];
      newCoords[activeInputIndex] = { lat: parseFloat(item.lat), lon: parseFloat(item.lon) };
      setCoordinates(newCoords);

      setSuggestions([]);
      setActiveInputIndex(null);
    }
  };

  // --- Fetch Route using OSRM ---
  // --- Fetch Route using OSRM ---
const handleSearch = async () => {
  if (!userLocation) {
    Alert.alert("Error", "Current location not available.");
    return;
  }

  const allPoints = [{ lat: userLocation.latitude, lon: userLocation.longitude }, ...coordinates].filter(Boolean);
  if (allPoints.length < 2) {
    Alert.alert("Error", "Enter at least one destination.");
    return;
  }

  setLoading(true);
  try {
    const coordsString = allPoints.map((p) => `${p.lon},${p.lat}`).join(";");
    const res = await axios.get(`https://router.project-osrm.org/route/v1/driving/${coordsString}`, {
      params: { overview: "full", steps: true, geometries: "geojson" },
    });

    const route = res.data.routes[0];
    if (!route) {
      Alert.alert("Error", "No route found.");
      setLoading(false);
      return;
    }

    // ✅ FIXED ETA (sum of all legs)
    const totalDuration = route.legs.reduce((acc: number, leg: any) => acc + leg.duration, 0);
    setEta(formatETA(totalDuration)); // <-- formatted nicely

    // ✅ FIXED instructions: make them human-readable
    const steps = route.legs.flatMap((leg: any) =>
      leg.steps.map((s: any) => {
        const { maneuver, name, distance } = s;
        const roadName = name && name.length > 0 ? ` onto ${name}` : "";
        const action = formatManeuver(maneuver);
        return {
          instruction: `${action}${roadName} (${Math.round(distance)} m)`,
        };
      })
    );
    setInstructions(steps);

    // ✅ Route coordinates
    const routeCoords = route.geometry.coordinates.map(([lon, lat]: number[]) => ({
      latitude: lat,
      longitude: lon,
    }));
    setRouteCoords(routeCoords);

    mapRef.current?.fitToCoordinates(routeCoords, {
      edgePadding: { top: 150, bottom: 300, left: 50, right: 50 },
      animated: true,
    });
  } catch (err: any) {
    console.error("OSRM error:", err.message);
    Alert.alert("Error", "Failed to fetch route.");
  } finally {
    setLoading(false);
  }
};

// ✅ Helper to format ETA nicely
const formatETA = (durationSeconds: number) => {
  const minutes = Math.round(durationSeconds / 60);
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMin = minutes % 60;
  return `${hours} hr${hours > 1 ? "s" : ""} ${remainingMin > 0 ? `${remainingMin} min` : ""}`;
};

// ✅ Helper to format maneuvers into nice text
const formatManeuver = (maneuver: any) => {
  if (!maneuver) return "Continue";
  const type = maneuver.type || "continue";
  const modifier = maneuver.modifier || "";

  switch (type) {
    case "turn":
      return `Turn ${modifier}`;
    case "merge":
      return `Merge ${modifier}`;
    case "roundabout":
      return `Enter roundabout, take exit ${maneuver.exit || ""}`;
    case "depart":
      return `Start`;
    case "arrive":
      return `Arrive at destination`;
    default:
      return type.charAt(0).toUpperCase() + type.slice(1);
  }
};


  return (
    <View style={styles.container}>
      <LinearGradient colors={["#ffffff", "#e0f7f6"]} style={styles.backgroundGradient} />
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude || 20,
          longitude: userLocation?.longitude || 78,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {userLocation && (
          <Marker coordinate={userLocation}>
            <Image source={require("../../assets/images/car.png")} style={{ width: 40, height: 40 }} />
          </Marker>
        )}
        {routeCoords.length > 0 && <Polyline coordinates={routeCoords} strokeColor="#008080" strokeWidth={5} />}
      </MapView>

      {/* Search UI */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.searchContainerWrapper}>
        <Animated.View style={[styles.searchCard, { height: animatedHeight }]}>
          <TouchableOpacity onPress={() => setIsSearchExpanded(!isSearchExpanded)} style={styles.searchHeader}>
            <Text style={styles.searchTitle}>Plan Your Trip</Text>
            <Ionicons name={isSearchExpanded ? "chevron-up" : "chevron-down"} size={24} color="#008080" />
          </TouchableOpacity>

          {isSearchExpanded && (
            <>
              <ScrollView style={styles.inputScrollView}>
                {destinations.map((dest, index) => (
                  <View key={index} style={styles.inputRow}>
                    <Ionicons name="location-outline" size={20} color="#008080" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder={`Destination ${index + 1}`}
                      value={dest}
                      onChangeText={(text) => {
                        const newDests = [...destinations];
                        newDests[index] = text;
                        setDestinations(newDests);
                        fetchAutocompleteSuggestions(text, index);
                      }}
                      onFocus={() => setActiveInputIndex(index)}
                      placeholderTextColor="#a0a0a0"
                    />
                    {destinations.length > 1 && (
                      <TouchableOpacity onPress={() => setDestinations(destinations.filter((_, i) => i !== index))}>
                        <X size={20} color="#FF4444" />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                {suggestions.length > 0 && activeInputIndex !== null && (
                  <FlatList
                    style={styles.suggestionsList}
                    data={suggestions}
                    keyExtractor={(item) => item.place_id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => handleSuggestionPress(item)} style={styles.suggestionItem}>
                        <MapPin size={16} color="#008080" />
                        <Text style={styles.suggestionText}>{item.display_name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                )}
                <TouchableOpacity onPress={() => setDestinations([...destinations, ""])} style={styles.addButton}>
                  <Plus size={20} color="#008080" />
                  <Text style={styles.addText}>Add another destination</Text>
                </TouchableOpacity>
              </ScrollView>
              <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.searchButtonText}>Get Directions</Text>}
              </TouchableOpacity>
            </>
          )}
        </Animated.View>
      </KeyboardAvoidingView>

      {/* Bottom Card */}
      {routeCoords.length > 0 && (
        <View style={styles.bottomCard}>
          <View style={styles.etaContainer}>
            <Text style={styles.etaText}>ETA: <Text style={styles.etaValue}>{eta ? `${eta} min` : "..."}</Text></Text>
          </View>
          <ScrollView style={styles.instructionsScrollView}>
            {instructions.map((step, index) => (
              <View key={index} style={[styles.instructionItem, { backgroundColor: index % 2 === 0 ? "#F0F8FF" : "white" }]}>
                <ChevronRight size={16} color="#008080" />
                <Text style={styles.instructionText}>{step.instruction}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundGradient: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  map: { flex: 1 },
  searchContainerWrapper: { position: "absolute", top: 50, left: 0, right: 0, alignItems: "center" },
  searchCard: { backgroundColor: "white", width: "90%", borderRadius: 20, padding: 20, elevation: 10, overflow: "hidden" },
  searchHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  searchTitle: { fontSize: 18, fontWeight: "700", color: "#008080" },
  inputScrollView: { marginTop: 10, maxHeight: 150 },
  inputRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#E6FFFA", borderRadius: 10, paddingHorizontal: 15, marginBottom: 10 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 44, color: "#333" },
  addButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 5, paddingVertical: 10 },
  addText: { color: "#008080", marginLeft: 8, fontWeight: "bold" },
  searchButton: { backgroundColor: "#00BFA6", borderRadius: 15, padding: 15, alignItems: "center", marginTop: 10 },
  searchButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  bottomCard: { position: "absolute", bottom: 80, left: 0, right: 0, backgroundColor: "white", borderTopLeftRadius: 25, borderTopRightRadius: 25, maxHeight: height * 0.4, elevation: 8 },
  etaContainer: { alignItems: "center", paddingVertical: 15, backgroundColor: "#FFB347", borderTopLeftRadius: 25, borderTopRightRadius: 25 },
  etaText: { fontSize: 20, fontWeight: "600", color: "white" },
  etaValue: { fontWeight: "bold" },
  instructionsScrollView: { paddingHorizontal: 20, paddingVertical: 10 },
  instructionItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 10, borderRadius: 10, marginBottom: 5 },
  instructionText: { marginLeft: 5, fontSize: 16, color: "#333" },
  suggestionsList: { backgroundColor: "white", borderRadius: 10, borderColor: "#E0E0E0", borderWidth: 1, zIndex: 10 },
  suggestionItem: { flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  suggestionText: { fontSize: 16, color: "#555", marginLeft: 5 },
});
