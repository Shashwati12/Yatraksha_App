import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  MapPin,
  Calendar,
  Clock,
  TriangleAlert as AlertTriangle,
  Navigation,
  Users,
  FileText,
  Plane,
} from "lucide-react-native";

export default function HistoryScreen() {
  const [selectedTab, setSelectedTab] = useState("trips");

  const historyTabs = [
    { id: "trips", title: "Trips", icon: MapPin, emoji: "🗺" },
    { id: "sos", title: "SOS", icon: AlertTriangle, emoji: "🚨" },
    { id: "routes", title: "Routes", icon: Navigation, emoji: "🛣" },
  ];

  const tripHistory = [
    {
      id: 1,
      destination: "Gateway of India, Mumbai",
      startDate: "15 Dec 2024",
      endDate: "20 Dec 2024",
      companions: 3,
      status: "Completed",
      duration: "5 days",
      emergencyEvents: 0,
    },
    {
      id: 2,
      destination: "Goa Beaches Tour",
      startDate: "1 Dec 2024",
      endDate: "5 Dec 2024",
      companions: 2,
      status: "Completed",
      duration: "4 days",
      emergencyEvents: 1,
    },
  ];

  const sosHistory = [
    {
      id: 1,
      type: "False Alarm",
      date: "2 Dec 2024",
      time: "3:45 PM",
      location: "Calangute Beach, Goa",
      responseTime: "30 seconds",
      resolved: true,
      details: "Accidental SOS activation - cancelled within grace period",
    },
  ];

  const routeHistory = [
    {
      id: 1,
      from: "Red Fort, Delhi",
      to: "India Gate, Delhi",
      date: "20 Dec 2024",
      duration: "25 minutes",
      distance: "8.5 km",
      mode: "Car",
    },
  ];

  const handleViewTripDetails = (trip) => {
    Alert.alert("Trip Details", `View complete details for ${trip.destination}`);
  };

  const handleViewSOSDetails = (sos) => {
    Alert.alert("SOS Event Details", sos.details);
  };

  const renderTripCard = (trip) => (
    <TouchableOpacity
      key={trip.id}
      style={styles.card}
      onPress={() => handleViewTripDetails(trip)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{trip.destination}</Text>
        <Text
          style={[
            styles.status,
            trip.status === "Completed" ? styles.completedStatus : styles.activeStatus,
          ]}
        >
          {trip.status}
        </Text>
      </View>

      <View style={styles.cardInfo}>
        <View style={styles.infoRow}>
          <Calendar size={16} color="#008080" />
          <Text style={styles.infoText}>
            {trip.startDate} → {trip.endDate}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Clock size={16} color="#008080" />
          <Text style={styles.infoText}>{trip.duration}</Text>
        </View>
        <View style={styles.infoRow}>
          <Users size={16} color="#008080" />
          <Text style={styles.infoText}>{trip.companions} companions</Text>
        </View>
        {trip.emergencyEvents > 0 && (
          <View style={styles.infoRow}>
            <AlertTriangle size={16} color="#FF6B35" />
            <Text style={[styles.infoText, styles.emergencyText]}>
              {trip.emergencyEvents} emergency event(s)
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderSOSCard = (sos) => (
    <TouchableOpacity
      key={sos.id}
      style={styles.card}
      onPress={() => handleViewSOSDetails(sos)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{sos.type}</Text>
        <Text style={[styles.status, sos.resolved ? styles.completedStatus : styles.activeStatus]}>
          {sos.resolved ? "Resolved" : "Active"}
        </Text>
      </View>

      <View style={styles.cardInfo}>
        <View style={styles.infoRow}>
          <Calendar size={16} color="#008080" />
          <Text style={styles.infoText}>
            {sos.date} at {sos.time}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <MapPin size={16} color="#008080" />
          <Text style={styles.infoText}>{sos.location}</Text>
        </View>
        <View style={styles.infoRow}>
          <Clock size={16} color="#008080" />
          <Text style={styles.infoText}>Response: {sos.responseTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderRouteCard = (route) => (
    <View key={route.id} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          {route.from} → {route.to}
        </Text>
        <Text style={styles.routeMode}>{route.mode}</Text>
      </View>

      <View style={styles.cardInfo}>
        <View style={styles.infoRow}>
          <Calendar size={16} color="#008080" />
          <Text style={styles.infoText}>{route.date}</Text>
        </View>
        <View style={styles.infoRow}>
          <Clock size={16} color="#008080" />
          <Text style={styles.infoText}>{route.duration}</Text>
        </View>
        <View style={styles.infoRow}>
          <Navigation size={16} color="#008080" />
          <Text style={styles.infoText}>{route.distance}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#17A2B8" />

      {/* Gradient Header */}
      <LinearGradient colors={["#17A2B8", "#20B2AA"]} style={styles.header}>
        <Plane size={28} color="white" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.headerTitle}>Travel History</Text>
          <Text style={styles.headerSubtitle}>Your journey records</Text>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        {historyTabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, selectedTab === tab.id && styles.activeTabButton]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <tab.icon size={18} color={selectedTab === tab.id ? "white" : "#008080"} />
            <Text
              style={[styles.tabText, selectedTab === tab.id && styles.activeTabText]}
            >
              {tab.emoji} {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {selectedTab === "trips" &&
          (tripHistory.length > 0 ? (
            tripHistory.map(renderTripCard)
          ) : (
            <View style={styles.emptyState}>
              <MapPin size={48} color="#008080" />
              <Text style={styles.emptyTitle}>No trip history yet</Text>
              <Text style={styles.emptySubtitle}>
                Start your first trip registration to see history here
              </Text>
            </View>
          ))}

        {selectedTab === "sos" &&
          (sosHistory.length > 0 ? (
            sosHistory.map(renderSOSCard)
          ) : (
            <View style={styles.emptyState}>
              <AlertTriangle size={48} color="#008080" />
              <Text style={styles.emptyTitle}>No SOS events</Text>
              <Text style={styles.emptySubtitle}>That's great! No emergencies</Text>
            </View>
          ))}

        {selectedTab === "routes" &&
          (routeHistory.length > 0 ? (
            routeHistory.map(renderRouteCard)
          ) : (
            <View style={styles.emptyState}>
              <Navigation size={48} color="#008080" />
              <Text style={styles.emptyTitle}>No routes recorded</Text>
              <Text style={styles.emptySubtitle}>Navigate to build route history</Text>
            </View>
          ))}

        <View style={styles.footer}>
          <LinearGradient
            colors={["#17A2B8", "#20B2AA"]}
            style={styles.exportButton}
          >
            <FileText size={20} color="white" />
            <Text style={styles.exportText}>Export History</Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FBFC" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "white" },
  headerSubtitle: { fontSize: 14, color: "white", opacity: 0.9 },
  tabsContainer: { marginTop: 16 },
  tabsContent: { paddingHorizontal: 16 },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#008080",
  },
  activeTabButton: { backgroundColor: "#008080", borderColor: "#008080" },
  tabText: { fontSize: 14, fontWeight: "500", marginLeft: 6, color: "#008080" },
  activeTabText: { color: "white" },
  content: { flex: 1, paddingHorizontal: 16, marginTop: 12 },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#333", flex: 1 },
  status: {
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedStatus: { backgroundColor: "#E8F5E8", color: "#2E7D32" },
  activeStatus: { backgroundColor: "#FFF3E0", color: "#F57C00" },
  cardInfo: { gap: 8 },
  infoRow: { flexDirection: "row", alignItems: "center" },
  infoText: { fontSize: 14, color: "#555", marginLeft: 8 },
  emergencyText: { color: "#FF6B35" },
  routeMode: {
    fontSize: 12,
    fontWeight: "600",
    color: "#008080",
    backgroundColor: "#E0F7FA",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptyState: { alignItems: "center", paddingVertical: 60 },
  emptyTitle: { fontSize: 20, fontWeight: "600", marginTop: 16, color: "#333" },
  emptySubtitle: { fontSize: 15, color: "#666", textAlign: "center", paddingHorizontal: 30 },
  footer: { alignItems: "center", paddingVertical: 32 },
  exportButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  exportText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginLeft: 8,
  },
});
